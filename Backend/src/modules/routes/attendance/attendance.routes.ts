// src/routes/attendance.routes.ts
import { Router } from 'express';
import { AttendanceController } from '../../controller/attendance/attendance.controller';
import { validateBody, validateQuery } from '../../../middlewares/validation.middleware';
import { authenticate } from '../../../middlewares/auth.middleware';
import { requireAnyRole } from '../../../middlewares/role.middleware';
import { Role } from '@prisma/client';
import { 
  CheckInSchema, 
  CheckOutSchema, 
  MarkAttendanceSchema,
  GetCalendarQuerySchema
} from '../../dto/attendance/attendance.dto';

const router = Router();
const attendanceController = new AttendanceController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Personal Attendance Routes (All authenticated users)
router.post(
  '/my-check-in', 
  (req, res) => attendanceController.checkIn(req, res)
);

router.post(
  '/my-check-out', 
  (req, res) => attendanceController.checkOut(req, res)
);

router.get(
  '/my-stats',
  (req, res) => attendanceController.getAttendanceDashboardStats(req, res)
);

router.get(
  '/my-logs',
  (req, res) => attendanceController.getPersonalAttendanceHistory(req, res)
);

router.get(
  '/my-team-stats',
  (req, res) => attendanceController.getAttendanceDashboardStats(req, res)
);

router.get(
  '/my-today',
  (req, res) => attendanceController.getPersonalAttendanceHistory(req, res)
);

router.post(
  '/regularization-request', 
  (req, res) => attendanceController.submitRegularizationRequest(req, res)
);

// Admin/Manager Routes - Check-in/Check-out for specific employees
router.post(
  '/check-in', 
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN),
  validateBody(CheckInSchema),
  (req, res) => attendanceController.checkIn(req, res)
);

router.post(
  '/check-out', 
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN),
  validateBody(CheckOutSchema),
  (req, res) => attendanceController.checkOut(req, res)
);

// Employee Management Routes (Admin and Manager only)
router.get(
  '/employees', 
  requireAnyRole(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), 
  (req, res) => attendanceController.getAllEmployeeAttendance(req, res)
);

// Dashboard Routes (Admin and Manager only)
router.get(
  '/dashboard-stats', 
  requireAnyRole(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER), 
  (req, res) => attendanceController.getAttendanceDashboardStats(req, res)
);

router.get(
  '/stats/:employeeId',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getAttendanceDashboardStats(req, res)
);

router.get(
  '/logs/:employeeId',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getPersonalAttendanceHistory(req, res)
);

router.get(
  '/team-stats/:departmentId',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getAttendanceDashboardStats(req, res)
);

router.get(
  '/today/:employeeId',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getPersonalAttendanceHistory(req, res)
);

router.get(
  '/history/:employeeId', 
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getPersonalAttendanceHistory(req, res)
);

router.get(
  '/calendar/:employeeId',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  validateQuery(GetCalendarQuerySchema),
  (req, res) => attendanceController.generateMonthlyAttendanceReport(req, res)
);

// Manual Attendance Correction (Admin only)
router.post(
  '/mark',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN),
  validateBody(MarkAttendanceSchema),
  (req, res) => attendanceController.performManualAttendanceCorrection(req, res)
);

// Regularization Request Management (Admin and Manager)
router.get(
  '/regularization-requests/pending',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getPendingRegularizationRequests(req, res)
);

router.post(
  '/regularization-requests/:requestId/approve',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.approveRegularizationRequest(req, res)
);

router.post(
  '/regularization-requests/:requestId/reject',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.rejectRegularizationRequest(req, res)
);

// Reporting Routes (Admin and Manager)
router.get(
  '/reports/daily',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.generateDailyAttendanceReport(req, res)
);

router.get(
  '/reports/monthly',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.generateMonthlyAttendanceReport(req, res)
);

// Audit Trail (Admin only)
router.get(
  '/audit-trail',
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN),
  (req, res) => attendanceController.getAuditTrail(req, res)
);

// Auto-checkout Routes (System/Admin only)
router.post(
  '/auto-checkout/trigger', 
  requireAnyRole(Role.SUPER_ADMIN, Role.ADMIN), 
  require('../../controller/attendance/autoCheckout.controller').autoCheckoutController.triggerAutoCheckout
);

router.post(
  '/auto-checkout/scheduled', 
  require('../../controller/attendance/autoCheckout.controller').autoCheckoutController.scheduledAutoCheckout
);

export default router;
