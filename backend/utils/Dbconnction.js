// conection to db
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv
 const connectDB = async () => {
    try {
        console.log(process.env.PORT);
        await mongoose.connect(process.env.MONGO_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection error:", error);
        process.exit(1); // Exit the process with an error code if the database connection fails
    }
 }

 connectDB();


 export default connectDB;

