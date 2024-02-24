//just creets a methord and then exports it 


// to pass some other function adter passing a function
// const asyncHandler = (fn) => async(req,res,next) =>{
//     //to talk to databaswe
//     try {
//         await fn(req,res,next); //this is a wrapper function where we use it everywhere
        
//     } catch (error) {
//         console.log(error);
//         res.status(error.code || 500).json({success: false,message:error.message});
        
//     }
// }


const asyncHandler = (requestHandler)=>{
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>{
            next(err);
        })
    }
}

export {asyncHandler}
//higer order function - a fx that can acceot fucntions aws parameters and return the functions
//treats function as a varaible


