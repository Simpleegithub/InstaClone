
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/ChatSlice";

const UseGetRealTimeMsg = () => {
  const dispatch = useDispatch();
  const socket=useSelector((state)=>state.socketio.socket);
  const messages=useSelector((state)=>state.chat.messages);
  useEffect(() => {
 
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage?.message]));
    })

    return () => {
      socket?.off("newMessage");
    }
   
  }, [messages,setMessages]);
};


export default UseGetRealTimeMsg;