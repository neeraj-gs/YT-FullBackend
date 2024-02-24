import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async()=>{
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) //mongoose gives a returned object, response
        console.log(`\n MongoDB Connected Successfully  DB HOST : ${db.connection.host}`)
        
    } catch (error) {
        console.log("MongoDB Connection Error: ",error)
        process.exit(1); //exit a process
    }
}

export default connectDb;