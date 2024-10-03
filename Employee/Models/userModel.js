import mongoose from 'mongoose';
import {model, Schema} from 'mongoose';

const employeeSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    }
});
const employeeModel = mongoose.model('employee', employeeSchema);
export default employeeModel;