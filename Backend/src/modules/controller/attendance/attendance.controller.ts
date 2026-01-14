import { Request, Response } from 'express';
import { attendanceService } from '../../services/attendanceService';
import { $Enums } from '@prisma/client';

// Type aliases for easier use
type AttendanceStatus = $Enums.AttendanceStatus;
type RegularizationType = $Enums.RegularizationType;

class AttendanceController {
  // Personal Attendance Endpoints
  async checkIn(req: Request, res: Response) {
    try {
      const { employeeId } = req.body;
      const location = req.body.location;
      const deviceInfo = {
        userAgent: req.get('User-Agent') || '',
        ipAddress: req.ip || '',
        deviceType: req.body.deviceType || 'web'
      };

      const attendance = await attendanceService.checkIn({
        employeeId,
        location,
        deviceInfo
      }, req);

      res.status(200).json({
        success: true,
        message: 'Check-in successful',
        data: attendance
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Check-in failed'
      });
    }
  }

  async checkOut(req: Request, res: Response) {
    try {
      const { employeeId } = req.body;
      const location = req.body.location;
      const deviceInfo = {
        userAgent: req.get('User-Agent') || '',
        ipAddress: req.ip || '',
        deviceType: req.body.deviceType || 'web'
      };

      const attendance = await attendanceService.checkOut({
        employeeId,
        location,
        deviceInfo
      }, req);

      res.status(200).json({
        success: true,
        message: 'Check-out successful',
        data: attendance
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Check-out failed'
      });
    }
  }

  async getPersonalAttendanceHistory(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate } = req.query;

      const history = await attendanceService.getPersonalAttendanceHistory(
        parseInt(employeeId),
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch attendance history'
      });
    }
  }

  async submitRegularizationRequest(req: Request, res: Response) {
    try {
      const {
        employeeId,
        attendanceId,
        requestType,
        reason,
        proposedCheckIn,
        proposedCheckOut,
        proposedStatus
      } = req.body;

      const request = await attendanceService.submitRegularizationRequest({
        employeeId,
        attendanceId,
        requestType: requestType as RegularizationType,
        reason,
        proposedCheckIn: proposedCheckIn ? new Date(proposedCheckIn) : undefined,
        proposedCheckOut: proposedCheckOut ? new Date(proposedCheckOut) : undefined,
        proposedStatus: proposedStatus ? proposedStatus as AttendanceStatus : undefined
      }, req);

      res.status(201).json({
        success: true,
        message: 'Regularization request submitted successfully',
        data: request
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit regularization request'
      });
    }
  }

  // Employee Management Endpoints
  async getAllEmployeeAttendance(req: Request, res: Response) {
    try {
      const { date, departmentId } = req.query;

      const attendance = await attendanceService.getAllEmployeeAttendance(
        date ? new Date(date as string) : undefined,
        departmentId ? parseInt(departmentId as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: attendance
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch employee attendance'
      });
    }
  }

  async performManualAttendanceCorrection(req: Request, res: Response) {
    try {
      const {
        attendanceId,
        checkIn,
        checkOut,
        status,
        reason,
        correctedBy
      } = req.body;

      const correctedAttendance = await attendanceService.performManualAttendanceCorrection({
        attendanceId,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        status: status ? status as AttendanceStatus : undefined,
        reason,
        correctedBy
      }, req);

      res.status(200).json({
        success: true,
        message: 'Attendance corrected successfully',
        data: correctedAttendance
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to correct attendance'
      });
    }
  }

  async getPendingRegularizationRequests(req: Request, res: Response) {
    try {
      const { approverId } = req.query;

      const requests = await attendanceService.getPendingRegularizationRequests(
        approverId ? parseInt(approverId as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch pending requests'
      });
    }
  }

  async approveRegularizationRequest(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const { approverId } = req.body;

      const approvedRequest = await attendanceService.approveRegularizationRequest(
        requestId,
        approverId,
        req
      );

      res.status(200).json({
        success: true,
        message: 'Regularization request approved successfully',
        data: approvedRequest
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to approve request'
      });
    }
  }

  async rejectRegularizationRequest(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const { approverId, rejectionReason } = req.body;

      const rejectedRequest = await attendanceService.rejectRegularizationRequest(
        requestId,
        approverId,
        rejectionReason,
        req
      );

      res.status(200).json({
        success: true,
        message: 'Regularization request rejected successfully',
        data: rejectedRequest
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reject request'
      });
    }
  }

  // Reporting Endpoints
  async generateDailyAttendanceReport(req: Request, res: Response) {
    try {
      const { date, departmentId } = req.query;

      const report = await attendanceService.generateDailyAttendanceReport(
        date ? new Date(date as string) : new Date(),
        departmentId ? parseInt(departmentId as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate daily report'
      });
    }
  }

  async generateMonthlyAttendanceReport(req: Request, res: Response) {
    try {
      const { year, month, departmentId } = req.query;

      const report = await attendanceService.generateMonthlyAttendanceReport(
        parseInt(year as string),
        parseInt(month as string),
        departmentId ? parseInt(departmentId as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate monthly report'
      });
    }
  }

  // Audit Endpoints
  async getAuditTrail(req: Request, res: Response) {
    try {
      const { attendanceId, employeeId, startDate, endDate } = req.query;

      const auditTrail = await attendanceService.getAuditTrail(
        attendanceId ? parseInt(attendanceId as string) : undefined,
        employeeId ? parseInt(employeeId as string) : undefined,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: auditTrail
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch audit trail'
      });
    }
  }

  // Dashboard Statistics
  async getAttendanceDashboardStats(req: Request, res: Response) {
    try {
      const { date, departmentId } = req.query;
      const targetDate = date ? new Date(date as string) : new Date();

      const dailyReport = await attendanceService.generateDailyAttendanceReport(
        targetDate,
        departmentId ? parseInt(departmentId as string) : undefined
      );

      const pendingRequests = await attendanceService.getPendingRegularizationRequests();

      const stats = {
        date: targetDate,
        summary: dailyReport.summary,
        pendingRequests: pendingRequests.length,
        recentActivity: dailyReport.attendances
          .slice(0, 10)
          .map(attendance => ({
            id: attendance.id,
            employeeName: attendance.employee.name,
            action: attendance.checkOut ? 'Checked Out' : 'Checked In',
            time: attendance.checkOut || attendance.checkIn,
            status: attendance.status
          }))
      };

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch dashboard stats'
      });
    }
  }
}

export { AttendanceController };
export const attendanceController = new AttendanceController();