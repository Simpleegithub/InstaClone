import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import UseGetAllPosts from '@/Hooks/UseGetAllPosts';
import { useDispatch } from 'react-redux';
import { clearPosts } from '@/redux/PostSlice';
import UseGetSuggestedUser from '@/Hooks/UseGetSuggestedUser';



function Home() {
  const dispatch=useDispatch();
    UseGetAllPosts();
    UseGetSuggestedUser();

    // function clearredux(){
    //   dispatch(clearPosts())
 
    // }
    // clearredux()
  return (
    <div className='flex '>
      <div className='flex-grow '>
       <Feed/>
       <Outlet/>
      </div>
      <div>
        <RightSidebar/>
      </div>
    </div>
  )
}

export default Home