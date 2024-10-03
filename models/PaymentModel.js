import mongoose from "mongoose"; 
import { model, Schema} from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    finance_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'finance',
        required: true
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_date: {
        type: Date,
        default: Date.now
    },
    proof_of_payment: {
        filename: {
            type: String,
            required: true
            
        },
        status: {
            type: String,
            enum: ['initiated', 'completed', 'pending', 'failed'],
            default: 'pending',
        },
        path: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    },
    payment_method: {
        type: String,
        enum: ['cash', 'bank'],
        required: true
    }
});

const paymentModel = mongoose.model('payment', PaymentSchema);
export default paymentModel;
