// src/controllers/attendance.controller.ts
import { Request, Response } from 'express';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceStatus, Designation, DepartmentType } from '@prisma/client';
import { subDays } from 'date-fns';
import { prisma } from '../../../config/db';
import '../../../types/express'; // Import express type extensions

const attendanceService = new AttendanceService();

export class AttendanceController {
  // Helper method to get employee data from user
  private async getEmployeeFromUser(userId: number) {
    let employee = await prisma.employee.findUnique({
      where: { userId },
      include: {
        user: true,
        company: true,
        department: true
      }
    });
    
    // If employee record doesn't exist, create it
    if (!employee) {
      console.log(`⚠️ Employee record not found for user ${userId}, creating one...`);
      employee = await this.createEmployeeForUser(userId);
    }
    
    return employee;
  }

  // Helper method to create employee record for existing user
  private async createEmployeeForUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get or create default company
    let companyId = user.companyId;
    if (!companyId) {
      const defaultCompany = await prisma.company.upsert({
        where: { code: 'DEFAULT_COMPANY' },
        update: {},
        create: {
          name: 'Default Company',
          code: 'DEFAULT_COMPANY',
          isActive: true
        }
      });
      companyId = defaultCompany.id;

      // Update user with company
      await prisma.user.update({
        where: { id: userId },
        data: { companyId }
      });
    }

    // Get or create default department
    const defaultDepartment = await prisma.department.upsert({
      where: {
        companyId_name: {
          companyId: companyId,
          name: 'General'
        }
      },
      update: {},
      create: {
        name: 'General',
        type: DepartmentType.OPERATIONS,
        companyId: companyId
      }
    });

