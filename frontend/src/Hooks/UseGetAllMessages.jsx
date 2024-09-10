
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/ChatSlice";

const UseGetAllMessages = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
       
        const res = await axios.get(`http://localhost:5000/api/v1/message/all/${selectedUser.id || selectedUser._id}`,{
        headers: {
          "Content-Type": "application/json",
        },

        withCredentials: true,
        });

        if (res.data.success) {
            console.log(res,'hi there');
          dispatch(setMessages(res.data.messages));
          console.log(res.data.messages,'janu')
      
        }
      } catch (error) {
        console.log(error);
      
      }
    };

    fetchAllMessages();
  }, [selectedUser]);
};


export default UseGetAllMessages;