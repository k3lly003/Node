import mongoose from "mongoose";
import {model, Schema} from 'mongoose';

//// Enum values for leave and permission types
const leaveTypesEnum = ['maternity leave', 'sick leave', 'annual leave', 'paternity leave'];
const permissionTypesEnum = ['casual permission', 'emergency permission', 'half-day permission'];

const leaveRequestSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee', // Reference to the User model
        required: true
    },
    names: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['leave', 'permission'] // Enum to differentiate between 'leave' and 'permission'
    },
    type: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Validate the type based on the category
                if (this.category === 'leave') {
                    return leaveTypesEnum.includes(value); // Leave types validation
                } else if (this.category === 'permission') {
                    return permissionTypesEnum.includes(value); // Permission types validation
                }
                return false;
             },
            message: function(props) {
                return `${props.value} is not a valid type for ${this.category}.`;
            }
        }
    },
    startDate: { // Only for leave requests
        type: Date,
        required: function() {
            return this.category === 'leave'; // Required if category is 'leave'
        }
    },
    endDate: { // Only for leave requests
        type: Date,
        required: function() {
            return this.category === 'leave';
        }
    },
    date: { // Only for permission requests
        type: Date,
        required: function() {
            return this.category === 'permission'; // Required if category is 'permission'
        }
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],    
        default: `pending`   
    },
    file_document: {
        filename: String,
            path: String,
            mimetype: String,
            size: Number
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const leaveRequestModel = mongoose.model('leaveRequest', leaveRequestSchema);
export default leaveRequestModel;



