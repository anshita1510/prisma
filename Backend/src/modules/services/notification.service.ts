import { PrismaClient } from '@prisma/client';
import { PermissionService } from './permission.service';
import { 
  CreateNotificationDtoType, 
  NotificationQueryDtoType,
  MarkNotificationReadDtoType
} from '../dto/notification.dto';

export class NotificationService {
  private permissionService: PermissionService;

  constructor(private prisma: PrismaClient) {
    this.permissionService = new PermissionService(prisma);
  }

  async createNotification(data: CreateNotificationDtoType, creatorId: number) {
    return this.prisma.$transaction(async (tx) => {
      // Create notification
      const notification = await tx.notification.create({
        data: {
          title: data.title,
          message: data.message,
          type: data.type,
          referenceId: data.referenceId,
          referenceType: data.referenceType,
          metadata: data.metadata as any,
          createdById: creatorId
        }
      });

      // Create notification recipients
      await tx.notificationRecipient.createMany({
        data: data.recipientIds.map(recipientId => ({
          notificationId: notification.id,
          recipientId
        }))
      });

      return notification;
    });
  }

  async getNotifications(query: NotificationQueryDtoType, recipientId: number) {
    const { page, limit, type, isRead } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      recipientId,
      ...(type && { notification: { type } }),
      ...(isRead !== undefined && { isRead })
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notificationRecipient.findMany({
        where,
        skip,
        take: limit,
        include: {
          notification: {
            include: {
              createdBy: {
                select: { id: true, name: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.notificationRecipient.count({ where })
    ]);

    return {
      notifications: notifications.map(nr => ({
        ...nr.notification,
        recipientId: nr.recipientId,
        isRead: nr.isRead,
        readAt: nr.readAt,
        notificationCreatedAt: nr.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async markAsRead(data: MarkNotificationReadDtoType, recipientId: number) {
    return this.prisma.notificationRecipient.updateMany({
      where: {
        notificationId: { in: data.notificationIds },
        recipientId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  }

  async getUnreadCount(recipientId: number): Promise<number> {
    return this.prisma.notificationRecipient.count({
      where: {
        recipientId,
        isRead: false
      }
    });
  }

  // Automated notification triggers
  async notifyTaskAssigned(taskId: number, assigneeId: number, assignerId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } }
      }
    });

    if (!task || !task.assignedTo) return;

    await this.createNotification({
      title: 'New Task Assigned',
      message: `You have been assigned a new task: "${task.title}" in project "${task.project.name}"`,
      type: 'TASK_ASSIGNED',
      referenceId: taskId,
      referenceType: 'task',
      metadata: {
        taskId,
        projectId: task.projectId,
        assignerId
      },
      recipientIds: [assigneeId]
    }, assignerId);
  }

  async notifyTaskStatusChanged(taskId: number, oldStatus: string, newStatus: string, updaterId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { select: { id: true, name: true } }
      }
    });

    if (!task) return;

    // Get notification recipients (project members, task assignee, task creator)
    const recipients = await this.permissionService.getNotificationRecipients(
      task.projectId,
      taskId,
      ['OWNER', 'MANAGER', 'MEMBER']
    );

    // Remove the updater from recipients
    const filteredRecipients = recipients.filter(id => id !== updaterId);

    if (filteredRecipients.length === 0) return;

    await this.createNotification({
      title: 'Task Status Updated',
      message: `Task "${task.title}" status changed from ${oldStatus} to ${newStatus}`,
      type: 'TASK_UPDATED',
      referenceId: taskId,
      referenceType: 'task',
      metadata: {
        taskId,
        projectId: task.projectId,
        oldStatus,
        newStatus,
        updaterId
      },
      recipientIds: filteredRecipients
    }, updaterId);
  }

  async notifyProjectCreated(projectId: number, creatorId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: { select: { id: true } },
        projectRoles: {
          where: { isActive: true },
          select: { employeeId: true }
        }
      }
    });

    if (!project) return;

    // Get all project members
    const memberIds = project.members.map(m => m.id);
    const roleEmployeeIds = project.projectRoles.map(pr => pr.employeeId);
    const allRecipients = [...new Set([...memberIds, ...roleEmployeeIds])];
    
    // Remove creator from recipients
    const recipients = allRecipients.filter(id => id !== creatorId);

    if (recipients.length === 0) return;

    await this.createNotification({
      title: 'New Project Created',
      message: `You have been added to project: "${project.name}"`,
      type: 'PROJECT_CREATED',
      referenceId: projectId,
      referenceType: 'project',
      metadata: {
        projectId,
        creatorId
      },
      recipientIds: recipients
    }, creatorId);
  }

  async notifyDeadlineApproaching(taskId: number, daysUntilDeadline: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true } },
        createdBy: { select: { id: true } }
      }
    });

    if (!task) return;

    const recipients = [];
    if (task.assignedTo) recipients.push(task.assignedTo.id);
    if (task.createdBy && task.createdBy.id !== task.assignedTo?.id) {
      recipients.push(task.createdBy.id);
    }

    if (recipients.length === 0) return;

    const urgencyLevel = daysUntilDeadline <= 1 ? 'urgent' : 'upcoming';
    const timeText = daysUntilDeadline === 0 ? 'today' : 
                    daysUntilDeadline === 1 ? 'tomorrow' : 
                    `in ${daysUntilDeadline} days`;

    await this.createNotification({
      title: `Task Deadline ${urgencyLevel === 'urgent' ? 'Today' : 'Approaching'}`,
      message: `Task "${task.title}" is due ${timeText}`,
      type: 'DEADLINE_REMINDER',
      referenceId: taskId,
      referenceType: 'task',
      metadata: {
        taskId,
        projectId: task.projectId,
        daysUntilDeadline,
        urgencyLevel
      },
      recipientIds: recipients
    }, task.createdBy.id);
  }

  async notifyDependencyBlocked(taskId: number, blockedByTaskId: number) {
    const [task, blockedByTask] = await Promise.all([
      this.prisma.task.findUnique({
        where: { id: taskId },
        include: {
          assignedTo: { select: { id: true } },
          createdBy: { select: { id: true } }
        }
      }),
      this.prisma.task.findUnique({
        where: { id: blockedByTaskId },
        select: { title: true }
      })
    ]);

    if (!task || !blockedByTask) return;

    const recipients = [];
    if (task.assignedTo) recipients.push(task.assignedTo.id);
    if (task.createdBy && task.createdBy.id !== task.assignedTo?.id) {
      recipients.push(task.createdBy.id);
    }

    if (recipients.length === 0) return;

    await this.createNotification({
      title: 'Task Dependency Blocked',
      message: `Task "${task.title}" is blocked by "${blockedByTask.title}"`,
      type: 'DEPENDENCY_BLOCKED',
      referenceId: taskId,
      referenceType: 'task',
      metadata: {
        taskId,
        blockedByTaskId,
        projectId: task.projectId
      },
      recipientIds: recipients
    }, task.createdBy.id);
  }

  // Batch operations for system notifications
  async sendDeadlineReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tasks due today or tomorrow
    const upcomingTasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          gte: today,
          lte: tomorrow
        },
        status: {
          not: 'COMPLETED'
        },
        isActive: true
      },
      select: { id: true, dueDate: true }
    });

    for (const task of upcomingTasks) {
      if (!task.dueDate) continue;
      
      const daysUntilDeadline = Math.ceil(
        (task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      await this.notifyDeadlineApproaching(task.id, daysUntilDeadline);
    }

    return upcomingTasks.length;
  }

  async checkBlockedTasks() {
    // Find tasks that are blocked by incomplete dependencies
    const blockedTasks = await this.prisma.task.findMany({
      where: {
        status: 'TODO',
        isActive: true,
        dependencies: {
          some: {
            predecessorTask: {
              status: { not: 'COMPLETED' }
            }
          }
        }
      },
      include: {
        dependencies: {
          include: {
            predecessorTask: {
              select: { id: true, title: true, status: true }
            }
          }
        }
      }
    });

    for (const task of blockedTasks) {
      const incompleteDependencies = task.dependencies.filter(
        dep => dep.predecessorTask.status !== 'COMPLETED'
      );

      for (const dep of incompleteDependencies) {
        await this.notifyDependencyBlocked(task.id, dep.predecessorTask.id);
      }
    }

    return blockedTasks.length;
  }
}