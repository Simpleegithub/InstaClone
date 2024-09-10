import { Server } from "socket.io";
import express from "express";

const app = express();

import http from "http";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.URL,

    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // This will store all the connected users socket ids

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(" user connected", userId, "socket id", socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // disconnect

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log("user disconnected", userId, "socket id", socket.id);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
