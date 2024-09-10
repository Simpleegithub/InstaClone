
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "@/redux/PostSlice";
import axios from "axios";

const UseGetAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get("https://instaclone-az8q.onrender.com/api/v1/post/all",{

        withCredentials: true,
        });

        if (res.data.success) {
            console.log(res.data.posts,'hi there');
          dispatch(addPost(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPosts();
  }, []);
};


export default UseGetAllPosts;