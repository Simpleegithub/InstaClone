import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";   
import UserRoute from '../backend/routes/UserRoute.js'; 
import PostRoute from '../backend/routes/PostRoute.js';
import MessagRoute from '../backend/routes/MessageRoute.js';
import { app,server } from "./socket/socket.js";

dotenv.config();
import connectDB from "./utils/Dbconnction.js";
import Comment from "./Models/CommentModel.js";

import path from "path";
const __dirname = path.resolve();
console.log(__dirname);


// const app=express();






// Middle wares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));

const corsOptions={
    origin:process.env.URL,
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions ));


// All Apis

app.use("/api/v1/user",UserRoute);
app.use("/api/v1/post",PostRoute);
app.use("/api/v1/message",MessagRoute);

app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.use("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"/frontend/dist/index.html"));
})

const PORT=process.env.PORT || 5000;

server.listen(PORT,()=>{
    connectDB()
    console.log(`backend server is running on port ${PORT}`);
})