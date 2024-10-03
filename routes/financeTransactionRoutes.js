// routes/financeTransactionRoutes.js
import express from 'express';
const financeRouter = express.Router();
import financeControllers from '../controllers/financeTransactionController.js';


// Route to view a transaction
financeRouter.get('/:id', financeControllers.viewTransaction);

// Route to initiate a payment
financeRouter.post('/initiate', financeControllers.initiatePayment);

export default financeRouter;
