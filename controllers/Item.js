import itemModel from "../models/itemModel.js";
import NotFoundError from '../Errors/NotFoundError.js';
import BadRequestError from '../Errors/BadRequestError.js';
import { validationResult } from "express-validator";
import asyncWrapper from '../middleware/async.js';

const createItem = asyncWrapper(async(req, res, next) =>{
    try{
        const file = req.file;
        if(!file){
            return res.status(400).send('No file uploaded!')
        }
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next(new BadRequestError(errors.array()[0].msg));
        }
        const { name, serial_number, category, date_of_entry, brand, weight, warranty_expiration_date, location, status, color, disposal_date, additional_specifications } = req.body;
        const newImage = new itemModel({
            name,
            serial_number,
            category,
            date_of_entry,
            brand,
            weight,
            warranty_expiration_date,
            image: {
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
              },
            location,
            status,
            color,
            disposal_date,
            additional_specifications,

        });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error){
        res.status(500).json({message: 'failed to add image'});
    }
});

const getAllItems =asyncWrapper(async(req, res, next) =>{
    const items = await itemModel.find({})
    if(items){
        return res.status(201).json({
            nbHits: items.length,
            items
        });
    }
    res.status(400).json({message: 'items not found!'});
});

const getItemById = asyncWrapper(async(req, res, next) =>{
    const itemId = req.params.id;
    const foundItem = await itemModel.findById(itemId);
    if(!foundItem){
        return next(new NotFoundError('Item not found'));
    }
    return res.status(200).json({foundItem: foundItem});
});

const updateItem = asyncWrapper(async(req, res, next) =>{
    const itemId = req.params.id;
    const updates = req.body;
    const updatedItem = await itemModel.findByIdAndUpdate(itemId, updates, {new: true})
    if(!updatedItem){
        return next(new NotFoundError('Item not found'));
    }
    return res.status(200).json({updatedItem})
});

const deleteItem = asyncWrapper(async(req, res, next) =>{
    const itemId = req.params.id;
    const deletedItem = await itemModel.findByIdAndDelete(itemId)
    if(!deletedItem){
        return next(new NotFoundError('item not found'));
    }
    res.status(200).json({message: 'Item deleted successfully!'})
});

const findByCategory = asyncWrapper(async(req, res, next) =>{
    const  category  = req.params.category;
    const items = await itemModel.find({category: {$regex: `.*${category}.*`, $options: 'i'}})
    if(items){
        return res.status(201).json({
            nbHits: items.length,
            items
        });
    }
    res.status(400).json({message: 'items not found!'});
});
const findByStatus = asyncWrapper(async(req, res, next) =>{
    const status  = req.params.status;
    const items = await itemModel.find({status: {$regex: `.*${status}.*`, $options: 'i'}})
    if(items){
        return res.status(201).json({
            nbHits: items.length,
            items
        });
    }
    res.status(400).json({message: 'items not found!'});
});
const findByName = asyncWrapper(async(req, res, next) =>{
    const name = req.params.name;
    const items = await itemModel.find({name});
    if(items){
        return res.status(201).json({
            nbHits: items.length,
            items
        });
    }
    res.status(400).json({message: 'items not found!'})
});
const itemControllers = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    findByCategory,
    findByStatus,
    findByName,
 };

export default itemControllers;
