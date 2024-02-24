class ApiError extends Error {
    constructor(
        statusCode,
        message="Something Went Wrong, Default Message",
        errors=[], //for multiple errors
        stack ="" //error stack
    ){
        super(message) //we need to call super if we are overriding contructor
        this.statusCode = statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export {ApiError}