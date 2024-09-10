
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';

  import storage from 'redux-persist/lib/storage'
import PostSlice from "./PostSlice";
import scoketSlice from "./scoketSlice";
import ChatSlice from "./ChatSlice";
import RealTImeNotificationSlice from "./RealTImeNotificationSlice";





const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer=combineReducers({
  auth:AuthSlice,
  post:PostSlice,
  socketio:scoketSlice,
  chat:ChatSlice,
  RealTimeNotifications:RealTImeNotificationSlice
})


const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});

export default store