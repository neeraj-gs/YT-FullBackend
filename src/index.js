import dotenv from 'dotenv';
import connectDb from "./db/index.js";
import app from './app.js';

dotenv.config({
    path:'./env'
})

//Asynchronous mehtord on completion returns a promise
connectDb().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server Running on http://localhost:${process.env.PORT}`);
    })
}).catch((err)=>{
    console.error('Mongo DB Connection Error ', err);
})