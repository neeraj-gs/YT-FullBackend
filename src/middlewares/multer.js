//multer to act as a middleware, where we use to add whenever a file upload happens

import multer from 'multer'

const storage = multer.diskStorage({
    destination:function(req,file,cb){ //file has multer, req from user, if file comes then file is used , cb is a callback
        cb(null,'./public/temp') //folder where all files are stored
    },
    filename:function(req,file,cb){
        cb(null,file.originalname) //howt ostore each file
    }
})

export const upload = multer({storage: storage})

//when we write controllers or route,we can call storage methord and call it 

