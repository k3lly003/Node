import requestModel from "../models/request.js";
import NotFoundError from "../Errors/NotFoundError.js";
import BadRequestError from "../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../middleware/async.js";
import sendEmail from "../utils/sendEmail.js";
import nodemailer from 'nodemailer';

const createRequest = asyncWrapper(async(req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg));
    }
    const newRequest = await requestModel.create(req.body);
    return res.status(201).json(newRequest);
});

const getAllRequests = asyncWrapper(async(req, res, next)=>{
    const requests = await requestModel.find({})
    if(requests){
        return res.status(201).json({
            nbHits: requests.length,
            requests
        })
    }
});

const getById = asyncWrapper(async(req,res, next)=>{
    const requestId = req.params.id;
    const foundRequest =await requestModel.findById(requestId);
    if(!foundRequest){
        return next(new NotFoundError('Review not found'));
    }
    res.status(201).json(foundRequest);
});

const updateRequest = asyncWrapper(async (req, res, next) =>{
    const requestId = req.params.id;
    const updates = req.body;
    const updatedRequest = await requestModel.findByIdAndUpdate(requestId, updates, {new: true});
    if(!updatedRequest){
        return next(new NotFoundError('No request found!'));
    }
    res.status(201).json(updatedRequest);
});

const deleteRequest = asyncWrapper(async(req, res, next)=>{
    const requestId = req.params.id;
    const deletedRequest = await requestModel.findByIdAndDelete(requestId)
    if(!deletedRequest){
        return next(new NotFoundError('item not found'));
    }
    res.status(201).json({message: 'Request deleted successfully'})
});

const sendByEmail = asyncWrapper(async(req, res, next)=>{
        try {
            const { email, subject, item_name, item_description, item_category, quantity, unit_price, total_price, status, requestedBy } = req.body;
            
            // Construct the email text with the request details
            const emailBody = `
                Hello,
    
                A request for the following product has been made:
    
                - Item Name: ${item_name}
                - Item Description: ${item_description}
                - Category: ${item_category}
                - Quantity: ${quantity}
                - Unit Price: $${unit_price}
                - Total Price: $${total_price}
                - Status: ${status}
                - Requested By: ${requestedBy}
    
                Please review this request and take appropriate action.
                
                Regards,
                Your Inventory System
            `;
    
            // Create a transporter using your email service
            let transporter = nodemailer.createTransport({
                service: 'Gmail', // You can use other email services like Outlook, Yahoo, etc.
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS, // Your email password or app-specific password if 2FA is enabled
                },
            });
    
            // Define the email options
            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: email, 
                subject: subject, 
                text: emailBody 
            };
    
            // Send the email
            let info = await transporter.sendMail(mailOptions);
    
            // Success response
            res.status(200).json({ message: 'Email sent successfully', info });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Failed to send email', error });
        }
    });
    
 const findByName = asyncWrapper(async(req, res, next) =>{
    const name = req.params.name;
    const requests = await requestModel.find({name});
    if(requests){
        return res.status(201).json({
            nbHits: requests.length,
            requests
        })
    }
    res.status(400).json({message: 'request not found!'})
 });

 const findByCategory = asyncWrapper(async(req, res, next) =>{
    const category = req.params.category;
    const requests = await requestModel.find({category});
    if(requests){
       return res.status(201).json({
        nbHits: requests.length,
        requests
       })
    }
    res.status(400).json({message: 'requests not found!'})
 });

const requestControllers = {
    createRequest,
    getAllRequests,
    getById,
    updateRequest,
    deleteRequest,
    sendByEmail,
    findByName,
    findByCategory,
 };
export default requestControllers;
