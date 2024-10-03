import express from 'express';
const Router2 = express.Router();
import userRouter from './authRout.js';
import tokenRouter from './tokenRout.js';
import employeeRouter from './userRout.js';
import leaveRequestRouter from './leaveRequestRoute.js';

Router2.use('/Emply-users', userRouter);
Router2.use('/tokens', tokenRouter);
Router2.use('/employees', employeeRouter);
Router2.use('/leaveRequests', leaveRequestRouter);

export default Router2;