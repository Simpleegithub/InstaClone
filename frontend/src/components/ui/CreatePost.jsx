import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./dialog";
import { Loader2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage } from "./avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { readfileasDataUrl } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addPost, AddsinglePost } from "@/redux/PostSlice";

function CreatePost({ open, setOpen }) {
  const user = useSelector((state) => state?.auth?.user);

  const dispatch = useDispatch();
  const imageref = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [ImagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("caption", caption);
    if (ImagePreview) {
      formdata.append("image", file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://instaclone-az8q.onrender.com/api/v1/post/addpost",
        formdata,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(AddsinglePost(res.data.post));

        setCaption("");
        setImagePreview("");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const FilechangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const datauri = await readfileasDataUrl(file);
      console.log(datauri);
      setImagePreview(datauri);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-bold">
          Create New Post
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post-img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xs font-semibold">{user?.username}</h1>
            <span className="text-gray-600 text-sm">Bio here....</span>
          </div>
        </div>
        <Textarea
          className="focus-visible:ring-transparent  border-none outline-none  "
          placeholder="Write a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {ImagePreview && (
          <div className="w-full h-auto flex items-center justify-center">
            <img
              src={ImagePreview}
              alt="post-img"
              className="w-full aspect-square object-cover h-64 rounded-md"
            />
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={imageref}
          onChange={FilechangeHandler}
        />
        <Button
          className="w-fit mx-auto bg-[#0095f6] hover:bg-[#258bcf]"
          onClick={() => imageref.current.click()}
        >
          Select from a Computer
        </Button>
        {ImagePreview &&
          (loading ? (
            <Button disabled>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
              {/* Add margin-right here */}
              Please wait
            </Button>
          ) : (
            <Button type="submit" onClick={createPostHandler}>
              Post
            </Button>
          ))}

        {/* { ImagePreview ? <Button>Post</Button> : "loading..."} */}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
