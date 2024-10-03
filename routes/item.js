import itemControllers from "../controllers/Item.js";
import express from "express";
const itemRouter = express.Router();
import { upload } from '../middleware/multer.js';

itemRouter.post('/upload', upload.single('image'), itemControllers.createItem);
itemRouter.get('/getAll', itemControllers.getAllItems);
itemRouter.get('/getById/:id', itemControllers.getItemById);
itemRouter.get('/getByCategory/:category', itemControllers.findByCategory);
itemRouter.get('/getByStatus/:status', itemControllers.findByStatus);
itemRouter.get('/getByName/:name', itemControllers.findByName);
itemRouter.put('/updateItem/:id', itemControllers.updateItem);
itemRouter.delete('/deleteItem/:id', itemControllers.deleteItem);

export default itemRouter;