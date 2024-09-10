import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../Models/PostModel.js";
import User from "../Models/UserModel.js";
import Comment from "../Models/CommentModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const addNewPost = async (req, res, next) => {
  try {
    console.log(req.body,'from line 7');
    const { caption } = req.body;
    const image = req.file;
   
    const authorid = req.id;
    if (!image) {
      return res.status(400).json({
        message: "Please provide image",
        success: false,
      });
    }
    const optimizedImage = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 90 })
      .toBuffer();
    const fileUri = `data:image/jpeg;base64,${optimizedImage.toString(
      "base64"
    )}`;
    const CLoudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: CLoudResponse.secure_url,
      author: authorid,
    });

    const user = await User.findById(authorid);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      post,
    });
  } catch (error) {}
};

// Get all Posts

export const getAllPosts = async (req, res, next) => {
  try {

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      message: "Posts fetched successfully",
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get User Posts

export const getUserPosts = async (req, res, next) => {
  try {
    const authurid = req.id;
    const posts = await Post.find({ author: authurid })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      message: "Posts fetched successfully",
      success: true,
      posts,
    });
  } catch (error) {}
};

// Like Post
export const likePost = async (req, res, next) => {
  try {
    const likeKranywalaykiid = req.id; // ID of the user liking/disliking the post
    const postid = req.params.id; // ID of the post
    const post = await Post.findById(postid); // Find the post by ID

    // Check if post exists
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    const user = await User.findById(likeKranywalaykiid);
    const postOwnerId = post.author.toString();

    // Check if the user has already liked the post
    if (post.likes.includes(likeKranywalaykiid)) {
      // User already liked the post, so we dislike (remove the like)
      post.likes.pull(likeKranywalaykiid); // Remove user ID from likes array
      await post.save(); // Save the updated post

      // Send notification only if the post owner is different from the user disliking the post
      if (user && postOwnerId !== likeKranywalaykiid) {
        const notification = {
          type: "dislike",
          userId: likeKranywalaykiid,
          postId: postid,
          userDetails: user,
          message: `${user.username} disliked your post`,
        };

        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        console.log("postOwnerSocketId", postOwnerSocketId);
        if (postOwnerSocketId) {
          io.to(postOwnerSocketId).emit("notification", notification);
        }
      }

      return res.status(200).json({
        message: "Post disliked successfully",
        success: true,
        post,
      });
    }

    // User hasn't liked the post yet, so we like (add the like)
    post.likes.push(likeKranywalaykiid); // Add user ID to likes array
    await post.save(); // Save the updated post

    // Send notification only if the post owner is different from the user liking the post
    if (user && postOwnerId !== likeKranywalaykiid) {
      const notification = {
        type: "like",
        userId: likeKranywalaykiid,
        postId: postid,
        userDetails: user,
        message: `${user.username} liked your post`,
      };

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      console.log(postOwnerSocketId,'postOwnerSocketId')
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit("notification", notification);
        console.log('notification sent')
      }
    }

    return res.status(200).json({
      message: "Post liked successfully",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};



export const DislikePost = async (req, res, next) => {
  try {
    console.log('hi like fucntion')
    const likeKranywalaykiid = req.id;
    const postid = req.params.id;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if (post.likes.includes(likeKranywalaykiid)) {
      post.likes.pull(likeKranywalaykiid);
      await post.save();
    } else {
      return res.status(400).json({
        message: "Already disliked",
        success: false,
      });
    }

    // implement socket Io for notification

    return res.status(200).json({
      message: "Post liked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Add Comment
export const addComment = async (req, res, next) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Please provide text",
        success: false,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Create the comment without populating
    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    await comment.save();

    // Populate the comment and fetch it again
    const populatedComment = await Comment.findById(comment._id)
      .populate({ path: "author", select: "username profilePicture" });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added successfully",
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Gell all comments of single Post

export const getAllCommentsofPost = async (req, res, next) => {
  try {
    const postid = req.params.id;
    const comments = await Comment.find({ post: postid }).populate({
      path: "author",
      select: "author,username profilePicture",
    });

    if (!comments) {
      return res.status(404).json({
        message: "Comments not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Comments fetched successfully",
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

// Delete Post

export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
  
    const autherId = req.id;
    const user = await User.findById(autherId);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    // Check if the owner of the post is the same as the logged in user
    if (post.author.toString() !== autherId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }
    await Post.findByIdAndDelete(postId);
    // Delete the postId in the posts array of the user
    await user.updateOne({ $pull: { posts: postId } });
    await user.save();

    // Delete all the comments of the post
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// BookMark Post
export const BookMarkPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (user.bookmarks.includes(postId)) {
      // remove bookmark
      user.bookmarks.pull(postId);
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmarks",
        success: true,
      });
    }

    user.bookmarks.push(postId);

    await user.save();

    return res.status(200).json({
      type: "saved",
      message: "Post saved to bookmarks",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
