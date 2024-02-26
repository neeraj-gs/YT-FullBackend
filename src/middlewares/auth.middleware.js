import jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

//just verifies if user is presetn or not 
export const verifyJWT = asyncHandler(async(req,_,next)=>{ //when res is not used we can use _

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        throw new ApiError(401,"Unauthorized")
    }

    const verify = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(verify?._id).select("-password -refreshToken") //user is present

    if(!user){
        throw new ApiError(401,"Invalid Access TOKen")
    }

    req.user = user; //we add request wth new objec tof user and then return to net
    //this sends the user to the place where there is no way to get user in a specific one
    next();
    } catch (error) {
        throw new ApiError(401,"Invalid Access TOKen")
        
    }

})