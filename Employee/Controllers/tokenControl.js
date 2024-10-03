import tokenModel from "../Models/tokenModel.js";
import BadRequestError from "../../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../../middleware/async.js";

const addToken = asyncWrapper(async (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg));
    }
    const newToken = await tokenModel.create(req.body);
    return res.status(201).json(newToken);
});

const findByUser = asyncWrapper(async (req, res, next) => {
    const tokenOwner = req.query.user;

    const foundToken = await tokenModel.findOne({tokenOwner});
    return res.status(200).json({
        foundToken
    });
});

const deleteToken = asyncWrapper(async (req, res,next) =>{
    const deleteToken = await tokenModel.findByIdAndDelete(req.query.id);
    return res.status(200).json({message: 'Token deleted', deleteToken})
});

const tokenControllers = {
    addToken,
    findByUser,
    deleteToken
}
export default tokenControllers;