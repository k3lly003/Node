import requestControllers from "../controllers/purchaseRequest.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";


const requestRouter = express.Router();

// Routes
requestRouter.post('/create', authMiddleware, requestControllers.createRequest);
requestRouter.get('/getAll', requestControllers.getAllRequests);
requestRouter.get('/getById/:id', requestControllers.getRequestById);
requestRouter.put('/update/:id', requestControllers.updateRequest);
requestRouter.delete('/delete/:id', requestControllers.deleteRequest);
requestRouter.patch('/updateStatus/:id', authMiddleware, requestControllers.updateRequestStatus); 


export default requestRouter;
