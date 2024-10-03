
import approvalModel from "../models/approval.js";
import NotFoundError from "../Errors/NotFoundError.js";
import BadRequestError from "../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../middleware/async.js";

const createApproval = asyncWrapper(async(req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg));
    }
    const newApproval = await approvalModel.create(req.body);
    return res.status(201).json(newApproval);
});

const readApproval = asyncWrapper(async(req, res, next) =>{
        try {
          const approvalId = req.params.id; 
          const approval = await approvalModel.findById(approvalId);
      
          // If no approval is found, return a 404 error
          if (!approval) {
            return res.status(404).json({ message: 'Approval not found' });
          }
      
          // Return the fetched approval data
          res.status(200).json({
            success: true,
            data: approval,
          });
        } catch (error) {
          next(error);
        }
      });

      const updateApproval = asyncWrapper(async(req, res, next) =>{
        const approvalId = req.params.id;
        const updates = req.body;
        const approval = await approvalModel.findByIdAndUpdate(approvalId, updates, { new: true });
        if (!approval) {
          return res.status(404).json({ message: 'Approval not found' });
        }
        res.status(200).json({ success: true, data: approval });
      });
      
      const deleteApproval = asyncWrapper(async(req, res, next) =>{
        const approvalId = req.params.id;
        const approval = await approvalModel.findByIdAndDelete(approvalId);
        if (!approval) {
          return res.status(404).json({ message: 'Approval not found' });
        }
        res.status(200).json({ success: true, message: 'Approval deleted successfully' });
      });

      const approvalControllers = {
        createApproval,
        readApproval,
        updateApproval,
        deleteApproval,
      }
      export default approvalControllers;