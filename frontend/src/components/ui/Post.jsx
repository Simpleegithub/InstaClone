import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { addPost, AddsinglePost, DeletePost, setSelectedPost } from "@/redux/PostSlice";
import { Badge } from "./badge";

export default function Post({ post }) {
 
  const [numofLikes, setNumofLikes] = useState(post?.likes?.length);
  const disptach = useDispatch();
  const posts = useSelector((state) => state?.post?.posts);

  const user = useSelector((state) => state?.auth?.user);



  const [isLiked, setIsLiked] = useState(post?.likes?.includes(user?.id));
  const [comments, setComments] = useState(post?.comments);


   

  // if(post.likes.includes(user?._id)){
  //   setIsLiked(true)
  // }
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const changeEventHandler = (e) => {
    // exclude spaces
    if (e.target.value.trim() !== "") {
      setText(e.target.value);
    } else {
      setText("");
    }
  };

// update Post
const updatePost = async () => {
  // refetch the post again 
  useEffect(() => {
    console.log("update the post")
  })
}

  const handleDeletePost = async () => {
    try {
      const res = await axios.post(
        `https://instaclone-az8q.onrender.com/api/v1/post/delete/${post._id}`,
        {}, // You need to pass an empty object if there's no body
        {
          withCredentials: true, // withCredentials should be inside this config object
        }
      );

      if (res.data.success) {
        // update the ui by delete post from redux
        disptach(DeletePost(post._id));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  const PostlikeDislike = async () => {
    try {
      const res = await axios.get(
        `https://instaclone-az8q.onrender.com/api/v1/post/${post._id}/like`,
        {
          withCredentials: true, // withCredentials should be inside the config object
        }
      );
  
      if (res.data.success) {
        // Update the `isLiked` state based on whether the user has liked the post
        setIsLiked(res.data.post.likes.includes(user?.id));

        
        
        // Update the number of likes
        setNumofLikes(res.data.post.likes.length);
        
        toast.success(res.data.message);
        console.log(res.data.post, "hi developer");
        
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };


  // add comment

  const addComment = async () => {
  try{
    const res=await axios.post(`https://instaclone-az8q.onrender.com/api/v1/post/${post._id}/comment`,{
      text
    },{
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      }
    })
    if(res.data.success){
      const updatedCommentData=[...comments,res.data.comment];
      setComments(updatedCommentData);
      const updatedPostsdata=posts.map((p)=>{
        if(p._id===post._id){
          return {...p,comments:updatedCommentData}
        } else{
          return p
        }
       
      })
      disptach(addPost(updatedPostsdata));
      toast.success(res.data.message);
      setText("");
    }

  } catch(error){
    console.log(error);
  }

  }


  // Bookmark Post

  const bookmarkPost = async () => {
    try{
      const res=await axios.get(`https://instaclone-az8q.onrender.com/api/v1/post/${post._id}/bookmark`,{
        
        withCredentials:true,
      
      })

      if(res.data.success){
        toast.success(res.data.message);
      }

    } catch(error){

    }
  

  }
  

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post?.author?.profilePicture} alt="post-img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {/* // if its author then show author otherwise show username */}
          <div className="flex items-center gap-2">
            <h1>{post?.author?.username}</h1>
            {user?.username === post?.author?.username && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
          
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col cursor-pointer items-center text-sm text-center justify-center">
            {user?.username !== post?.author?.username && (
             <Button
             variant="ghost"
             className="cursor-pointer text-fit text-[#ED4956] font-bold w-max"
           >
             UnFollow
           </Button>
            )}
        
            <Button variant="ghost" className="cursor-pointer text-fit  w-max">
              Add to Favorite
            </Button>
            {user?.username === post?.author?.username && (
              <Button
                variant="ghost"
                className="cursor-pointer text-fit  font-bold w-max"
                onClick={() => handleDeletePost(post._id)}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rouded-sm my-2 w-full aspect-square object-cover"
        src={post?.image}
        alt=""
      />
      <div className="">
        <div className="flex items-center justify-between my-2 ">
          <div className="flex items-center gap-3">
            {isLiked ? (
              <FaHeart
                color={"#ED4956"}
                size={"22px"}
                className="cursor-pointer hover:text-gray-600"
                onClick={PostlikeDislike}
              />
            ) : (
              <FaRegHeart
                size={"22px"}
                className="cursor-pointer hover:text-gray-600"
                onClick={PostlikeDislike}
              />
            )}
            <MessageCircle
              onClick={() => {
                disptach(setSelectedPost(post));
                setOpen(true)
              }}
              className="cursor-pointer hover:text-gray-600"
            />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark onClick={bookmarkPost} className="cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      <span className="font-medium block mb-2">{numofLikes} likes </span>
      <p>
        <span className="font-medium mr-2">username</span>
        <span>{post?.caption}</span>
      </p>
      <span
        onClick={() => {
          disptach(setSelectedPost(post));
          setOpen(true)
        }}
        className="cursor-pointer text-sm text-gray-400"
      >
       { comments.length > 0 && <p> view all {comments.length} comments</p>}
       
      </span>
      <CommentDialog open={open} setOpen={setOpen} updatePost={updatePost} />
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text.length > 0 && <span className="text-[#3BADF8] cursor-pointer" onClick={addComment}>Post</span>}
      </div>
    </div>
  );
}
