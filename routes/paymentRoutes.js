import express from 'express';
const paymentRouter = express.Router();
import {upload} from '../middleware/multer.js'; 
import paymentController from '../controllers/PaymentController .js';

// Record a new payment
paymentRouter.post('/create', upload.single('proof_of_payment'), paymentController.recordPayment);

// View a specific payment
// paymentRouter.get('/findPaymentId/:id', paymentController.viewPayment);  

export default paymentRouter;
