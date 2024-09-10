import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    selectedPost: null,
};


const PostSlice = createSlice({
    name: "post",
    initialState,
    reducers:{
        addPost:(state,action)=>{
            state.posts=action.payload
        },
        AddsinglePost:(state,action)=>{
            state.posts=[action.payload,...state.posts]
        },
        DeletePost: (state, action) => {
            state.posts = state.posts.filter(
              (post) => post._id !== action.payload
            );
          },
        // update the single post by id
      
        clearPosts: (state) => {
            state.posts = []; // Clear all posts
          },

        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
          },
        
        
    }

});


export const {addPost,clearPosts,AddsinglePost,DeletePost,setSelectedPost} = PostSlice.actions;
export default PostSlice.reducer;