


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "@/redux/PostSlice";
import axios from "axios";
import { setSuggestedUsers, setUserProfile } from "@/redux/AuthSlice";

const UseGetUserProfile = (id) => {
   
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSingleProfile = async () => {
      try {
        const res = await axios.get(`https://instaclone-az8q.onrender.com/api/v1/user/${id}/profile`,{

        withCredentials: true,
        });

        if (res.data.success) {
          console.log(res.data.user,'hi user');
           
      
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleProfile();
  }, [ id ]);
};


export default UseGetUserProfile;