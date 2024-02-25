//app is for express thorugh
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors()); //use keyword is reserved for middlewares

//best security prqactices
app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser()); //



//ROutes
import userRouter from './routes/user.routes.js'

//Routes dealaration
//we dont export router then we use app.get, as we write routes and functin here ,to get router now we need middelware so we use app.use
app.use("/api/v1/users",userRouter); //when /users url is hit then userRouter will handler it 
//users acrs as a prefix
//control gone to userRouter, then handled by routes based on the link




export default app

//data can be taken from cookies as well , stored on clietn browsers and taken from browser