import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

function CommentComponent({comment}) {
  return (
    <div className='my-2'>
        <div className='flex gap-3 items-center'>
            <Avatar>
                <AvatarImage className='rounded-full w-8 h-8' src={comment?.author?.profilePicture}/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className='font-bold text-sm'>{comment?.author?.username} <span className='pl-1'>{comment?.text}</span></h1>
        </div>
    </div>
  )
}

export default CommentComponent