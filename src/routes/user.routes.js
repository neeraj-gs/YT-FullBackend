import {Router} from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

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


router.route("/login").post(loginUser)

//routes when user is logged in only then rotue it 
//Secured Routes
router.route("/logout").post(verifyJWT,logoutUser)
//when we have a middleware then we get a secured route , if not present then we will re route them back






export default router