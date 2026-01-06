import { Request, Response } from "express";
import { PrismaClient, LeaveStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const createLeave = async (req: Request, res: Response) => {
  try {
    const { employeeId, departmentId, type, reason, startDate, endDate } = req.body;
    const leave = await prisma.leave.create({
      data: {
        employeeId,
        departmentId,
        type,
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: "Failed to create leave" });
  }
};

export const getAllLeaves = async (_req: Request, res: Response) => {
  try {
    const leaves = await prisma.leave.findMany({
      include: { employee: true, department: true, approvedBy: true }
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
};

export const getLeaveById = async (req: Request, res: Response) => {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: Number(req.params.id) },
      include: { employee: true, department: true, approvedBy: true }
    });
    if (!leave) return res.status(404).json({ error: "Leave not found" });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leave" });
  }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { status, approvedById } = req.body;
    if (!Object.values(LeaveStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const leave = await prisma.leave.update({
      where: { id: Number(req.params.id) },
      data: { status, approvedById }
    });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: "Failed to update leave status" });
  }
};

export const deleteLeave = async (req: Request, res: Response) => {
  try {
    await prisma.leave.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete leave" });
  }
};
