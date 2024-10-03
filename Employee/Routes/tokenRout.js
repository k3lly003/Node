import tokenControllers from "../Controllers/tokenControl.js";
import express from "express";
const tokenRouter = express.Router();

tokenRouter.post('/addToken', tokenControllers.addToken);
tokenRouter.get('/findByUser/:user', tokenControllers.findByUser);
tokenRouter.delete('/delete/:id', tokenControllers.deleteToken);

export default tokenRouter;