import { PrismaClient } from '@prisma/client';
import { TaskRepository } from '../repository/task.repository';
import { CreateTaskDtoType, UpdateTaskDtoType, TaskQueryDtoType, CreateTaskCommentDtoType } from '../dto/task.dto';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor(private prisma: PrismaClient) {
    this.taskRepository = new TaskRepository(prisma);
  }

  async createTask(data: CreateTaskDtoType, createdById: number, companyId: number) {
    // Verify project exists and user has access
    const project = await this.prisma.project.findFirst({
      where: { 
        id: data.projectId, 
        companyId,
        OR: [
          { ownerId: createdById },
          { members: { some: { id: createdById } } }
        ]
      }
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    // Verify assignee if provided
    if (data.assignedToId) {
      const assignee = await this.prisma.employee.findFirst({
        where: { 
          id: data.assignedToId,
          companyId,
          OR: [
            { id: project.ownerId },
            { memberProjects: { some: { id: project.id } } }
          ]
        }
      });

      if (!assignee) {
        throw new Error('Assignee must be project owner or member');
      }
    }

    return this.taskRepository.create({
      ...data,
      createdById
    });
  }

  async getTasks(query: TaskQueryDtoType, companyId: number | null, employeeId: number, isManager: boolean) {
    return this.taskRepository.findMany({
      ...query,
      companyId,
      employeeId,
      isManager
    });
  }

  async getTaskById(id: number, companyId: number, employeeId: number, isManager: boolean) {
    const task = await this.taskRepository.findById(id, companyId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Check access for non-managers
    if (!isManager) {
      const hasAccess = await this.taskRepository.checkTaskAccess(id, employeeId, companyId);
      
      if (!hasAccess) {
        throw new Error('Access denied');
      }
    }

    return task;
  }

  async updateTask(id: number, data: UpdateTaskDtoType, companyId: number, employeeId: number, isManager: boolean) {
    const task = await this.taskRepository.findById(id, companyId);

    if (!task) {
      throw new Error('Task not found');
    }

    // Check access for non-managers
    if (!isManager) {
      const hasAccess = await this.taskRepository.checkTaskAccess(id, employeeId, companyId);
      
      if (!hasAccess) {
        throw new Error('Access denied');
      }

      // Non-managers can only update their own assigned tasks or tasks they created
      if (task.assignedTo?.id !== employeeId && task.createdBy.id !== employeeId) {
        throw new Error('You can only update tasks assigned to you or created by you');
      }
    }

    // Verify assignee if provided
    if (data.assignedToId) {
      const assignee = await this.prisma.employee.findFirst({
        where: { 
          id: data.assignedToId,
          companyId,
          OR: [
            { id: task.project.ownerId },
            { memberProjects: { some: { id: task.projectId } } }
          ]
        }
      });

      if (!assignee) {
        throw new Error('Assignee must be project owner or member');
      }
    }

    return this.taskRepository.update(id, { ...data, companyId });
  }

  async deleteTask(id: number, companyId: number, employeeId: number, isManager: boolean) {
    const task = await this.taskRepository.findById(id, companyId);

    if (!task) {
      throw new Error('Task not found');
    }

    // Only task creator, project owner, or managers can delete
    if (!isManager && task.createdBy.id !== employeeId && task.project.ownerId !== employeeId) {
      throw new Error('Access denied');
    }

    return this.taskRepository.delete(id, companyId);
  }

  async addTaskComment(taskId: number, data: CreateTaskCommentDtoType, authorId: number, companyId: number) {
    // Verify task exists and user has access
    const hasAccess = await this.taskRepository.checkTaskAccess(taskId, authorId, companyId);
    
    if (!hasAccess) {
      throw new Error('Task not found or access denied');
    }

    return this.taskRepository.addComment(taskId, {
      ...data,
      authorId,
      companyId
    });
  }

  async getMyTasks(employeeId: number, companyId: number, status?: string) {
    return this.taskRepository.getMyTasks(employeeId, companyId, status);
  }

  async getTaskStats(companyId: number | null, employeeId?: number, isManager?: boolean) {
    const where: any = {
      isActive: true
    };

    // Only filter by company if companyId is provided (not for Super Admins)
    if (companyId) {
      where.project = { companyId };
    }

    // If not a manager, only count tasks from accessible projects
    if (!isManager && employeeId && companyId) {
      where.project = {
        companyId,
        OR: [
          { ownerId: employeeId },
          { members: { some: { id: employeeId } } }
        ]
      };
    }

    const [total, todo, inProgress, inReview, completed] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.count({ where: { ...where, status: 'TODO' } }),
      this.prisma.task.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      this.prisma.task.count({ where: { ...where, status: 'IN_REVIEW' } }),
      this.prisma.task.count({ where: { ...where, status: 'COMPLETED' } })
    ]);

    return {
      total,
      todo,
      inProgress,
      inReview,
      completed,
      cancelled: total - todo - inProgress - inReview - completed
    };
  }
}