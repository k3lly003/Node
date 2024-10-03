import express from 'express';
import notificationControllers from '../controllers/notificationController.js'; 


const router = express.Router();

// Define routes
router.post('/create', notificationControllers.createNotification);
router.get('/user', notificationControllers.getNotificationsByUser);
router.put('/read/:id', notificationControllers.markNotificationAsRead);
router.get('/allNotifications', notificationControllers.getAllNotifications);
router.delete('/deleteNotification/:id', notificationControllers.deleteNotification);


export default router;
