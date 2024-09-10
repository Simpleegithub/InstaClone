import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  suggestedUsers: [],
  userProfile: null,
  selectedUser:null
};

const Authslice = createSlice({
  name: "auth",
  initialState,

  reducers:{
    setAuthUser:(state,action)=>{
      state.user=action.payload;
    },

    setSuggestedUsers:(state,action)=>{
      state.suggestedUsers=action.payload;
    },

    setUserProfile:(state,action)=>{
      state.userProfile=action.payload;
    },

    SetSelectedUser:(state,action)=>{
      state.selectedUser=action.payload;
    }
  }
});

export const {setAuthUser,setSuggestedUsers,setUserProfile,SetSelectedUser} = Authslice.actions;

export default Authslice.reducer
