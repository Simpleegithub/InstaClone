import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import SignUp from "./components/ui/SignUp";

import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import Home from "./components/ui/Home";
import Login from "./components/ui/Login";
import MainLayout from "./components/ui/MainLayout";
import Profile from "./components/ui/Profile";
import EditProfile from "./components/ui/EditProfile";
import { Chatpage } from "./components/ui/Chatpage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/scoketSlice";
import { setChat } from "./redux/ChatSlice";
import { setLikeNotifications } from "./redux/RealTImeNotificationSlice";
import ProtectedRoute from "./components/ui/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",

    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/profile/:id",
        element: <ProtectedRoute>
           <Profile />
        </ProtectedRoute>,
      },

      {
        path: "/account/edit",
        element: <ProtectedRoute>
          <EditProfile />
        </ProtectedRoute>,
      },

      {
        path: "/chat",
        element: (
          <ProtectedRoute>
            <Chatpage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: (
     
        <Login />
    
    ),
  },

  {
    path: "signup",
    element: <SignUp />,
  },
]);

function App() {
  const socket = useSelector((state) => state.socketio.socket);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: user._id || user.id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socket));

      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setChat(onlineUsers));
      });

      socket.on("notification", (notification) => {
        console.log(notification, "notification");
        dispatch(setLikeNotifications(notification));
      });

      return () => {
        socket.close();
        dispatch(setSocket(null));
      };
    } else {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
