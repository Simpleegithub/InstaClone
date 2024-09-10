


import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "@/redux/PostSlice";
import axios from "axios";
import { setSuggestedUsers } from "@/redux/AuthSlice";

const UseGetSuggestedUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchallSuggestedusers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/user/suggested",{

        withCredentials: true,
        });

        if (res.data.success) {
           
            console.log(res.data.users,'hi there');
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchallSuggestedusers();
  }, []);
};


export default UseGetSuggestedUser;