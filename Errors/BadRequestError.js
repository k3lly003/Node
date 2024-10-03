import CustomError from "./CustomError.js";
class BadRequestError extends CustomError{
    constructor(message){
        super(message);
        this.status = 400;
    }
}
export default BadRequestError;