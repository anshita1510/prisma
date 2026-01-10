import { Router } from 'express';
import { NotificationController } from '../controller/notification.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

// All routes require authentication
router.use(authenticateToken);

// Notification CRUD routes
router.post('/', notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.put('/mark-read', notificationController.markAsRead);
router.get('/unread-count', notificationController.getUnreadCount);

// System notification triggers (admin only)
router.post('/system/deadline-reminders', notificationController.sendDeadlineReminders);
router.post('/system/check-blocked-tasks', notificationController.checkBlockedTasks);

export default router;