import express from "express";
// import UserController from "../Controllers/UserController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { editProfile, FollowrOrUnfollow, getProfile, getSuggestedUser, login, logout, register } from "../Controllers/UserController.js";

const router = express.Router();

router.route("/register").post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated,getProfile);
router.route('/edit/profile').post(isAuthenticated,upload.single('profilePicture'),editProfile);
router.route('/suggested').get(isAuthenticated,getSuggestedUser);
router.route('/followOrunfollow/:id').post(isAuthenticated,FollowrOrUnfollow);


export default router;