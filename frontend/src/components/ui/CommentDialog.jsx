import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link } from "react-router-dom";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import CommentComponent from "./CommentComponent";
import axios from "axios";
import { toast } from "sonner";
import { addPost } from "@/redux/PostSlice";

function CommentDialog({ open, setOpen,updatePost }) {
  const dispatch = useDispatch();
  const selectedPost = useSelector((state) => state?.post?.selectedPost);
  const [comment, setComment] = useState(selectedPost?.comments);
  const posts=useSelector((state)=>state?.post?.posts);
  console.log(selectedPost);
  const [text, setText] = useState("");

  useEffect(() => {
    if(selectedPost){

      setComment(selectedPost?.comments);
    
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    // exclude spaces
    if (e.target.value.trim() !== "") {
      setText(e.target.value);
    } else {
      setText("");
    }
  };

  const addComment = async () => {
    try{
      const res=await axios.post(`https://instaclone-az8q.onrender.com/api/v1/post/${selectedPost._id}/comment`,{
        text
      },{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      })
      if(res.data.success){
        updatePost()
       
        const updatedCommentData=[...comment,res.data.comment];
        setComment(updatedCommentData);
        const updatedPostsdata=posts.map((p)=>{
          if(p._id===selectedPost._id){
            return {...p,comments:updatedCommentData}
          } else{
            return p
          }
         
        })
        dispatch(addPost(updatedPostsdata));
        toast.success(res.data.message);
        setText("");
      }
  
    } catch(error){
      console.log(error);
    }
  
    }
  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="max-w-5xl p-0 flex flex-col"
        >
          <div className="flex  flex-1">
            <div className="w-1/2">
              <img
                src={selectedPost?.image}
                alt=""
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            <div className="flex flex-col justify-between w-1/2">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage
                        src={selectedPost?.author?.profilePicture}
                        alt="post-img"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs">
                      {selectedPost?.author?.username}
                    </Link>
                    {/* <span className="text-gray-600 text-sm">Bio Here....</span> */}
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm">
                    <div className="cursor-pointer text-fit text-[#ED4956] font-bold w-max">
                      Unfollow
                    </div>
                    <div className="cursor-pointer text-fit  w-max">
                      Add to Favorite
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {comment?.map((comment) => (
                  <CommentComponent key={comment._id} comment={comment} />
                ))}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={changeEventHandler}
                    className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                  />
                  <Button
                    disabled={text.trim() === ""}
                    variant="outline"
                    onClick={addComment}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CommentDialog;
