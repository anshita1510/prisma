import { PrismaClient, Role, LeaveStatus, Designation } from '@prisma/client';

const prisma = new PrismaClient();

export interface ApprovalPermission {
  canApprove: boolean;
  reason?: string;
}

export class LeaveApprovalService {
  /**
   * Check if a user can approve a specific leave request
   * Uses DESIGNATION-based approval for Manager leaves
   */
  async canApproveLeave(
    approverId: number,
    approverRole: Role,
    leaveId: number
  ): Promise<ApprovalPermission> {
    console.log('🔍 Checking approval permission:', {
      approverId,
      approverRole,
      leaveId
    });

    const leave = await prisma.leave.findUnique({
      where: { id: leaveId },
      include: {
        employee: {
          include: {
            user: true
          }
        }
      }
    });

    if (!leave) {
      return {
        canApprove: false,
        reason: 'Leave request not found'
      };
    }

    // Cannot approve own leave
    if (leave.employeeId === approverId) {
      console.log('🔴 Cannot approve own leave:', {
        leaveEmployeeId: leave.employeeId,
        approverId: approverId,
        leaveApplicant: leave.employee.name,
        leaveId: leaveId
      });
      return {
        canApprove: false,
        reason: 'You cannot approve your own leave request'
      };
    }

    // Leave must be pending
    if (leave.status !== LeaveStatus.PENDING) {
      return {
        canApprove: false,
        reason: `Leave request is already ${leave.status.toLowerCase()}`
      };
    }

    // Get approver's designation
    const approver = await prisma.employee.findUnique({
      where: { id: approverId },
      select: { designation: true }
    });

    if (!approver) {
      return {
        canApprove: false,
        reason: 'Approver not found'
      };
    }

    const applicantRole = leave.employee.user.role;
    const applicantDesignation = leave.employee.designation;
    const approverDesignation = approver.designation;

    // Role-based and Designation-based approval logic
    if (applicantRole === 'EMPLOYEE') {
      // Employees can be approved by HR (designation) or Manager (designation)
      if (approverDesignation === Designation.HR || approverDesignation === Designation.MANAGER) {
        return { canApprove: true };
      }
      return {
        canApprove: false,
        reason: 'Only HR or Manager (by designation) can approve employee leave requests'
      };
    }

    if (applicantRole === 'MANAGER' || applicantDesignation === Designation.MANAGER) {
      // Managers can ONLY be approved by HR (designation)
      if (approverDesignation === Designation.HR) {
        return { canApprove: true };
      }
      return {
        canApprove: false,
        reason: 'Only HR (by designation) can approve manager leave requests'
      };
    }

    if (applicantRole === 'ADMIN' || applicantDesignation === Designation.HR) {
      // HR can only be approved by CEO
      if (approverRole === 'SUPER_ADMIN') {
        return { canApprove: true };
      }
      return {
        canApprove: false,
        reason: 'Only CEO can approve HR leave requests'
      };
    }

    return {
      canApprove: false,
      reason: 'Invalid approval configuration'
    };
  }

  /**
   * Get leaves that the user can approve
   * Uses DESIGNATION-based filtering for Manager leaves
   */
  async getApprovableLeaves(
    approverId: number,
    approverRole: Role,
    companyId: number
  ): Promise<any[]> {
    // Get approver's designation
    const approver = await prisma.employee.findUnique({
      where: { id: approverId },
      select: { designation: true }
    });

    if (!approver) {
      return [];
    }

    const approverDesignation = approver.designation;

    let whereClause: any = {
      status: LeaveStatus.PENDING,
      employee: {
        companyId,
        NOT: {
          id: approverId // Exclude own leaves
        }
      }
    };

    // Filter based on approver designation
    if (approverDesignation === Designation.MANAGER) {
      // Managers (by designation) can approve only employee leaves
      whereClause.employee.user = {
        role: 'EMPLOYEE'
      };
    } else if (approverDesignation === Designation.HR) {
      // HR (by designation) can approve employee and manager leaves
      // This includes both role-based and designation-based managers
      whereClause.OR = [
        {
          employee: {
            user: {
              role: {
                in: ['EMPLOYEE', 'MANAGER']
              }
            }
          }
        },
        {
          employee: {
            designation: Designation.MANAGER
          }
        }
      ];
    } else if (approverRole === 'SUPER_ADMIN') {
      // CEO can approve all leaves (employee, manager, HR)
      // No additional filter needed
    } else {
      // Other designations cannot approve
      return [];
    }

    const leaves = await prisma.leave.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            user: true,
            department: true
          }
        },
        department: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return leaves.map(leave => ({
      id: leave.id,
      type: leave.type,
      reason: leave.reason,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
      employee: {
        id: leave.employee.id,
        name: leave.employee.name,
        employeeCode: leave.employee.employeeCode,
        role: leave.employee.user.role,
        designation: leave.employee.designation
      },
      department: leave.department.name,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt
    }));
  }

  /**
   * Get leave statistics for dashboard
   */
  async getLeaveStatistics(
    employeeId: number,
    companyId: number
  ): Promise<any> {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    const leaves = await prisma.leave.findMany({
      where: {
        employeeId,
        employee: {
          companyId
        },
        startDate: {
          gte: yearStart,
          lte: yearEnd
        }
      }
    });

    const stats = {
      total: leaves.length,
      pending: leaves.filter(l => l.status === LeaveStatus.PENDING).length,
      approved: leaves.filter(l => l.status === LeaveStatus.APPROVED).length,
      rejected: leaves.filter(l => l.status === LeaveStatus.REJECTED).length,
      byType: {
        CASUAL: leaves.filter(l => l.type === 'CASUAL').length,
        SICK: leaves.filter(l => l.type === 'SICK').length,
        EARNED: leaves.filter(l => l.type === 'EARNED').length,
        UNPAID: leaves.filter(l => l.type === 'UNPAID').length
      }
    };

    return stats;
  }

  /**
   * Calculate leave days
   */
  calculateLeaveDays(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  }

  /**
   * Check for overlapping leaves
   */
  async checkOverlappingLeaves(
    employeeId: number,
    startDate: Date,
    endDate: Date,
    excludeLeaveId?: number
  ): Promise<boolean> {
    const whereClause: any = {
      employeeId,
      status: {
        in: [LeaveStatus.PENDING, LeaveStatus.APPROVED]
      },
      OR: [
        {
          AND: [
            { startDate: { lte: startDate } },
            { endDate: { gte: startDate } }
          ]
        },
        {
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: endDate } }
          ]
        },
        {
          AND: [
            { startDate: { gte: startDate } },
            { endDate: { lte: endDate } }
          ]
        }
      ]
    };

    if (excludeLeaveId) {
      whereClause.NOT = { id: excludeLeaveId };
    }

    const overlapping = await prisma.leave.findFirst({
      where: whereClause
    });

    return !!overlapping;
  }
}
