import { Request, Response } from "express";
import { PrismaClient, LeaveStatus } from "@prisma/client";
import "../../../types/express"; // Import express type extensions

const prisma = new PrismaClient();

export const createLeave = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { type, reason, startDate, endDate } = req.body;
    
    // Validate required fields
    if (!type || !startDate || !endDate) {
      return res.status(400).json({ 
        error: "Missing required fields: type, startDate, endDate" 
      });
    }

    // Get user's employee record
    const employee = await prisma.employee.findFirst({
      where: { userId: req.user.id },
      include: { department: true }
    });

    if (!employee) {
      return res.status(400).json({ 
        error: "Employee record not found. Please contact admin." 
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      return res.status(400).json({ 
        error: "End date cannot be before start date" 
      });
    }

    if (start < new Date()) {
      return res.status(400).json({ 
        error: "Start date cannot be in the past" 
      });
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId: employee.id,
        departmentId: employee.departmentId,
        type,
        reason: reason || "",
        startDate: start,
        endDate: end,
        status: LeaveStatus.PENDING
      },
      include: {
        employee: {
          include: { user: true }
        },
        department: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      leave: {
        id: leave.id,
        type: leave.type,
        reason: leave.reason,
        startDate: leave.startDate,
        endDate: leave.endDate,
        status: leave.status,
        employee: {
          name: `${leave.employee.user.firstName} ${leave.employee.user.lastName}`,
          employeeCode: leave.employee.employeeCode
        },
        department: leave.department.name,
        createdAt: leave.createdAt
      }
    });
  } catch (error) {
    console.error("Create leave error:", error);
    res.status(500).json({ 
      error: "Failed to create leave application",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getMyLeaves = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user's employee record
    const employee = await prisma.employee.findFirst({
      where: { userId: req.user.id }
    });

    if (!employee) {
      return res.status(400).json({ 
        error: "Employee record not found" 
      });
    }

    const leaves = await prisma.leave.findMany({
      where: { employeeId: employee.id },
      include: { 
        employee: {
          include: { user: true }
        },
        department: true, 
        approvedBy: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedLeaves = leaves.map(leave => ({
      id: leave.id,
      type: leave.type,
      reason: leave.reason,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
      department: leave.department.name,
      approvedBy: leave.approvedBy ? 
        `${leave.approvedBy.user.firstName} ${leave.approvedBy.user.lastName}` : null,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt
    }));

    res.json({
      success: true,
      leaves: formattedLeaves,
      count: formattedLeaves.length
    });
  } catch (error) {
    console.error("Get my leaves error:", error);
    res.status(500).json({ error: "Failed to fetch your leaves" });
  }
};

export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Only admins and managers can see all leaves
    if (!['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const leaves = await prisma.leave.findMany({
      include: { 
        employee: {
          include: { user: true }
        },
        department: true, 
        approvedBy: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedLeaves = leaves.map(leave => ({
      id: leave.id,
      type: leave.type,
      reason: leave.reason,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
      employee: {
        name: `${leave.employee.user.firstName} ${leave.employee.user.lastName}`,
        employeeCode: leave.employee.employeeCode
      },
      department: leave.department.name,
      approvedBy: leave.approvedBy ? 
        `${leave.approvedBy.user.firstName} ${leave.approvedBy.user.lastName}` : null,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt
    }));

    res.json({
      success: true,
      leaves: formattedLeaves,
      count: formattedLeaves.length
    });
  } catch (error) {
    console.error("Get all leaves error:", error);
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
};

export const getLeaveById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const leave = await prisma.leave.findUnique({
      where: { id: Number(req.params.id) },
      include: { 
        employee: {
          include: { user: true }
        },
        department: true, 
        approvedBy: {
          include: { user: true }
        }
      }
    });

    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }

    // Check if user can access this leave
    const userEmployee = await prisma.employee.findFirst({
      where: { userId: req.user.id }
    });

    const canAccess = 
      leave.employeeId === userEmployee?.id || // Own leave
      ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(req.user.role); // Admin/Manager

    if (!canAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    const formattedLeave = {
      id: leave.id,
      type: leave.type,
      reason: leave.reason,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
      employee: {
        name: `${leave.employee.user.firstName} ${leave.employee.user.lastName}`,
        employeeCode: leave.employee.employeeCode
      },
      department: leave.department.name,
      approvedBy: leave.approvedBy ? 
        `${leave.approvedBy.user.firstName} ${leave.approvedBy.user.lastName}` : null,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt
    };

    res.json({
      success: true,
      leave: formattedLeave
    });
  } catch (error) {
    console.error("Get leave by ID error:", error);
    res.status(500).json({ error: "Failed to fetch leave" });
  }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Only admins and managers can update leave status
    if (!['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { status } = req.body;
    if (!Object.values(LeaveStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Get approver's employee record
    const approverEmployee = await prisma.employee.findFirst({
      where: { userId: req.user.id }
    });

    const leave = await prisma.leave.update({
      where: { id: Number(req.params.id) },
      data: { 
        status, 
        approvedById: approverEmployee?.id 
      },
      include: {
        employee: {
          include: { user: true }
        },
        department: true,
        approvedBy: {
          include: { user: true }
        }
      }
    });

    const formattedLeave = {
      id: leave.id,
      type: leave.type,
      reason: leave.reason,
      startDate: leave.startDate,
      endDate: leave.endDate,
      status: leave.status,
      employee: {
        name: `${leave.employee.user.firstName} ${leave.employee.user.lastName}`,
        employeeCode: leave.employee.employeeCode
      },
      department: leave.department.name,
      approvedBy: leave.approvedBy ? 
        `${leave.approvedBy.user.firstName} ${leave.approvedBy.user.lastName}` : null,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt
    };

    res.json({
      success: true,
      message: "Leave status updated successfully",
      leave: formattedLeave
    });
  } catch (error) {
    console.error("Update leave status error:", error);
    res.status(500).json({ error: "Failed to update leave status" });
  }
};

export const deleteLeave = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const leave = await prisma.leave.findUnique({
      where: { id: Number(req.params.id) },
      include: { employee: true }
    });

    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }

    // Check if user can delete this leave
    const userEmployee = await prisma.employee.findFirst({
      where: { userId: req.user.id }
    });

    const canDelete = 
      leave.employeeId === userEmployee?.id || // Own leave
      ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role); // Admin only

    if (!canDelete) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Only allow deletion of pending leaves
    if (leave.status !== LeaveStatus.PENDING) {
      return res.status(400).json({ 
        error: "Only pending leaves can be deleted" 
      });
    }

    await prisma.leave.delete({ 
      where: { id: Number(req.params.id) } 
    });

    res.json({ 
      success: true,
      message: "Leave deleted successfully" 
    });
  } catch (error) {
    console.error("Delete leave error:", error);
    res.status(500).json({ error: "Failed to delete leave" });
  }
};
