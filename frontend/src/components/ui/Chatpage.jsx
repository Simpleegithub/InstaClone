import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { SetSelectedUser } from "@/redux/AuthSlice";
import { Input } from "./input";
import { Button } from "./button";
import { MessageCircleCode } from "lucide-react";
import { Messages } from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/ChatSlice";
import { useNavigate } from "react-router-dom";

export const Chatpage = () => {
  const navigate=useNavigate();
    const [textMessages, setTextMessages] = React.useState("");
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.chat.OnlineUsers);
  // const isOnline = true;
  const user = useSelector((state) => state.auth.user);
  const suggestedUsers = useSelector((state) => state.auth.suggestedUsers);
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const messages=useSelector((state)=>state.chat.messages);
//   console.log(messages,'messages')

useEffect(() => {
   if(!user){
    navigate("/login");
   }
}, []);

  const sendMessagesHandler = async (id) => {

    try {
      const res = await axios.post(`http://localhost:5000/api/v1/message/send/${id}`,JSON.stringify({message:textMessages}),{
        headers: {
           
            "Content-Type": "application/json",

        },
        withCredentials: true,
      });

      if(res.data.success){
        dispatch(setMessages([...messages,res.data.newMessage]));
        setTextMessages("");
       
        
     
        console.log(res.data);

      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex ml-[18%] h-screen">
      {/* Sidebar Section */}
      <section className="w-[22%]">
        <h1 className="font-bold my-[14px] px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => {
                    dispatch(SetSelectedUser(suggestedUser));
                 
                }}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span className={`text-xs font-bold ${isOnline ? "text-green-500" : "text-red-500"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col h-full">
        {selectedUser ? (
          <section className="flex-1 border-l border-gray-300 flex flex-col h-full">
            {/* Header */}
            <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
              <Avatar>
                <AvatarImage src={selectedUser?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{selectedUser?.username}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Messages will be shown here */}
              <Messages selectedUser={selectedUser}  />
            </div>

            {/* Input Box */}
            <div className="flex items-center p-4 border-t border-gray-300">
              <Input type="text" value={textMessages} onChange={(e) => setTextMessages(e.target.value)} placeholder="Message" className="flex-1 focus-visible:ring-transparent" />
              <Button onClick={()=>sendMessagesHandler( selectedUser?._id || selectedUser?.id)}>Send</Button>
            </div>
          </section>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <MessageCircleCode className="w-32 h-32 my-4" />
            <h1 className="text-xl font-medium">Your Messages</h1>
            <span>Send a message to start a chat</span>
          </div>
        )}
      </div>
    </div>
  );
};
