import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setAuthUser } from '@/redux/AuthSlice'; // Assuming you have this in your AuthSlice

function SuggestedUsers({ users }) {
  const currentUser = useSelector((state) => state?.auth?.user); // logged-in user
  const dispatch = useDispatch();

  const [followingStatus, setFollowingStatus] = useState({}); // Hold following status for each user

  // Initialize following state for each suggested user when the component mounts
  useEffect(() => {
    const initialFollowingStatus = {};
    users.forEach((user) => {
      initialFollowingStatus[user?._id] = currentUser?.following?.includes(user?._id);
    });
    setFollowingStatus(initialFollowingStatus); // Set initial following status for all users
  }, [users, currentUser?.following]);

  const handleFollowUnFollow = async (id) => {
    try {
      const res = await axios(`https://instaclone-az8q.onrender.com/api/v1/user/followOrunfollow/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data?.success) {
        toast.success(res.data.message);
        dispatch(setAuthUser(res.data.updateduser));

        // Toggle the following state for the specific user
        setFollowingStatus((prevStatus) => ({
          ...prevStatus,
          [id]: !prevStatus[id],
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See all</span>
      </div>

      {users?.map((user) => (
        <div key={user?._id} className="flex items-center justify-between my-5">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${user?._id}`}>
              <Avatar>
                <AvatarImage
                  src={user?.profilePicture}
                  alt="post-img"
                  className="rounded-full w-10 h-10"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <Link to={`/profile/${user?._id}`} className="">
              <h1 className="w-24 font-semibold mb-[-7px]">{user?.username}</h1>
              <span className="text-gray-600 text-xs">suggested for you</span>
            </Link>
          </div>
          <span
            className="text-[#38ADFB] text-xs font-bold cursor-pointer hover:text-[#3495D6]"
            onClick={() => handleFollowUnFollow(user?._id)}
          >
            {followingStatus[user?._id] ? 'Unfollow' : 'Follow'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SuggestedUsers;
