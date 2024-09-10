import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

function RightSidebar() {
  const user = useSelector((state) => state?.auth?.user);
  const users = useSelector((state) => state?.auth?.suggestedUsers);

  return (
    <div className="w-[400px] my-10 pr-28">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${user?._id || user?.id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post-img" className="rounded-full w-10 h-10" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        {/* // if its author then show author otherwise show username */}
        <div>
          <h1 className="text-sm font-semibold mb-[-5px]">
            <Link to={`/profile/${user?.id || user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-600 text-sm ">{user?.bio || "No Bio"}</span>
        </div>
      </div>
      <SuggestedUsers users={users} />
    </div>
  );
}

export default RightSidebar;
