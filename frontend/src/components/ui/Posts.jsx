import React from 'react'
import Post from './Post'
import { useDispatch, useSelector } from 'react-redux'
import { clearPosts } from '@/redux/PostSlice';

function Posts() {
  const posts=useSelector((state)=>state.post.posts);

 
  console.log(posts,'from posts');

  return (
    <div>
        {posts?.map((post)=><Post key={post._id} post={post}/>)}
    </div>
  )
}

export default Posts