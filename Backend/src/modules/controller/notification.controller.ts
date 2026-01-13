import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '../services/notification.service';
import { 
  CreateNotificationDto, 
  NotificationQueryDto,
  MarkNotificationReadDto
} from '../dto/notification.dto';

const prisma = new PrismaClient();

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService(prisma);
  }

  createNotification = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateNotificationDto.parse(req.body);
      const { employeeId } = req.user as any;

      const notification = await this.notificationService.createNotification(
        validatedData,
        employeeId
      );

      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create notification'
      });
    }
  };

  getNotifications = async (req: Request, res: Response) => {
    try {
      const validatedQuery = NotificationQueryDto.parse(req.query);
      const { employeeId } = req.user as any;

      const result = await this.notificationService.getNotifications(
        validatedQuery,
        employeeId
      );

      res.json({
        success: true,
        data: result.notifications,
        pagination: result.pagination
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch notifications'
      });
    }
  };

  markAsRead = async (req: Request, res: Response) => {
    try {
      const validatedData = MarkNotificationReadDto.parse(req.body);
      const { employeeId } = req.user as any;

      await this.notificationService.markAsRead(validatedData, employeeId);

      res.json({
        success: true,
        message: 'Notifications marked as read'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark notifications as read'
      });
    }
  };

  getUnreadCount = async (req: Request, res: Response) => {
    try {
      const { employeeId } = req.user as any;

      const count = await this.notificationService.getUnreadCount(employeeId);

      res.json({
        success: true,
        data: { unreadCount: count }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch unread count'
      });
    }
  };

  // System notification triggers (for admin/cron jobs)
  sendDeadlineReminders = async (req: Request, res: Response) => {
    try {
      const { role } = req.user as any;

      // Only allow ADMIN and SUPER_ADMIN to trigger system notifications
      if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const count = await this.notificationService.sendDeadlineReminders();

      res.json({
        success: true,
        message: `Deadline reminders sent for ${count} tasks`
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to send deadline reminders'
      });
    }
  };

  checkBlockedTasks = async (req: Request, res: Response) => {
    try {
      const { role } = req.user as any;

      // Only allow ADMIN and SUPER_ADMIN to trigger system checks
      if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const count = await this.notificationService.checkBlockedTasks();

      res.json({
        success: true,
        message: `Checked ${count} blocked tasks`
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to check blocked tasks'
      });
    }
  };
}