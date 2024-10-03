import employeeModel from "../Models/userModel.js";
import NotFoundError from "../../Errors/NotFoundError.js";
import BadRequestError from "../../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../../middleware/async.js";

const createEmployee = asyncWrapper(async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new BadRequestError(errors.array()[0].msg))
    };
    const newEmployee = await employeeModel.create(req.body);
    return res.status(201).json(newEmployee);
});

const readEmployee = asyncWrapper(async(req, res, next) =>{
    const employeeId = req.params.id;
    const employee = await employeeModel.findById(employeeId);
    if(!employee){
        return next(new NotFoundError({message: 'No employee with this id.'}));
    }
    res.status(200).json(employee);
});

const getByName = asyncWrapper(async (req, res, next) =>{
    const names = req.params.names;
    const employees = await employeeModel.find({names});
    if(!employees.length){
        return next(new NotFoundError({message: 'No employee found with this name.'}));
    }
    res.status(200).json(employees);
});

const getAllEmployees = asyncWrapper(async(req, res, next) =>{
    const employees = await employeeModel.find({});
    if(!employees.length){
        return next(new NotFoundError({message: 'No employees found.'}));
    }
    res.status(200).json(employees);
})

const updateEmployee = asyncWrapper(async (req, res, next) =>{
    const employeeId = req.params.id;
    const updates = req.body;
    const employee = await employeeModel.findByIdAndUpdate(employeeId, updates, { new: true });
    if(!employee){
        return next(new NotFoundError({message: 'No employee to update'}));
    }
    res.status(200).json(employee);
});

const deleteEmployee = asyncWrapper(async (req, res, next) =>{
    const employeeId = req.params.id;
    const deletedEmployee = await employeeModel.findByIdAndDelete(employeeId);
    if(!deletedEmployee){
        return next(new NotFoundError({message: 'No employee not deleted!'}))
    }
    res.status(200).json({message: 'Successfully deleted employee.'})
});

const employeeController = {
    createEmployee,
    readEmployee,
    getByName,
    getAllEmployees,
    updateEmployee,
    deleteEmployee
};
export default employeeController;