import express from "express";
import  { addComment, addNewPost, BookMarkPost, deletePost, DislikePost, getAllCommentsofPost, getAllPosts, getUserPosts, likePost } from "../Controllers/PostController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/addpost").post(isAuthenticated,upload.single('image'),addNewPost);
router.route("/all").get(isAuthenticated,getAllPosts);
router.route("/userpost/all").get(isAuthenticated,getUserPosts);
router.route("/:id/like").get(isAuthenticated,likePost);
router.route("/:id/dislike").get(isAuthenticated,DislikePost);
router.route("/:id/comment").post(isAuthenticated,addComment);
router.route("/:id/comment/all").post(isAuthenticated,getAllCommentsofPost);
router.route("/delete/:id").post(isAuthenticated,deletePost);
router.route("/:id/bookmark").get(isAuthenticated,BookMarkPost);

export default router;
