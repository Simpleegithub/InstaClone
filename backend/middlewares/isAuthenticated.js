import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {

    try{
        const token=req.cookies.token || req.headers["cookies"];
        console.log(token,'i am from here');

        if(!token){
            return res.status(401).json({
                message: "Please login to continue",
                success: false
            })
        }
        const decode=jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        }
        req.id=decode.id;
        next();

    } catch(error){
        console.log(error);
    }


}


export default isAuthenticated;