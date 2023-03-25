import { useEffect, useState } from 'react'
import { Auth } from '@polybase/auth'
import { ethPersonalSignRecoverPublicKey } from '@polybase/eth'
import { Polybase } from '@polybase/client'
import { useCollection } from '@polybase/react'
import MeetUpItem from './components/MeetUpItem'
import { makeid } from './util/helper'

const db = new Polybase({
  defaultNamespace: 'pk/0x99186e1192a9d0f2887e55152a83c0c27e9af74159032fca60a88c2315c28d824c5b0e300164fc55c46fe7b3d00e365d5d555754e77e4d5ee3df809896b6281e/polyfun',
})

const auth = new Auth()

async function getPublicKey() {
  const msg = 'Login To Polyfun'
  const sig = await auth.ethPersonalSign(msg)
  const publicKey = ethPersonalSignRecoverPublicKey(sig, msg)
  return '0x' + publicKey.slice(4)
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [publicKey, setPublicKey] = useState(null)
  const [postName, setPostName] = useState('')
  const [location, setLocation] = useState('')
  const [desc, setDesc] = useState('')

  const query = db.collection('MeetUp')
  const { data, error, loading } = useCollection(query)

  const signIn = async () => {
    const res = await auth.signIn()

    // get public
    let publicKey = res.publicKey

    if (!publicKey) {
      publicKey = await getPublicKey()
    }

    db.signer(async (data) => {
      return {
        h: 'eth-personal-sign',
        sig: await auth.ethPersonalSign(data),
      }
    })

    // Create user if not exists
    try {
      const user = await db.collection('User').record(publicKey).get()
      console.log('User', user)
    } catch (e) {
      await db.collection('User').create([])
    }

    setIsLoggedIn(!!res)
  }

  useEffect(() => {
    auth.onAuthUpdate((authState) => {
      setIsLoggedIn(!!authState)

      db.signer(async (data) => {
        return {
          h: 'eth-personal-sign',
          sig: await auth.ethPersonalSign(data),
        }
      })
    })
  })

  const createPost = async () => {
    if(!location||!postName||!desc) alert("Please fill up all the input.")
    const publicKey = await getPublicKey()
    const postId = makeid(6)
    await db.collection('MeetUp').create([postId, db.collection('User').record(publicKey), postName, location, desc])
  }
 
  return (
    <div className="flex flex-col w-full h-[100vh] text-black bg-white p-8">
      <div className="p-4 w-full flex items-center justify-center">
      <p className='font-bold text-4xl'>Polyfun</p>
      </div>
      {isLoggedIn?(
      <>
      <label>Name</label>
      <input type='text' onChange={e=>setPostName(e.target.value)} className='border rounded-xl p-1' />
      <label>Location</label>
      <input type='text' onChange={e=>setLocation(e.target.value)} className='border rounded-xl p-1' />
      <label>Description</label>
      <input type='text' onChange={e=>setDesc(e.target.value)} className='border rounded-xl p-1' />
      <div>
      <button onClick={createPost} className='my-4 p-3 font-semibold rounded-lg border border-gray-700 tracking-wide'>Create</button>
      </div>
      </>):
      
      <button onClick={signIn} >Login</button>}
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-3xl font-semibold">All MeetUp</p>
        {data && !loading && data.data.map(post=><MeetUpItem post={post.data} />)}
      </div>
      
    </div>
  )
}

export default App
