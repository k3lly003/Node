import mongoose from "mongoose";
import {model,Schema} from 'mongoose';

const requestSchema = new mongoose.Schema({
    requestedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemDescription:{
        type: String,
        required: true
    },
    itemCategory:{
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice:{
        type: Number,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: ['Pending', 'In Progress', 'Completed' ,'denied']
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: {
        type: String,
        required: true
    }
});
const requestModel = mongoose.model('request', requestSchema);
export default requestModel;
