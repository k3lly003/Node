import mongoose from "mongoose";
import { model, Schema} from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    serial_number: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true,
        enum: ['welfare', 'furniture', 'electronics']
    },
    date_of_entry: {
        type: Date,
        required: true
    },
    brand: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    },
    warranty_expiration_date: {
        type: Date,
        required: true
    },
    image:{ 
        filename: String, 
        path: String, 
        mimetype: String, 
        size: Number 
      },
      location: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true,
        enum: {
          values: ['lost', 'damaged', 'renewed', 'used'],
          message: '{VALUE} is not a valid status. Choose either "lost", "damaged", "rejected" or "used".'
        },
      },
      color: {
        type: String,
        required: true
      },
      disposal_date: {
        type: Date,
        required: false
      },
      additional_specifications: {
        type: String,
        required: false
      }
});
const itemModel = mongoose.model('item', itemSchema);
export default itemModel;