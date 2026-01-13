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

// Routes for current user (authenticated)
router.post(
  '/my-check-in', 
  authenticate,
  (req, res) => attendanceController.checkIn(req, res)
);

router.post(
  '/my-check-out', 
  authenticate,
  (req, res) => attendanceController.checkOut(req, res)
);

router.get(
  '/my-stats',
  authenticate,
  (req, res) => attendanceController.getAttendanceDashboardStats(req, res)
);

router.get(
  '/my-logs',
  authenticate,
  (req, res) => attendanceController.getPersonalAttendanceHistory(req, res)
);

router.get(
  '/my-team-stats',
  authenticate,
  (req, res) => attendanceController.getAttendanceDashboardStats(req, res)
);

router.get(
  '/my-today',
  authenticate,
  (req, res) => attendanceController.getPersonalAttendanceHistory(req, res)
);

// Admin routes (with specific employee IDs)
router.post(
  '/check-in', 
  authenticate,
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN),
  validateBody(CheckInSchema),
  (req, res) => attendanceController.checkIn(req, res)
);

router.post(
  '/check-out', 
  authenticate,
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN),
  validateBody(CheckOutSchema),
  (req, res) => attendanceController.checkOut(req, res)
);

router.get(
  '/stats/:employeeId',
  authenticate,
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getAttendanceDashboardStats(req, res)
);

router.get(
  '/logs/:employeeId',
  authenticate,
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getPersonalAttendanceHistory(req, res)
);

router.get(
  '/team-stats/:departmentId',
  authenticate,
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getAttendanceDashboardStats(req, res)
);

router.get(
  '/today/:employeeId',
  authenticate,
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  (req, res) => attendanceController.getPersonalAttendanceHistory(req, res)
);

router.get(
  '/calendar/:employeeId',
  authenticate,
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER),
  validateQuery(GetCalendarQuerySchema),
  (req, res) => attendanceController.generateMonthlyAttendanceReport(req, res)
);

router.post(
  '/mark',
  authenticate,
  requireAnyRole(Role.ADMIN, Role.SUPER_ADMIN),
  validateBody(MarkAttendanceSchema),
  (req, res) => attendanceController.performManualAttendanceCorrection(req, res)
);

export default router;