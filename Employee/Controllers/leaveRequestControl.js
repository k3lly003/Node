import dotenv from 'dotenv';
dotenv.config();
import leaveRequestModel from "../Models/LeaveRequest.js";
import NotFoundError from "../../Errors/NotFoundError.js";
import BadRequestError from "../../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../../middleware/async.js";
import sendEmail from "../../utils/sendEmail.js";
import nodemailer from 'nodemailer';

const createLeaveRequest = asyncWrapper(async (req, res, next) => {
    try{
        const file = req.file;
        if(!file){
            return res.status(400).send('No file uploaded!')
        }
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next(new BadRequestError(errors.array()[0].msg));
        }
        const { employeeId, names, category,  type, startDate, endDate, date, reason, status, email, createdAt} = req.body;
        const newImage = new leaveRequestModel({
            employeeId,
            names,
            category,
            type,
            startDate,
            endDate,
            date,
            reason,
            status,
            file_document: {
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
              },
            email,
            createdAt
        });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error){
        res.status(500).json({message: 'failed to add image'});
    }
});
const sendByEmail = asyncWrapper(async (req, res, next) => {
        try {
            // Get the leave request ID from the request body (as it's a POST API)
            // const requestId = req.body.requestId;
            // const request = await leaveRequestModel.findById(requestId);
    
            // if (!request) {
            //     return res.status(404).json({ message: 'No request found' });
            // }
    
            // Destructure fields from the request
            const { email, employeeId, names, category, type, startDate, endDate, date, reason, file_document} = req.body;
    
            const ceoEmail = process.env.EMAIL_USER;  // CEO's email from environment variables
            const ceoName = process.env.EMAIL_NAME;  // CEO's name from environment variables
    
            // Construct a simple email body for the leave request
            const emailBody = `
                Dear ${names},
                
                We have received your leave request from ${startDate} to ${endDate}.
                
                The request details are as follows:
                - Type: ${type}
                - Reason: ${reason}
                - Start Date: ${startDate}
                - End Date: ${endDate}
                
                We will process your request and notify you of our decision shortly.
                
                Best regards,
                ${ceoName}
                CEO, Leave Management System`;
    
            // Create a transporter using your email service (e.g., Gmail)
            let transporter = nodemailer.createTransport({
                service: 'Gmail',  // You can use other email services if needed
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,  // CEO's email password from environment variables
                },
            });
    
            // Define the email options
            let mailOptions = {
                from: `${ceoName} <${ceoEmail}>`,  // CEO's name and email
                to: email,  // Send to employee's email
                subject: `Leave Request Received`,  // Subject of the email
                text: emailBody  // Email content
            };
    
            // Send the email
            let info = await transporter.sendMail(mailOptions);
    
            // Success response
            res.status(200).json({ message: 'Leave request email sent successfully', info });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Failed to send email', error });
        }
    });
    
const getAllLeaveRequests = asyncWrapper(async (req, res, next) =>{
    const leaveRequests = await leaveRequestModel.find({})
    if(leaveRequests){
        return res.status(201).json({
            nbHits: leaveRequests.length,
            leaveRequests
        });
    }
    res.status(404).json({message: 'No requests found here.'});
});

const getLeaveRequestsById = asyncWrapper(async (req, res, next) =>{
    const requestId = req.params.id;
    const foundRequest = await leaveRequestModel.findById(requestId);
    if(!foundRequest){
        return next(new NotFoundError('Leave request not found'));
    }
    return res.status(201).json({foundRequest});
});

const updateLeaveRequest = asyncWrapper(async (req, res, next) =>{
    const requestId = req.params.id;
    const updates = req.body;
    const updatedRequest = await leaveRequestModel.findByIdAndUpdate(requestId, updates, {new: true});
    if(!updatedRequest){
        return next(new NotFoundError('No request found!'));
    }
    return res.status(201).json({updatedRequest});
});

const deleteLeaveRequest = asyncWrapper(async (req, res, next) =>{
    const requestId = req.params.id;
    const deletedRequest = await leaveRequestModel.findByIdAndDelete(requestId);
    if(!deletedRequest){
        return next(new NotFoundError('No request found!'));
    }
    return res.status(204).json({message: 'Request deleted successfully'});
});

const leaveRequestControllers = {
    createLeaveRequest,
    getAllLeaveRequests,
    getLeaveRequestsById,
    updateLeaveRequest,
    sendByEmail,
    deleteLeaveRequest
};
export default leaveRequestControllers;