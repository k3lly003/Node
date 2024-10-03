import userModel from "../Models/AuthModel.js";
import NotFoundError from "../../Errors/NotFoundError.js";
import BadRequestError from "../../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../../middleware/async.js";
import sendEmail from "../../utils/sendEmail.js";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import Token from '../Models/tokenModel.js';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import otpGenerator from '../utils/otp.js';

const signUp = asyncWrapper(async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg));
    };
    const foundUser = await userModel.findOne({ email: req.body.email});
    if(foundUser){
        return next(new BadRequestError("Email already in use"));
    };
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);

    const otp = otpGenerator(); 
    const otpExpirationDate =new Date().getTime() + (60 * 1000 * 5)

    const newUser = await userModel.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        otp: otp,
        otpExpires: otpExpirationDate,
    });
    const savedUser = await newUser.save();
    sendEmail(req.body.email, "Verify your account", `Your otp is ${otp}`);
    if(savedUser) {
        return res.status(201).json({
            message: "user account created!",
            user: savedUser
        });
    }
});

const validateOtp = asyncWrapper(async (req, res)=>{
    //validate 
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg));
    }
    //checking if the given otp is stored in the database
    const foundUser = await userModel.findOne({otp: req.body.otp});
    if(!foundUser){
        next(new UnauthorizedError('Authorisation denied'))
    }
    //updating a user to be verified
    foundUser.verified = true;
    const savedUser = await foundUser.save();
    if(savedUser){
        return res.status(201).json({
            message: "user account verified",
            user: savedUser
        })
    }
});

const signIn = asyncWrapper(async (req, res, next) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }

    // Check if the user exists
    const foundUser = await userModel.findOne({email: req.body.email });
    if (!foundUser) {
        return next(new BadRequestError("Invalid email or password"));
    }

    // Check if the account is verified
    if (!foundUser.verified) {
        return next(new BadRequestError("Your account is not verified!"));
    }

    // Compare the password asynchronously
    const isPasswordVerified = await bcrypt.compareSync(req.body.password, foundUser.password);
    if (!isPasswordVerified) {
        return next(new BadRequestError("Invalid email or password!"));
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: foundUser._id, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // cookie expiration 24h
        httpOnly: true,
    };

    // Send response
    res.status(200).cookie("token", token, options).json({
        message: "User logged in successfully",
        token: token,
        user: foundUser,
    });
});


const forgotPassword = asyncWrapper(async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg));
    }
    //find user
    const foundUser = await userModel.findOne({ email: req.body.email});
    if(!foundUser){
        return next(new BadRequestError("Your email is not registered"));
    }
    //generate token
    const token = jwt.sign({id: foundUser.id}, process.env.JWT_SECRET, {expiresIn: "24h"});

    //Recording the token to the database
    await Token.create({
        token: token,
        user: foundUser ._id,
        expirationDate: new Date().getTime() + (60 * 1000 *30)
    });
    const link = `http://localhost:5000/reset-password?token=${token}&id=${foundUser.id}`;
    const emailBody = `click on the link bellow to reset your password\n\n${link}`;

    await sendEmail(req.body.email, "Reset your password", emailBody);
    res.status(200).json({
        message: "we sent a reset password link on your email",
    });
 });

 const resetPassword = asyncWrapper(async (req, res, next) =>{
    const { token, id, password } = req.body;

    //validate input
    if(!token || !id || !password){
       return next(new BadRequestError("Token, id and new password are required"));
    }
    //verify token
    const foundToken = await Token.findOne({token});
    if(!foundToken){
       return next(new BadRequestError("Invalid or expired token"));
    }
    //update user's password
    foundToken.password = password;
    await foundToken.save();

    //delete the token from the database
    await Token.deleteOne({token});
    res.status(200).json({
       message: "password reset successfully",
    })
});

const deleteUser = asyncWrapper(async (req,res,next) =>{
    const id = req.params.id;
    const user = await userModel.findByIdAndDelete(id);
    if(!user){
        return next(new NotFoundError(`No user with id ${id}`, 404));
    }
    res.status(200).json({message: 'User deleted'});
 });

 const userController = {
    signUp,
    validateOtp,
    signIn,
    forgotPassword,
    resetPassword,
    deleteUser
}
export default userController;

