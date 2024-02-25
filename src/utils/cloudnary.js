//Files come thorugh file system through server 
//a local file path is given, files to the server 
// then upload , after successful upload remove file from server

import fs from 'fs'
import {v2 as cloudinary} from 'cloudinary';
//unlink path - file is removed from system


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
}); //config gives permission to upload file 


const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const res = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        //file uploaded successfully
        console.log("File is Uploaded on Cloudinary: ",res.url); //public url is taken 
        fs.unlinkSync(localFilePath)
        return res;
    } catch (error) {
        //if file is not uploaded successfully 
        //remove file from server
        fs.unlinkSync(localFilePath); //
        return null;
        
    }
}


export {uploadOnCloudinary}



