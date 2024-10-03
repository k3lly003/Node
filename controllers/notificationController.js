import notificationModel from '../models/notificationModel.js';
import UserModel from '../models/userModel.js';
import mongoose from 'mongoose';

// Helper function to create notification
const createNotificationHelper = async ({ email, message, recipient, status = 'unread', type }) => {
  // Validate recipient ID
  if (!mongoose.Types.ObjectId.isValid(recipient)) {
    throw new Error('Invalid recipient ID');
  }

  const user = await UserModel.findById(recipient);

  if (!user) {
    throw new Error(`Recipient with ID ${recipient} not found`);
  }

  // Create the notification
  const newNotification = new notificationModel({
    email,
    message,
    recipient,
    status,
    type,
  });

  await newNotification.save();
  return newNotification;
};

const createNotification = async (req, res) => {
  try {
    const { message, userId, role, status, type } = req.body;

    // Validate required fields
    if (!message || !userId || !role || !status || !type) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: `User with ID ${userId} not found` });
    }

    // Create the notification
    const newNotification = new notificationModel({
      message,
      userId,
      role,
      status,
      type,
    });

    await newNotification.save();

    res.status(201).json({ msg: 'Notification created successfully', newNotification });
  } catch (err) {
    console.error('Error creating notification:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Fetch Notifications for a Specific User
const getNotificationsByUser = async (req, res) => {
  try {
    const userId = req.user;
    const notifications = await notificationModel.find({ recipient: userId }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};

// Mark Notification as Read
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await notificationModel.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.status = 'read';
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking notification as read', error: err.message });
  }
};

// Trigger Notification for Admin Signup
const triggerAdminSignupNotification = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid recipient ID');
    }

    const recipientId = mongoose.Types.ObjectId(userId);
    const message = 'Your account has been created successfully!';

    await createNotificationHelper({
      message,
      recipient: recipientId,
      type: 'Account Creation',
    });

    console.log('Admin signup notification sent.');
  } catch (error) {
    console.error('Error sending notification:', error.message || error);
  }
};

// Trigger Notification for Payment
const triggerPaymentNotification = async (userId, amount) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid recipient ID');
    }

    const recipientId = mongoose.Types.ObjectId(userId);
    const message = `Your payment of ${amount} has been initiated.`;

    await createNotificationHelper({
      message,
      recipient: recipientId,
      type: 'Payment Initiated',
    });

    console.log('Payment notification sent.');
  } catch (error) {
    console.error('Error sending payment notification:', error.message || error);
  }
};

// Delete Notification
const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const deletedNotification = await notificationModel.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification', error: err.message });
  }
};

// Fetch all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find({}).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all notifications', error: err.message });
  }
};

// Function to check notifications for a specific user
const checkNotifications = async (userId) => {
    try {
        const notifications = await notificationModel.find({ recipient: userId });
        console.log(`Notifications for User ID ${userId}:`, notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};

// Exporting notification controller methods
const notificationControllers = {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  triggerAdminSignupNotification,
  triggerPaymentNotification,
  getAllNotifications,
  deleteNotification,
};

export default notificationControllers;
