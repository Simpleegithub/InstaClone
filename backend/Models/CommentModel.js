import mongoose from "mongoose";

const CommentScehma = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        }
    },
    { timestamps: true }    
);

const Comment = mongoose.model("Comment", CommentScehma);
export default Comment;