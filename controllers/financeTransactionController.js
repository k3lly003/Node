import readable from "readable-stream";
import FinanceTransaction from '../models/FinanceTransaction.js';
import Notification from '../models/notificationModel.js';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';
import notificationController from '../controllers/notificationController.js';

// View Transaction
const viewTransaction = async (req, res) => {
    try {
        const transaction = await FinanceTransaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Send Email
const sendEmail = async (email, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Initiate Payment
const initiatePayment = async (req, res) => {
    try {
        const { requestId, amount, comment } = req.body;

        // Create a new finance transaction
        const newTransaction = new FinanceTransaction({
            requestId,
            amount,
            comment,
            status: 'initiated',
        });

        // Save the new transaction
        await newTransaction.save();

        // Send email notification to the user who initiated the request
        const user = await User.findById(requestId);
        const subject = 'Payment Initiated';
        const text = `Your payment of ${amount} has been initiated for request ${requestId}.`;
        await sendEmail(user.email, subject, text);

        // Fetch users with relevant roles
        const financeManager = await User.findOne({ role: 'financeManager' });
        const operationsManager = await User.findOne({ role: 'operationsManager' });
        const projectDirector = await User.findOne({ role: 'projectDirector' });

        // Notify Finance Manager
        if (financeManager) {
            await notificationController.createNotification({
                body: {
                    message: `A payment of ${amount} has been initiated for request ${requestId}.`,
                    recipient: financeManager._id,
                    type: 'Payment Initiated',
                    status: 'unread',
                },
                res
            });
        }

        // Notify Operations Manager
        if (operationsManager) {
            await notificationController.createNotification({
                body: {
                    message: `A payment of ${amount} has been initiated for your request ${requestId}.`,
                    recipient: operationsManager._id,
                    type: 'Payment Initiated',
                    status: 'unread',
                },
                res
            });
        }

        // Notify Project Director
        if (projectDirector) {
            await notificationController.createNotification({
                body: {
                    message: `A payment of ${amount} has been initiated for request ${requestId}.`,
                    recipient: projectDirector._id,
                    type: 'Payment Initiated',
                    status: 'unread',
                },
                res
            });
        }

        // Send success response
        res.status(201).json({ msg: 'Payment initiated successfully', newTransaction });

    } catch (err) {
        console.error('Error initiating payment:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Upload Proof of Payment
const uploadProofOfPayment = async (req, res) => {
    try {
        const transaction = await FinanceTransaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        transaction.proofOfPayment = req.file.path;
        await transaction.save();

        // Send notifications about proof of payment
        const operationsManager = await User.findOne({ role: 'operationsManager' });
        const projectDirector = await User.findOne({ role: 'projectDirector' });

        if (operationsManager) {
            await notificationController.createNotification({
                body: {
                    message: `Proof of payment has been uploaded for request ${transaction.requestId}.`,
                    recipient: operationsManager._id,
                    type: 'Payment Update',
                    status: 'unread',
                },
                res
            });
        }

        if (projectDirector) {
            await notificationController.createNotification({
                body: {
                    message: `Proof of payment has been uploaded for request ${transaction.requestId}.`,
                    recipient: projectDirector._id,
                    type: 'Payment Update',
                    status: 'unread',
                },
                res
            });
        }

        res.status(200).json({ msg: 'Proof of payment uploaded successfully', transaction });

    } catch (err) {
        console.error('Error uploading proof of payment:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get All Payments
const getAllPayment = async (req, res) => {
    try {
        const transactions = await FinanceTransaction.find();
        res.status(200).json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

const financeControllers = {
    viewTransaction,
    initiatePayment,
    getAllPayment,
    uploadProofOfPayment,
};

export default financeControllers;