    // Map user role to employee designation
    let designation: Designation;
    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        designation = Designation.MANAGER;
        break;
      case 'MANAGER':
        designation = Designation.MANAGER;
        break;
      default:
        designation = Designation.SOFTWARE_ENGINEER;
    }

    // Generate unique employee code
    const employeeCode = `EMP${userId.toString().padStart(4, '0')}`;

    // Create employee record
    const employee = await prisma.employee.create({
      data: {
        userId,
        companyId,
        departmentId: defaultDepartment.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        designation,
        employeeCode,
        isActive: true
      },
      include: {
        user: true,
        company: true,
        department: true
      }
    });

    console.log(`✅ Created employee record for user ${userId} (Employee ID: ${employee.id}, Code: ${employeeCode})`);
    return employee;
  }

  // POST /api/attendance/my-check-in - Check in for current user
  async myCheckIn(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const employee = await this.getEmployeeFromUser(req.user.id);

      const attendance = await attendanceService.checkIn(
        employee.id,
        employee.companyId,
        employee.departmentId
      );

      return res.status(200).json({
        success: true,
        message: 'Checked in successfully',
        data: attendance
      });
    } catch (error: any) {
      console.error('Check-in error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to check in'
      });
    }
  }

  // POST /api/attendance/my-check-out - Check out for current user
  async myCheckOut(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const employee = await this.getEmployeeFromUser(req.user.id);
      const attendance = await attendanceService.checkOut(employee.id);

      return res.status(200).json({
        success: true,
        message: 'Checked out successfully',
        data: attendance
      });
    } catch (error: any) {
      console.error('Check-out error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to check out'
      });
    }
  }

  // GET /api/attendance/my-stats - Get stats for current user
  async getMyStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { period = 'week' } = req.query;
      const employee = await this.getEmployeeFromUser(req.user.id);

      let startDate: Date;
      const endDate = new Date();

      switch (period) {
        case 'week':
          startDate = subDays(endDate, 7);
          break;
        case 'month':
          startDate = subDays(endDate, 30);
          break;
        case 'year':
          startDate = subDays(endDate, 365);
          break;
        default:
          startDate = subDays(endDate, 7);
      }

      const stats = await attendanceService.getAttendanceStats(
        employee.id,
        startDate,
        endDate
      );

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('Get my stats error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get attendance stats'
      });
    }
  }

  // GET /api/attendance/my-logs - Get logs for current user
  async getMyLogs(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { days = '30' } = req.query;
      const employee = await this.getEmployeeFromUser(req.user.id);

      const logs = await attendanceService.getAttendanceLogs(
        employee.id,
        Number(days)
      );

      return res.status(200).json({
        success: true,
        data: logs
      });
    } catch (error: any) {
      console.error('Get my logs error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get attendance logs'
      });
    }
  }

  // GET /api/attendance/my-team-stats - Get team stats for current user's department
  async getMyTeamStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { period = 'week' } = req.query;
      const employee = await this.getEmployeeFromUser(req.user.id);

      let startDate: Date;
      const endDate = new Date();

      switch (period) {
        case 'week':
          startDate = subDays(endDate, 7);
          break;
        case 'month':
          startDate = subDays(endDate, 30);
          break;
        default:
          startDate = subDays(endDate, 7);
      }

      const stats = await attendanceService.getTeamAttendanceStats(
        employee.departmentId,
        startDate,
        endDate
      );

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('Get my team stats error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get team stats'
      });
    }
  }

  // GET /api/attendance/my-today - Get today's attendance for current user
  async getMyTodayAttendance(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const employee = await this.getEmployeeFromUser(req.user.id);
      const attendance = await attendanceService.getTodayAttendance(employee.id);

      return res.status(200).json({
        success: true,
        data: attendance
      });
    } catch (error: any) {
      console.error('Get my today attendance error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get today\'s attendance'
      });
    }
  }
  // POST /api/attendance/check-in
  async checkIn(req: Request, res: Response) {
    try {
      const { employeeId, companyId, departmentId } = req.body;

      if (!employeeId || !companyId || !departmentId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: employeeId, companyId, departmentId'
        });
      }

      const attendance = await attendanceService.checkIn(
        Number(employeeId),
        Number(companyId),
        Number(departmentId)
      );

      return res.status(200).json({
        success: true,
        message: 'Checked in successfully',
        data: attendance
      });
    } catch (error: any) {
      console.error('Check-in error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to check in'
      });
    }
  }

  // POST /api/attendance/check-out
  async checkOut(req: Request, res: Response) {
    try {
      const { employeeId } = req.body;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
      }

      const attendance = await attendanceService.checkOut(Number(employeeId));

      return res.status(200).json({
        success: true,
        message: 'Checked out successfully',
        data: attendance
      });
    } catch (error: any) {
      console.error('Check-out error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to check out'
      });
    }
  }

  // GET /api/attendance/stats/:employeeId
  async getStats(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const { period = 'week' } = req.query;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
      }

      let startDate: Date;
      const endDate = new Date();

      switch (period) {
        case 'week':
          startDate = subDays(endDate, 7);
          break;
        case 'month':
          startDate = subDays(endDate, 30);
          break;
        case 'year':
          startDate = subDays(endDate, 365);
          break;
        default:
          startDate = subDays(endDate, 7);
      }

      const stats = await attendanceService.getAttendanceStats(
        Number(employeeId),
        startDate,
        endDate
      );

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('Get stats error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get attendance stats'
      });
    }
  }

  // GET /api/attendance/logs/:employeeId
  async getLogs(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const { days = '30' } = req.query;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
      }

      const logs = await attendanceService.getAttendanceLogs(
        Number(employeeId),
        Number(days)
      );

      return res.status(200).json({
        success: true,
        data: logs
      });
    } catch (error: any) {
      console.error('Get logs error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get attendance logs'
      });
    }
  }

  // GET /api/attendance/team-stats/:departmentId
  async getTeamStats(req: Request, res: Response) {
    try {
      const { departmentId } = req.params;
      const { period = 'week' } = req.query;

      if (!departmentId) {
        return res.status(400).json({
          success: false,
          message: 'Department ID is required'
        });
      }

      let startDate: Date;
      const endDate = new Date();

      switch (period) {
        case 'week':
          startDate = subDays(endDate, 7);
          break;
        case 'month':
          startDate = subDays(endDate, 30);
          break;
        default:
          startDate = subDays(endDate, 7);
      }

      const stats = await attendanceService.getTeamAttendanceStats(
        Number(departmentId),
        startDate,
        endDate
      );

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('Get team stats error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get team stats'
      });
    }
  }

  // GET /api/attendance/today/:employeeId
  async getTodayAttendance(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
      }

      const attendance = await attendanceService.getTodayAttendance(
        Number(employeeId)
      );

      return res.status(200).json({
        success: true,
        data: attendance
      });
    } catch (error: any) {
      console.error('Get today attendance error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get today\'s attendance'
      });
    }
  }

  // GET /api/attendance/calendar/:employeeId
  async getCalendar(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const { month, year } = req.query;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
      }

      if (!month || !year) {
        return res.status(400).json({
          success: false,
          message: 'Month and year are required'
        });
      }

      const calendar = await attendanceService.getAttendanceCalendar(
        Number(employeeId),
        Number(month),
        Number(year)
      );

      return res.status(200).json({
        success: true,
        data: calendar
      });
    } catch (error: any) {
      console.error('Get calendar error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get attendance calendar'
      });
    }
  }

  // POST /api/attendance/mark
  // Admin route to manually mark attendance
  async markAttendance(req: Request, res: Response) {
    try {
      const {
        employeeId,
        companyId,
        departmentId,
        date,
        status,
        checkIn,
        checkOut
      } = req.body;

      if (!employeeId || !companyId || !departmentId || !date || !status) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: employeeId, companyId, departmentId, date, status'
        });
      }

      // Validate status
      const validStatuses = ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      const attendance = await attendanceService.markAttendance(
        Number(employeeId),
        Number(companyId),
        Number(departmentId),
        new Date(date),
        status as AttendanceStatus,
        checkIn ? new Date(checkIn) : undefined,
        checkOut ? new Date(checkOut) : undefined
      );

      return res.status(200).json({
        success: true,
        message: 'Attendance marked successfully',
        data: attendance
      });
    } catch (error: any) {
      console.error('Mark attendance error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark attendance'
      });
    }
  }
}