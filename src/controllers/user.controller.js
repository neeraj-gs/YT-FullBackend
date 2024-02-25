//Controller ,ASync handler was a wrapper function, helper fuction that takes req and res and then works based on promises  

import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudnary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { response } from 'express'

const registerUser = asyncHandler( async (req,res)=>{
    //register user
    //get user details from frontend[postman] fields depend on model
    //validation on input
    //check if user already exists
    //check for images, upload to cloudnary and put the url and remove the url from server
    //create user object and create entry in db 
    //remove passowrd and refresh token from response 
    //check for user creation and return res
    //resturn res


    const {fullName, username, email, password} = req.body
    if(
        [fullName, username, email, password].some((field)=> field.trim()==="")
    ){
        throw new ApiError(400,"All Fields are Required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })
    if(user){
        throw new ApiError(409, "User Already Exists");
    }

    //handling files or images
    const avatarLocalPath = req.files?.avatar[0]?.path //first property 
    const coverLocalPath = req.files?.coverImage[0]?.path 
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is Required")
    }

    //upload to cloudnary
    const avatar = await uploadOnCloudinary(avatarLocalPath) //it takes time
    const coverImage = await uploadOnCloudinary(coverLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is Required")
    }

    const userdb = await  User.create({
        fullName,
        avatar:avatar.url, //only url needs to be stored on the server
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(userdb._id).select(
        "-password -refreshToken"
    ) //mongo db creates an _id for each of the entry in the databse
    //

    if(!createdUser){
        throw new ApiError(500,"Cannot Register User at this time")

    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Created Successfully") //
    )

})

export {registerUser}