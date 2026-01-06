import { Router } from "express";

import {
  createLeave,
  getAllLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave
} from "../../controller/leave/leave.controller";

const router = Router();

router.post("/", createLeave);
router.get("/", getAllLeaves);
router.get("/:id", getLeaveById);
router.patch("/:id/status", updateLeaveStatus);
router.delete("/:id", deleteLeave);

export default router;
