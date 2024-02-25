import {Router} from 'express'
import { registerUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.js'

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:'avatar', //frontend and backend has to be same
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1

        } 
        //avatar and cover image     

    ]), //fields accepts array
    registerUser)

export default router