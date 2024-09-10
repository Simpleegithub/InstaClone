import { setAuthUser, SetSelectedUser } from "@/redux/AuthSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { addPost, AddsinglePost, setSelectedPost } from "@/redux/PostSlice";
import { setMessages } from "@/redux/ChatSlice";
import { Popover, PopoverTrigger,PopoverContent  } from "./popover";
import { Button } from "./button";
import { RemoveNotification, setLikeNotifications } from "@/redux/RealTImeNotificationSlice";





function LeftSideBar() {
  const likeNotificaitons = useSelector((state) => state.RealTimeNotifications.likeNotifications);
  const [notificationlength,setNotificationlength]=useState( likeNotificaitons.length);
    const navigate = useNavigate();
    const user=useSelector((state)=>state.auth.user);
    const dispatch=useDispatch();
    const [open,setOpen]=useState(false);
    console.log(user,'hi from left side bar');

    const createPostHandler = () => {
      setOpen(true);
      
    }
    const handlelogout = async() => {
        try{
            const res= await axios.get("http://localhost:5000/api/v1/user/logout",{
                withCredentials: true,
            })
            console.log(res);
            if(res.data.success){
              dispatch(setAuthUser(null));
              dispatch(setSelectedPost(null));
              dispatch(AddsinglePost(null));
              dispatch(addPost([]));
              
                navigate("/login");

                toast.success(res.data.message);
            }

        }catch(error){
            console.log(error);
            toast.error(error.response.data.message);

        }
    }
  const sidebarhandler= (textType)=>{
      if(textType==="LogOut"){
         handlelogout()
      } else if(textType==="Create"){
        createPostHandler();
      } else if (textType==="Profile"){
        dispatch(setMessages([]))
         navigate(`/profile/${user?.id || user?._id}`)
      } else if (textType==="Home"){
        navigate("/")
      } else if(textType==="Messages"){
        dispatch(SetSelectedUser(null))
        navigate("/chat")

      }
   
  }

  const sidebarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="w-6 h-6 rounded-full overflow-hidden">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut  />,
      text: "LogOut",
    },
  ];
  return (
    <div className="fixed top-0 left-0 z-10 px-4 border-r border-green-300 w-[18%] h-screen ">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl  cursor-pointer" onClick={()=>navigate("/")}>Instagram</h1>
        <div>
          {sidebarItems.map((item) => (
            <div onClick={()=>sidebarhandler(item.text)} className="flex items-center gap-3 my-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg relative">
              {item.icon}
              <span className="">{item.text}</span>
              {
                item.text==="Notifications" && likeNotificaitons.length > 0 && <span className="text-xs text-red-500 ">
                  <Popover >
                    <PopoverTrigger asChild   >
               
               { notificationlength > 0 &&  <Button size="icon" className="rounded-full h-5 w-5 bg-red-600 absolute bottom-6 left-6 " >{likeNotificaitons.length}</Button>}
        
                    </PopoverTrigger>
                    <PopoverContent className="my-4">
                      <div>
                        {
                          likeNotificaitons.length==0 ? "No Notifications" : (
                            likeNotificaitons.map((notification)=>(
                             <div key={notification._id} className="flex items-center gap-2 ">

                              <Avatar>
                                <AvatarImage className=" " src={notification.userDetails?.profilePicture} />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <p className="text-sm">{notification.userDetails?.username} liked your post</p>
                             </div>
                            ))
                          )
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                </span>
              }
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  );
}

export default LeftSideBar;
