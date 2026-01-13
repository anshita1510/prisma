import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import {
  createLeave,
  getAllLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave,
  getMyLeaves
} from "../../controller/leave/leave.controller";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// User routes (authenticated users can access their own leaves)
router.post("/", createLeave);
router.get("/my-leaves", getMyLeaves);
router.get("/", getAllLeaves);
router.get("/:id", getLeaveById);
router.patch("/:id/status", updateLeaveStatus);
router.delete("/:id", deleteLeave);

export default router;
