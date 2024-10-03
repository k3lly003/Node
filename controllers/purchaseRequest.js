// controllers/purchaseRequest.js

import requestModel from "../models/purchaseRequest.js";
import NotFoundError from "../Errors/NotFoundError.js";
import BadRequestError from "../Errors/BadRequestError.js";
import asyncWrapper from "../middleware/async.js";
import { validationResult } from "express-validator";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Create a new purchase request
const createRequest = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new BadRequestError('Validation failed', errors.array());
    }
    
    const newRequest = await requestModel.create({
        ...req.body,
        createdBy: req.user._id  // Assuming req.user is populated by auth middleware
    });

    // Notify the Project Director (CEO) about the new request
    const director = await userModel.findOne({ role: 'project Director' });
    
    if (director) {
        // Create a new notification for the project director
        await notificationModel.create({
            email: director.email,
            name: req.user.name, 
            message: `A new purchase request has been created by ${req.user.name}`,
            recipient: director._id,
            status: 'unread',
            type: 'Approval Request'
        });
        
        // Emit WebSocket event
        io.emit('notification', {
            type: 'Request Approval',
            message: `A new purchase request has been created by ${req.user.name}`,
            userId: director._id
        });
    }

    return res.status(201).json({ message: 'Request created successfully!' });
});

// Get all purchase requests
const getAllRequests = asyncWrapper(async (req, res, next) => {
    const requests = await requestModel.find({});
    if (requests.length > 0) {
        return res.status(200).json({
            nbHits: requests.length,
            requests
        });
    }
    res.status(404).json({ message: 'No request found!' });
});

// Get a single purchase request by ID
const getRequestById = asyncWrapper(async (req, res, next) => {
    const requestId = req.params.id;
    const request = await requestModel.findById(requestId);
    if (!request) {
        return next(new NotFoundError('No request with this ID.'));
    }
    res.status(200).json(request);
});

// Update a single purchase request by ID
const updateRequest = asyncWrapper(async (req, res, next) => {
    const requestId = req.params.id;
    const updates = req.body;
    const request = await requestModel.findByIdAndUpdate(requestId, updates, { new: true });
    if (!request) {
        return next(new NotFoundError('No request with this ID.'));
    }
    res.status(200).json(request);
});

// Update request status
const updateRequestStatus = asyncWrapper(async (req, res) => {
    const { status } = req.body;
    const requestId = req.params.id;

    try {
        // Find the request by ID
        const request = await requestModel.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Update the request status
        request.status = status;
        await request.save();

        // Notify Operations Manager if the status is approved or rejected
        if (status === 'approved' || status === 'rejected') {
            const operationsManager = await userModel.findById(request.createdBy);
            if (operationsManager) {
                await notificationModel.create({
                    email: operationsManager.email,
                    name: req.user.name,  // Assuming req.user contains the Project Director's info
                    message: `Your purchase request has been ${status}`,
                    recipient: operationsManager._id,
                    status: 'unread',
                    type: 'Approval Status'
                });

                // Emit WebSocket event
                io.emit('notification', {
                    type: 'Request Status',
                    message: `Your purchase request has been ${status}`,
                    userId: operationsManager._id
                });
            }
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Error updating request status', error });
    }
});

// Delete a single purchase request by ID
const deleteRequest = asyncWrapper(async (req, res, next) => {
    const requestId = req.params.id;
    const request = await requestModel.findByIdAndDelete(requestId);
    if (!request) {
        return next(new NotFoundError('No request with this ID.'));
    }

    // Notify the Operations Manager that their request has been deleted
    const operationsManager = await userModel.findById(request.createdBy);
    if (operationsManager) {
        await notificationModel.create({
            email: operationsManager.email,
            name: req.user.name, 
            message: `Your purchase request has been deleted by ${req.user.name}`, 
            recipient: operationsManager._id,
            status: 'unread',
            type: 'Request Deleted'
        });

        // Emit WebSocket event
        io.emit('notification', {
            type: 'Request Deleted',
            message: `Your purchase request has been deleted by ${req.user.name}`,
            userId: operationsManager._id
        });
    }

    res.status(200).json({ message: 'Request deleted successfully!' });
});

const requestControllers = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    updateRequestStatus
};

export default requestControllers;
