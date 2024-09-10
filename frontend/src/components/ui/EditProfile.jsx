import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { setAuthUser } from "@/redux/AuthSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function EditProfile() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(""); // store the file instead of the Data URL
  const [Bio, setBio] = useState("");
  const [gender, setGender] = useState("Gender");
  const navigate=useNavigate();

  const imageRef = useRef(null);
  const user = useSelector((state) => state?.auth?.user);

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // store the file directly
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("profilePicture", image); // assuming `image` is a File object
    formData.append("bio", Bio);
    formData.append("gender", gender);

    try {
      const res = await axios.post("http://localhost:5000/api/v1/user/edit/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res?.data?.user));
        console.log(res.data.user, "hi user");
        toast.success(res.data.message);
        setBio("");
        setGender("Gender");
        navigate(`/profile/${res.data.user?.id || res.data.user?._id}`);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pl-10 flex">
      <section className="flex flex-col gap-6 w-full my-6">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={image ? URL.createObjectURL(image) : user?.profilePicture} // convert file to a URL only when rendering
                alt="post-img"
                className="rounded-full w-10 h-10"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-sm font-bold mb-[-5px]">{user?.username}</h1>
              <span className="text-gray-600 text-sm ">{user?.bio || "No Bio"}</span>
            </div>
          </div>

          <input type="file" name="" id="" hidden ref={imageRef} onChange={handleChange} />
          <Button className="bg-[#0095F6] h-8 hover:bg-[#3782b4]" onClick={() => imageRef.current.click()}>
            Change Profile
          </Button>
        </div>

        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            name="bio"
            value={Bio}
            onChange={(e) => setBio(e.target.value)}
            className="focus-visible:ring-transparent resize-none"
          />
        </div>

        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select
          defaultValue={gender}
            className="focus-visible:ring-transparent border-transparent outline-none w-full"
            placeholder="Gender"
            value={gender}
            onValueChange={setGender}
          >
            <SelectTrigger className="w-full focus-visible:ring-transparent" >
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          {loading ? (
            <Button className="bg-[#0095F6] h-8 hover:bg-[#3782b4] w-fit" >
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Please wait
            </Button>
          ) : (
            <Button className="bg-[#0095F6] h-8 hover:bg-[#3782b4] w-fit" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
