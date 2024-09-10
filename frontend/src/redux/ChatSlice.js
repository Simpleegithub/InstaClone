import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    OnlineUsers: [],
    messages:[]
};


const chatSlice= createSlice({
    name: "chat",
    initialState,   

    reducers:{
        setChat: (state, action) => {
            state.OnlineUsers = action.payload
        },

        setMessages: (state, action) => {   
            state.messages = action.payload
        },
    }   


})

export const {setChat,setMessages} = chatSlice.actions;
export default chatSlice.reducer;