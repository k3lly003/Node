import leaveRequestControllers from "../Controllers/leaveRequestControl.js";
import express from "express";
const leaveRequestRouter = express.Router();
import { upload } from '../../middleware/multer.js';

leaveRequestRouter.post('/upload', upload.single('file_document'), leaveRequestControllers.createLeaveRequest);
leaveRequestRouter.get('/getAllLeaves', leaveRequestControllers.getAllLeaveRequests);
leaveRequestRouter.post('/sendByEmail', leaveRequestControllers.sendByEmail);
leaveRequestRouter.get('/getLeavesById/:id', leaveRequestControllers.getLeaveRequestsById);
leaveRequestRouter.put('/updateLeaves/:id', leaveRequestControllers.updateLeaveRequest);
leaveRequestRouter.delete('/deleteLeaves/:id', leaveRequestControllers.deleteLeaveRequest);

export default leaveRequestRouter;