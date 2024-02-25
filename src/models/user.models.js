import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';

//direct encryption is not possible so we need ot use Pre Hook - A middlewware that executes just before the data is saved

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, //to make a field searchable , it makes query faster
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //cloudnary url 
        required:true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String, //Password is always encrypted, 
        required:[true,"Passowrd is Required"], //custom error message
    },
    refreshToken:{
        type:String,
    }
},{timestamps: true})


userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10); //encrypt done
    next();
})


//we can inject any number fo methords and make it better
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password) //cryptography 
    //returns true or false , we can 
}


userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id:this._id, //already all mehotrds are stored in database
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id:this._id, //already all mehotrds are stored in database
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User',userSchema);