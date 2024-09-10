import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
      caption:{
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      author:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,

      },

      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],

    },
    { timestamps: true }
);


const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;