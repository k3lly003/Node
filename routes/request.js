import requestControllers from "../controllers/request.js";
import express from 'express';
const requestRouter = express.Router();

requestRouter.post('/createReq', requestControllers.createRequest);
requestRouter.post('/sendEmail', requestControllers.sendByEmail);
requestRouter.get('/getAllReq', requestControllers.getAllRequests);
requestRouter.get('/getByIdReq/:id', requestControllers.getById);
requestRouter.get('/getByNameReq/:item_name', requestControllers.findByName);
requestRouter.get('/getByCategoryReq/:item_category', requestControllers.findByCategory);
requestRouter.put('/updateReq/:id', requestControllers.updateRequest);
requestRouter.delete('/deleteReq/:id', requestControllers.deleteRequest);

export default requestRouter;
