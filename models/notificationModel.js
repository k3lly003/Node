// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // The user receiving the notification
  role: { type: String, required: true },  // Role of the user receiving the notification
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  type: { type: String, enum: ['accountCreated', 'paymentInitiated', 'approvalRequest', 'inventoryUpdate'] },  // Type of notification
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
