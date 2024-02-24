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


export default app

//data can be taken from cookies as well , stored on clietn browsers and taken from browser