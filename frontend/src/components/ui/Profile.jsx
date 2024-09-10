import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link, useParams } from "react-router-dom";
import UseGetUserProfile from "@/Hooks/UseGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./button";
import { Badge } from "./badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/AuthSlice";

function Profile() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  console.log(user,'king user')
  UseGetUserProfile(id);
  const userProfile = useSelector((state) => state?.auth?.userProfile);

  const isloggedInUserProfile = user._id === id || user.id === id;
  // const isFollowing = user.following.includes(id);
  const [isFollowing,setisFollowing] = useState(user?.following?.includes(String(id)));


  // Use useEffect to update followers when userProfile is updated
  const [followers, setFollowers] = useState(userProfile?.followers.length);

  useEffect(() => {
    if (userProfile?.followers) {
      setFollowers(userProfile.followers.length);
    }
  }, [userProfile?.followers]);

  const [activeTab, setActiveTab] = useState("Posts");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  let displayedPost;

  if(activeTab === "Posts"){
    displayedPost=userProfile?.posts
  } else if (activeTab === "Saved"){
    displayedPost=userProfile?.bookmarks
  }
  // const displayedPost = activeTab === "Posts" ? userProfile?.posts : userProfile?.bookmarks;

  const handleFollowUnFollow = async () => {
    try {
      const res = await axios(`http://localhost:5000/api/v1/user/followOrunfollow/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data?.success) {
        console.log(res.data.targetUser,'from line 48')
        setFollowers(res.data?.targetUser?.followers.length);
        toast.success(res.data.message);
        dispatch(setAuthUser(res.data.updateduser));
        if(isFollowing){
          setisFollowing(false);
        }else{
          setisFollowing(true);
        } 
       
      
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex max-w-4xl mx-auto justify-center pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={userProfile?.profilePicture}></AvatarImage>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex gap-4 items-center">
                <span>{userProfile?.username}</span>
                {isloggedInUserProfile ? (
                  <div className="flex items-center gap-3">
                    <Link to="/account/edit">
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">
                        Edit Profile
                      </Button>
                    </Link>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      View Archive
                    </Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      Ad Tools
                    </Button>
                  </div>
                ) : isFollowing ? (
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" className=" h-8" onClick={handleFollowUnFollow}>
                      Unfollow
                    </Button>
                    <Button variant="secondary" className=" h-8">
                      Message
                    </Button>
                  </div>
                ) : (
                  <div>
              
                    <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8" onClick={handleFollowUnFollow}>
                      follow
                    </Button>
                
                </div>
                
                )}
              </div>
                

              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">{userProfile?.posts?.length} </span>
                  Posts
                </p>
                <p>
                  <span className="font-semibold">{followers} </span>
                  Followers
                </p>
                <p>
                  <span className="font-semibold">{userProfile?.following?.length} </span>
                  Following
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm">{userProfile?.bio}</span>
                <Badge variant="secondary" className="w-fit cursor-pointer">
                  <AtSign /> <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span className="text-sm">😊 Learn Code with Sir Jawad</span>
                <span className="text-sm">Turning code into an art</span>
                <span className="text-sm">DM for any queries</span>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${activeTab === "Posts" ? "font-bold border-b-2 border-black" : ""}`}
              onClick={() => handleTabChange("Posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${activeTab === "Saved" ? "font-bold border-b-2 border-black" : ""}`}
              onClick={() => handleTabChange("Saved")}
            >
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer ${activeTab === "Reels" ? "font-bold border-b-2 border-black" : ""}`}
              onClick={() => handleTabChange("Reels")}
            >
              REELS
            </span>
            <span
              className={`py-3 cursor-pointer ${activeTab === "Tags" ? "font-bold border-b-2 border-black" : ""}`}
              onClick={() => handleTabChange("Tags")}
            >
              TAGS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {displayedPost?.map((post) => (
              <div key={post?._id} post={post} className="relative group cursor-pointer">
                <img src={post?.image} alt="" className="rounded-sm my-2 w-full aspect-square object-cover" />
                <div className="absolute top-0 h-full inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span className="pl-1">{post?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span className="pl-1">{post?.comments?.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
