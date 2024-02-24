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
    email:{
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
    this.password = bcrypt.hash(this.password,10); //encrypt done
    next();
})


userSchema.methods.isPasswordCorrect = async function (password){
    bcrypt.compare(password,this.password)
}

export const User = mongoose.model('User',userSchema);