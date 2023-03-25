import React from 'react'

const MeetUpItem = (post) => {
  return (
    <div className='bg-slate-100 rounded-xl p-3'>
        <p className='font-semibold text-lg'>{post.post.name}</p>
        <div className='max-w-fit'>
        <p className='font-semibold text-sm p-2 py-1 bg-slate-300 rounded-2xl ' >{post.post.location}</p></div>
        <p className='text-gray-900'>{post.post.desc}</p>
    </div>
  )
}

export default MeetUpItem