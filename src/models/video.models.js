import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({},{timestamps:true})

const Video = mongoose.model('Video',videoSchema);