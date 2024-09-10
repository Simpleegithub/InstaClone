import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UseGetAllMessages from '@/Hooks/UseGetAllMessages';
import UseGetRealTimeMsg from '@/Hooks/UseGetRealTimeMsg';

export const Messages = ({ selectedUser }) => {
    UseGetRealTimeMsg()
  // Fetch all messages (ensure this is necessary based on your app logic)
  UseGetAllMessages();
  
  // Retrieve messages and current user from the Redux store
  const messages = useSelector((state) => state.chat.messages);
  const currentUser = useSelector((state) => state.auth.user);
  console.log('all messages',messages);
  console.log('current user',currentUser.id);

  return (
    <div className='overflow-y-auto flex-1 p-4'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <Avatar className="w-20 h-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button variant="secondary" className="h-8 my-2">ViewProfile</Button>
          </Link>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`flex gap-3 items-center p-3 ${
              msg.senderId === currentUser.id || currentUser._id ? "justify-end" : "justify-start"
            }`}
          >
            <div className={`p-2 rounded break-words ${msg.senderId === currentUser.id || currentUser._id ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
