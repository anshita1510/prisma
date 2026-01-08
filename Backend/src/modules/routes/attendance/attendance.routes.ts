// src/routes/attendance.routes.ts
import { Router } from 'express';
import { AttendanceController } from '../../controller/attendance/attendance.controller';
import { validateBody, validateQuery } from '../../../middlewares/validation.middleware';
import { authenticate } from '../../../middlewares/auth.middleware';
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
  (req, res) => attendanceController.myCheckIn(req, res)
);

router.post(
  '/my-check-out', 
  authenticate,
  (req, res) => attendanceController.myCheckOut(req, res)
);

router.get(
  '/my-stats',
  authenticate,
  (req, res) => attendanceController.getMyStats(req, res)
);

router.get(
  '/my-logs',
  authenticate,
  (req, res) => attendanceController.getMyLogs(req, res)
);

router.get(
  '/my-team-stats',
  authenticate,
  (req, res) => attendanceController.getMyTeamStats(req, res)
);

router.get(
  '/my-today',
  authenticate,
  (req, res) => attendanceController.getMyTodayAttendance(req, res)
);

// Admin routes (with specific employee IDs)
// Check in
router.post(
  '/check-in', 
  validateBody(CheckInSchema),
  (req, res) => attendanceController.checkIn(req, res)
);

// Check out
router.post(
  '/check-out', 
  validateBody(CheckOutSchema),
  (req, res) => attendanceController.checkOut(req, res)
);

// Get attendance stats for employee
router.get(
  '/stats/:employeeId',
  (req, res) => attendanceController.getStats(req, res)
);

// Get attendance logs for employee
router.get(
  '/logs/:employeeId',
  (req, res) => attendanceController.getLogs(req, res)
);

// Get team attendance stats
router.get(
  '/team-stats/:departmentId',
  (req, res) => attendanceController.getTeamStats(req, res)
);

// Get today's attendance
router.get(
  '/today/:employeeId',
  (req, res) => attendanceController.getTodayAttendance(req, res)
);

// Get attendance calendar
router.get(
  '/calendar/:employeeId',
  validateQuery(GetCalendarQuerySchema),
  (req, res) => attendanceController.getCalendar(req, res)
);

// Mark attendance (admin only)
// TODO: Add authentication & authorization middleware
router.post(
  '/mark',
  validateBody(MarkAttendanceSchema),
  (req, res) => attendanceController.markAttendance(req, res)
);

export default router;