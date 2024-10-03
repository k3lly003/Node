import express from 'express';
import  userController from '../controllers/userController.js';
const  userRouter = express.Router();

// Admin signup and OTP verification
userRouter.post('/signup', userController.adminSignup);
userRouter.post('/verify-otp', userController.verifyOTP);

// Login for both admin and users
userRouter.post('/login', userController.login);

// Admin user management (create, update, delete users)
userRouter.post('/create-user', userController.createUser);
userRouter.put('/update-user/:id', userController.updateUser);
userRouter.delete('/delete-user/:id', userController.deleteUser);

// Password reset
userRouter.post('/forgot-password', userController.forgotPassword);
userRouter.post('/reset-password', userController.resetPassword);

export default  userRouter;
