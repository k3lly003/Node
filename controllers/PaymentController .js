import paymentModel from '../models/PaymentModel.js';
import notificationModel from '../models/notificationModel.js'; // Updated import
import userModel from '../models/userModel.js'; 
import asyncWrapper from '../middleware/async.js';

const recordPayment = asyncWrapper(async (req, res) => {
    const { finance_id, request_id, amount, payment_method } = req.body;
    const file = req.file;

    // Validate required fields
    if (!finance_id || !request_id || !amount || !payment_method) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!file) {
        return res.status(400).json({ message: "File is required" });
    }

    try {
        // Create a new payment instance
        const payment = new paymentModel({
            finance_id,
            request_id,
            amount,
            payment_method,
            proof_of_payment: {
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            }
        });

        const savedPayment = await payment.save();
        // Notify the Operations Manager and Project Director about the payment
        // Notify Operations Manager and Project Director
        // const operationsManager = await userModel.findById(finance_id); 


        // Notify Operations Manager, Project Director, and Finance Manager
        const operationsManager = await userModel.findOne({ role: 'Operations Manager' });
        const projectDirector = await userModel.findOne({ role: 'project Director' });
        const financeManager = await userModel.findOne({ role: 'Finance Manager' });
        

        // Log to verify notifications are created
        console.log(`Operations Manager: ${operationsManager}`);
        console.log(`Project Director: ${projectDirector}`);
        console.log(`Finance Manager: ${financeManager}`);

        if (operationsManager) {
            const notification = await notificationModel.create({
                message: `A payment of ${amount} has been recorded for request ${request_id}`,
                userId: operationsManager._id,
                role: 'operationsManager',
                status: 'unread',
                // type: 'initiated'
            });

            console.log('Notification created for Operations Manager:', notification);
        }

        if (projectDirector) {
            const notification = await notificationModel.create({
                message: `A payment of ${amount} has been recorded for request ${request_id}`,
                userId: projectDirector._id,
                role: 'projectDirector',
                status: 'unread',
                // type: 'initiated'
            });

            console.log('Notification created for Project Director:', notification);
        }

        if (financeManager) {
            const notification = await notificationModel.create({
                message: `A payment of ${amount} has been recorded for request ${request_id}`,
                userId: financeManager._id,
                role: 'financeManager',
                status: 'unread'
             
            });

            console.log('Notification created for Finance Manager:', notification);
        }

        return res.status(201).json({
            message: "Payment recorded successfully",
            payment: savedPayment
        });
    } catch (error) {
        console.error("Error recording payment:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});

export default {
    recordPayment,
};
