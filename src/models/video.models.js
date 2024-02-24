import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String, //from cloudnary url
        required:true
    },
    thumbnail:{
        type:String, //from cloudnary url
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number, //from cloudnary as cloudnary gives all information related to the video
    },
    views:{
        type:Number, //from cloudnary as cloudnary gives all information related to
        default:0,
    },
    isPublished:{
        type:Boolean, 
        default:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

const Video = mongoose.model('Video',videoSchema);