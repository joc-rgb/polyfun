import React from 'react'

const MeetUpItem = (post) => {
    console.log(post.post)
  return (
    <div className='bg-slate-100 rounded-xl p-3'>
        <p className='font-semibold text-lg'>{post.post.name}</p>
        <div>
        <p className='font-semibold text-sm p-2 bg-slate-300 rounded-2xl ' >{post.post.location}</p></div>
        <p>{post.post.desc}</p>
    </div>
  )
}

export default MeetUpItem