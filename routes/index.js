import express from 'express';
const Router = express.Router();
import itemRouter from './item.js';
import userRouter from './userRoutes.js';
import notificationRouter from './notificationRoutes.js';
import paymentRouter from './paymentRoutes.js';
import financeRouter from './financeTransactionRoutes.js';
import requestRouter from './request.js';
import approvalRouter from './approval.js';

Router.use('/purchases', requestRouter);
Router.use('/items', itemRouter);
Router.use('/users', userRouter);
Router.use('/notifications', notificationRouter);
Router.use('/payment', paymentRouter);
Router.use('/finance', financeRouter);
Router.use('/requests', requestRouter);
Router.use('/approvals', approvalRouter);

export default Router;