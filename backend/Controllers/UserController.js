import User from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../Models/PostModel.js";

// Register Controller
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing Please fill all the fields",
        success: false,
      });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Login Controller

export const login = async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing Please fill all the fields",
        success: false,
      });
    }

    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Incorect email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorect email or password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const populatedPosts=await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId).populate("author", "username profilePicture");
        
          return post;
        
        

      })
    )

    user={
      id:user._id,
      username:user.username,
      email:user.email,
      profilePicture:user.profilePicture,
      bio:user.bio,
      followers:user.followers,
      following:user.following,
      posts:populatedPosts
    }

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: `Login successful ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

// Logout Controller

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 0,
      })
      .status(200)
      .json({
        message: "Logout successful",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// Get Profile Controller

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);

    // Find the user and populate "posts" and "bookmarks" in a single query
    const user = await User.findById(userId)
      .select("-password")
      .populate("posts")
      .populate("bookmarks");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User found",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


// Edit Profile Controller

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    // console.log(profilePicture);
    let Cloudresponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      Cloudresponse = await cloudinary.uploader.upload(fileUri.content);
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = Cloudresponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// Suggested User

export const getSuggestedUser = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } })
      .limit(5)
      .select("-password");
    if (!suggestedUser) {
      return res.status(404).json({
        message: "Currently no users found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User found",
      success: true,
      users: suggestedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

// Follow or Unfollow

export const FollowrOrUnfollow = async (req, res) => {
  try {
    const followkrnaWala = req.id;
    const jiskofollowkarunga = req.params.id;
    if (followkrnaWala == jiskofollowkarunga) {
      return res.status(401).json({
        message: "You can't follow yourself",
        success: false,
      });
    }

    const user = await User.findById(followkrnaWala);
    const targetUser = await User.findById(jiskofollowkarunga);

    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const isFollowing = user.following.includes(jiskofollowkarunga);
    if (isFollowing) {
      // try to unfollow it
      await Promise.all([
        User.updateOne(
          { _id: followkrnaWala },
          { $pull: { following: jiskofollowkarunga } }
        ),
        User.updateOne(
          { _id: jiskofollowkarunga },
          { $pull: { followers: followkrnaWala } }
        ),
      ]);

      // target user
      const targetUser=await User.findById(jiskofollowkarunga);
      console.log(targetUser);

      // update user
      const updateduser=await User.findById(followkrnaWala);
      console.log(updateduser)

      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
        targetUser,
        updateduser
      });
    } else {
      // try to follow it
      await Promise.all([
        User.updateOne(
          { _id: followkrnaWala },
          { $push: { following: jiskofollowkarunga } }
        ),
        User.updateOne(
          { _id: jiskofollowkarunga },
          { $push: { followers: followkrnaWala } }
        ),
      ])

      // target user
      const targetUser=await User.findById(jiskofollowkarunga);
      console.log(targetUser);

      // update user
      const updateduser=await User.findById(followkrnaWala);
      console.log(updateduser)

      return res.status(200).json({
        message: "followed successfully",
        success: true,
        targetUser,
        updateduser
      });
    }
  } catch (error) {
    console.log(error);
  }
};
