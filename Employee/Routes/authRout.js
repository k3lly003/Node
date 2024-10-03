import userController from "../Controllers/AuthControl.js";
import express from 'express';
const userRouter = express.Router();

userRouter.post('/signup',userController.signUp);
userRouter.post('/signIn',userController.signIn)
userRouter.post('/verify',userController.validateOtp);
userRouter.post('/forgotPassword', userController.forgotPassword);
userRouter.post('/resetPassword', userController.resetPassword);
userRouter.delete('/delete/:id', userController.deleteUser);

export default userRouter;