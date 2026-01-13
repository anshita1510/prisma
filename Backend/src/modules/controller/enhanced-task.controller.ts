import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EnhancedTaskService } from '../services/enhanced-task.service';
import { NotificationService } from '../services/notification.service';
import { 
  CreateEnhancedTaskDto, 
  UpdateEnhancedTaskDto, 
  TaskQueryDto,
  CreateTaskDependencyDto,
  CreateTaskTimeEntryDto,
  UpdateTaskTimeEntryDto,
  CreateTaskCommentDto,
  TaskCalendarViewDto
} from '../dto/enhanced-task.dto';

const prisma = new PrismaClient();

export class EnhancedTaskController {
  private taskService: EnhancedTaskService;
  private notificationService: NotificationService;

  constructor() {
    this.taskService = new EnhancedTaskService(prisma);
    this.notificationService = new NotificationService(prisma);
  }

  createTask = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateEnhancedTaskDto.parse(req.body);
      const { employeeId, companyId } = req.user as any;

      const task = await this.taskService.createTask(
        validatedData,
        employeeId,
        companyId
      );

      // Send notification if task is assigned
      if (task.assignedToId && task.assignedToId !== employeeId) {
        await this.notificationService.notifyTaskAssigned(
          task.id,
          task.assignedToId,
          employeeId
        );
      }

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create task'
      });
    }
  };

  getTasks = async (req: Request, res: Response) => {
    try {
      const validatedQuery = TaskQueryDto.parse(req.query);
      const { employeeId, companyId } = req.user as any;

      const result = await this.taskService.getTasks(
        validatedQuery,
        employeeId,
        companyId
      );

      res.json({
        success: true,
        data: result.tasks,
        pagination: result.pagination
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch tasks'
      });
    }
  };

  getTaskById = async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const { employeeId, companyId } = req.user as any;

      const task = await this.taskService.getTaskById(
        taskId,
        employeeId,
        companyId
      );

      res.json({
        success: true,
        data: task
      });
    } catch (error: any) {
      const statusCode = error.message === 'Task not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch task'
      });
    }
  };

  updateTask = async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const validatedData = UpdateEnhancedTaskDto.parse(req.body);
      const { employeeId, companyId } = req.user as any;

      // Get current task status for notification
      const currentTask = await prisma.task.findUnique({
        where: { id: taskId },
        select: { status: true, assignedToId: true }
      });

      const task = await this.taskService.updateTask(
        taskId,
        validatedData,
        employeeId,
        companyId
      );

      // Send notifications for status changes
      if (validatedData.status && currentTask && validatedData.status !== currentTask.status) {
        await this.notificationService.notifyTaskStatusChanged(
          taskId,
          currentTask.status,
          validatedData.status,
          employeeId
        );
      }

      // Send notification if task is reassigned
      if (validatedData.assignedToId && 
          currentTask?.assignedToId !== validatedData.assignedToId &&
          validatedData.assignedToId !== employeeId) {
        await this.notificationService.notifyTaskAssigned(
          taskId,
          validatedData.assignedToId,
          employeeId
        );
      }

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error: any) {
      const statusCode = error.message === 'Task not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update task'
      });
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const { employeeId, companyId } = req.user as any;

      await this.taskService.deleteTask(
        taskId,
        employeeId,
        companyId
      );

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error: any) {
      const statusCode = error.message === 'Task not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete task'
      });
    }
  };

  getMyTasks = async (req: Request, res: Response) => {
    try {
      const { employeeId, companyId } = req.user as any;
      const { status } = req.query;

      const tasks = await this.taskService.getMyTasks(
        employeeId,
        companyId,
        status as string
      );

      res.json({
        success: true,
        data: tasks
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch your tasks'
      });
    }
  };

  getTaskStats = async (req: Request, res: Response) => {
    try {
      const { employeeId, companyId } = req.user as any;

      const stats = await this.taskService.getTaskStats(
        employeeId,
        companyId
      );

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch task statistics'
      });
    }
  };

  // Task Dependencies
  createTaskDependency = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateTaskDependencyDto.parse(req.body);
      const { employeeId } = req.user as any;

      const dependency = await this.taskService.createTaskDependency(
        validatedData,
        employeeId
      );

      res.status(201).json({
        success: true,
        message: 'Task dependency created successfully',
        data: dependency
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create task dependency'
      });
    }
  };

  // Time Tracking
  createTimeEntry = async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const validatedData = CreateTaskTimeEntryDto.parse(req.body);
      const { employeeId } = req.user as any;

      const timeEntry = await this.taskService.createTimeEntry(
        taskId,
        validatedData,
        employeeId
      );

      res.status(201).json({
        success: true,
        message: 'Time entry created successfully',
        data: timeEntry
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create time entry'
      });
    }
  };

  updateTimeEntry = async (req: Request, res: Response) => {
    try {
      const timeEntryId = parseInt(req.params.timeEntryId);
      const validatedData = UpdateTaskTimeEntryDto.parse(req.body);
      const { employeeId } = req.user as any;

      const timeEntry = await prisma.taskTimeEntry.update({
        where: { 
          id: timeEntryId,
          employeeId // Ensure user can only update their own time entries
        },
        data: {
          ...validatedData,
          endTime: validatedData.endTime ? new Date(validatedData.endTime) : undefined
        },
        include: {
          employee: {
            select: { id: true, name: true }
          },
          task: {
            select: { id: true, title: true }
          }
        }
      });

      res.json({
        success: true,
        message: 'Time entry updated successfully',
        data: timeEntry
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update time entry'
      });
    }
  };

  // Task Comments
  addTaskComment = async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const validatedData = CreateTaskCommentDto.parse(req.body);
      const { employeeId } = req.user as any;

      const comment = await prisma.taskComment.create({
        data: {
          content: validatedData.content,
          taskId,
          authorId: employeeId
        },
        include: {
          author: {
            select: { id: true, name: true, designation: true }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: comment
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to add comment'
      });
    }
  };

  // Calendar View
  getCalendarView = async (req: Request, res: Response) => {
    try {
      const validatedQuery = TaskCalendarViewDto.parse(req.query);
      const { employeeId, companyId } = req.user as any;

      const calendarData = await this.taskService.getCalendarView(
        validatedQuery,
        employeeId,
        companyId
      );

      res.json({
        success: true,
        data: calendarData
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch calendar view'
      });
    }
  };

  // Bulk Operations
  bulkUpdateTasks = async (req: Request, res: Response) => {
    try {
      const { taskIds, updates } = req.body;
      const { employeeId, companyId } = req.user as any;

      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Task IDs array is required'
        });
      }

      const validatedUpdates = UpdateEnhancedTaskDto.parse(updates);

      // Check permissions for all tasks
      const tasks = await prisma.task.findMany({
        where: {
          id: { in: taskIds },
          project: { companyId }
        },
        select: { id: true, projectId: true, status: true }
      });

      if (tasks.length !== taskIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some tasks not found'
        });
      }

      // Update tasks in transaction
      const updatedTasks = await prisma.$transaction(
        tasks.map(task => 
          prisma.task.update({
            where: { id: task.id },
            data: validatedUpdates,
            include: {
              assignedTo: {
                select: { id: true, name: true }
              },
              project: {
                select: { id: true, name: true }
              }
            }
          })
        )
      );

      // Send notifications for status changes
      if (validatedUpdates.status) {
        for (const task of tasks) {
          if (task.status !== validatedUpdates.status) {
            await this.notificationService.notifyTaskStatusChanged(
              task.id,
              task.status,
              validatedUpdates.status,
              employeeId
            );
          }
        }
      }

      res.json({
        success: true,
        message: `${updatedTasks.length} tasks updated successfully`,
        data: updatedTasks
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to bulk update tasks'
      });
    }
  };
}