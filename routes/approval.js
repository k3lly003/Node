import approvalControllers from "../controllers/approval.js";
import express from "express";
const approvalRouter = express.Router();

approvalRouter.post('/createApp', approvalControllers.createApproval);
approvalRouter.get('/readApp/:id', approvalControllers.readApproval);
approvalRouter.put('/updateApp/:id', approvalControllers.updateApproval);
approvalRouter.delete('/deleteApp/:id', approvalControllers.deleteApproval);

export default approvalRouter;