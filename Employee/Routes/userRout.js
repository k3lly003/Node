import employeeController from "../Controllers/userControl.js";
import express from "express";
const employeeRouter = express.Router();

employeeRouter.post('/addEmployee', employeeController.createEmployee);
employeeRouter.get('/getEmployee/:id', employeeController.readEmployee);
employeeRouter.get('/getByName/:names', employeeController.getByName)
employeeRouter.get('/getAllEmployees', employeeController.getAllEmployees);
employeeRouter.put('/updateEmployee/:id', employeeController.updateEmployee);
employeeRouter.delete('/deleteEmployee/:id', employeeController.deleteEmployee);

export default employeeRouter;