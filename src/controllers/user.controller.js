//Controller ,ASync handler was a wrapper function, helper fuction that takes req and res and then works based on promises  

import {asyncHandler} from '../utils/asyncHandler.js'

const registerUser = asyncHandler( async (req,res)=>{
    res.status(200).json({message:"OK"})
})

export {registerUser}