import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import {
  createLeave,
  getAllLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave,
  getMyLeaves,
  getApprovableLeaves,
  getLeaveStatistics,
  getLeaveNotifications,
  markLeaveNotificationsRead,
  checkApprovalPermission
} from "../../controller/leave/leave.controller";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Leave application routes
router.post("/", createLeave);
router.get("/my-leaves", getMyLeaves);
router.get("/statistics", getLeaveStatistics);

// Approval routes
router.get("/approvable", getApprovableLeaves);
router.get("/:id/can-approve", checkApprovalPermission);
router.patch("/:id/status", updateLeaveStatus);

// Notification routes
router.get("/notifications", getLeaveNotifications);
router.post("/notifications/mark-read", markLeaveNotificationsRead);

// General routes
router.get("/", getAllLeaves);
router.get("/:id", getLeaveById);
router.delete("/:id", deleteLeave);

export default router;
