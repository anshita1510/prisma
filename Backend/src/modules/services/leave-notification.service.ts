import { PrismaClient, Role, LeaveStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface LeaveNotificationRecipients {
  hr: number[];
  managers: number[];
  ceo: number[];
}

export class LeaveNotificationService {
  /**
   * Get notification recipients based on applicant role
   */
  async getNotificationRecipients(
    applicantRole: Role,
    companyId: number,
    departmentId?: number
  ): Promise<LeaveNotificationRecipients> {
    const recipients: LeaveNotificationRecipients = {
      hr: [],
      managers: [],
      ceo: []
    };

    // Get HR users
    const hrUsers = await prisma.employee.findMany({
      where: {
        companyId,
        designation: 'HR',
        isActive: true
      },
      select: { id: true }
    });
    recipients.hr = hrUsers.map(u => u.id);

    // Get CEO/Super Admin
    const ceoUsers = await prisma.user.findMany({
      where: {
        companyId,
        role: 'SUPER_ADMIN',
        isActive: true
      },
      include: { employee: true }
    });
    recipients.ceo = ceoUsers
      .filter(u => u.employee)
      .map(u => u.employee!.id);

    // Get Managers (if department specified)
    if (departmentId) {
      const managers = await prisma.employee.findMany({
        where: {
          companyId,
          departmentId,
          designation: 'MANAGER',
          isActive: true
        },
        select: { id: true }
      });
      recipients.managers = managers.map(m => m.id);
    }

    return recipients;
  }

  /**
   * Send leave application notification
   */
  async sendLeaveApplicationNotification(
    leaveId: number,
    applicantId: number,
    applicantRole: Role,
    companyId: number,
    departmentId?: number
  ): Promise<void> {
    const leave = await prisma.leave.findUnique({
      where: { id: leaveId },
      include: {
        employee: {
          include: { user: true }
        }
      }
    });

    if (!leave) return;

    const applicantName = leave.employee.name;
    const leaveType = leave.type;
    const startDate = leave.startDate.toLocaleDateString();
    const endDate = leave.endDate.toLocaleDateString();

    // Determine recipients based on role
    let recipientIds: number[] = [];
    
    if (applicantRole === 'EMPLOYEE') {
      // Employee: notify HR, Manager, and CEO
      const recipients = await this.getNotificationRecipients(
        applicantRole,
        companyId,
        departmentId
      );
      recipientIds = [
        ...recipients.hr,
        ...recipients.managers,
        ...recipients.ceo
      ];
    } else if (applicantRole === 'MANAGER') {
      // Manager: notify HR and CEO only
      const recipients = await this.getNotificationRecipients(
        applicantRole,
        companyId
      );
      recipientIds = [...recipients.hr, ...recipients.ceo];
    } else if (applicantRole === 'ADMIN') {
      // HR/Admin: notify CEO only
      const recipients = await this.getNotificationRecipients(
        applicantRole,
        companyId
      );
      recipientIds = recipients.ceo;
    }

    // Remove duplicates and applicant from recipients
    recipientIds = [...new Set(recipientIds)].filter(id => id !== applicantId);

    if (recipientIds.length === 0) return;

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        title: 'New Leave Application',
        message: `${applicantName} has applied for ${leaveType} leave from ${startDate} to ${endDate}`,
        type: 'TASK_ASSIGNED', // Reusing existing enum
        referenceId: leaveId,
        referenceType: 'leave',
        metadata: {
          leaveId,
          applicantId,
          applicantName,
          leaveType,
          startDate,
          endDate,
          status: leave.status
        },
        createdById: applicantId
      }
    });

    // Create notification recipients
    await prisma.notificationRecipient.createMany({
      data: recipientIds.map(recipientId => ({
        notificationId: notification.id,
        recipientId
      }))
    });
  }

  /**
   * Send leave status update notification to applicant
   */
  async sendLeaveStatusNotification(
    leaveId: number,
    status: LeaveStatus,
    approverName: string
  ): Promise<void> {
    const leave = await prisma.leave.findUnique({
      where: { id: leaveId },
      include: {
        employee: {
          include: { user: true }
        }
      }
    });

    if (!leave) return;

    const applicantId = leave.employeeId;
    const leaveType = leave.type;
    const startDate = leave.startDate.toLocaleDateString();
    const endDate = leave.endDate.toLocaleDateString();

    const statusText = status === LeaveStatus.APPROVED ? 'approved' : 'rejected';
    const message = `Your ${leaveType} leave request from ${startDate} to ${endDate} has been ${statusText} by ${approverName}`;

    // Create notification for applicant
    const notification = await prisma.notification.create({
      data: {
        title: `Leave Request ${status === LeaveStatus.APPROVED ? 'Approved' : 'Rejected'}`,
        message,
        type: 'TASK_UPDATED', // Reusing existing enum
        referenceId: leaveId,
        referenceType: 'leave',
        metadata: {
          leaveId,
          leaveType,
          startDate,
          endDate,
          status,
          approverName
        },
        createdById: leave.approvedById || applicantId
      }
    });

    // Send to applicant
    await prisma.notificationRecipient.create({
      data: {
        notificationId: notification.id,
        recipientId: applicantId
      }
    });
  }

  /**
   * Get unread leave notifications count
   */
  async getUnreadLeaveNotificationsCount(employeeId: number): Promise<number> {
    return await prisma.notificationRecipient.count({
      where: {
        recipientId: employeeId,
        isRead: false,
        notification: {
          referenceType: 'leave'
        }
      }
    });
  }

  /**
   * Mark leave notifications as read
   */
  async markLeaveNotificationsAsRead(
    employeeId: number,
    notificationIds: number[]
  ): Promise<void> {
    await prisma.notificationRecipient.updateMany({
      where: {
        recipientId: employeeId,
        notificationId: { in: notificationIds },
        notification: {
          referenceType: 'leave'
        }
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  }
}
