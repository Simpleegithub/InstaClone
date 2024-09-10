import { createSlice } from "@reduxjs/toolkit"

const initialState={
  likeNotifications:[]
}

const RealTimeNotification = createSlice({
  name: "RealTimeNotification",
  initialState,

  reducers:{
     setLikeNotifications:(state,action)=>{
        if(action.payload.type=='like'){
          state.likeNotifications.push(action.payload)
        } else if( action.payload.type=='dislike'){
          state.likeNotifications=state.likeNotifications.filter((like)=>like.userId!=action.payload.userId)
        }
     },

     RemoveNotification:(state,action)=>{
       state.likeNotifications=action.payload;
     }
  }


})

export const {setLikeNotifications,RemoveNotification}=RealTimeNotification.actions;

export default RealTimeNotification.reducer

