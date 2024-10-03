import mongoose from 'mongoose';
import { model, Schema} from 'mongoose';

const requestSchema = new mongoose.Schema({
    item_name:{
       type: String,
       required: true
    },
    item_description:{
        type: String,
        required: true
    },
    item_category: {
        type: String,
        required: true,
        enum: ['welfare', 'furniture','electronic']
    },
    quantity: {
        type: Number,
        required: true
    },
    unit_price: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['in progress', 'approved', 'denied'],
            message: '{VALUE} is not a valid status. Choose either "in progress", "approved", or "denied".'
    }
},
    requestedBy:{
        type:String,
        required: true
    },
    date_requested: {
        type: Date,
        default: Date.now
    }
});
const requestModel = mongoose.model('request', requestSchema);
export default requestModel;