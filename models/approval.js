import mongoose from "mongoose";
import { model, Schema} from 'mongoose';

const approvalSchema = new mongoose.Schema({
    request_id: {
        type: Schema.Types.ObjectId,
        ref: 'request',
        required: true
    },
    approved_by: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    approval_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['pending', 'approved', 'rejected'],
            message: '{VALUE} is not a valid status. Choose either "pending", "approved", or "rejected".'
          },
    },
});
const approvalModel = mongoose.model('approval', approvalSchema);
export default approvalModel;