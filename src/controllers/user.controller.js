//Controller ,ASync handler was a wrapper function, helper fuction that takes req and res and then works based on promises  

import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudnary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { response } from 'express'



const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accesst = user.generateAcccessToken() 
        const refresht = user.generateRefreshToken()

        user.refreshToken = refresht; //save refreshtoken in db
        await user.save({validateBeforeSave:false}) //we need passwd also when entering into db
        //dont add validation , just create it once

        return {accesst, refresht};



        
    } catch (error) {
        throw new ApiError(500,"Somethign went wrong while generating access token")
    }
}










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
    // const coverLocalPath = req.files?.coverImage[0]?.path 

    let coverLocalPath; //if optional chaigning does not work we use regular if  else statemetn
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path

    }
    
    
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



const loginUser = asyncHandler(async(req,res)=>{
    const {email,username,password} = req.body;
    if(!username || !email){
        throw new ApiError(400,"username or password is required")
    }

    const user = User.findOne({
        $or : [{username},{email}] //monog  db operator 
    })

    if(!user){
        throw new ApiError(404,"User Does not Exist , Plewase Sign Up")
    }

    //User is a mongo db object, and methords created in models, are available in user instance
    const isPasswdValid = await user.isPasswordCorrect(password)
     
    if(!isPasswdValid){
        throw new ApiError(401,"Invalid Credentials")
    }

    //access and refresh tokens createions
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

    //once we get acces and refresh token we need to send it in cookies 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //send cookies
    const options = {
        httpOnly: true, 
        secure:true, //cookies by default anyone can modify on frontend, when true then it is only modified by server
    }

    return response.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(200,{
            user: loggedInUser,accessToken,refreshToken
        },
        "User LOgged in Successfully"
        )
    )
    //can keep addding any number of cookie by chaning it andd passingoptions make it non dhangable in frontend 




})




const logoutUser = asyncHandler(async (req, res) => {
    //logout, remove cookies, tokens
    //we use middleware when we cant get user 

    //by adding cookie parser we can access cookies and access it in req and res


})














export {registerUser,loginUser}