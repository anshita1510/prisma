import { PrismaClient } from '@prisma/client';
import { PermissionService } from './permission.service';
import { 
  CreateEnhancedTaskDtoType, 
  UpdateEnhancedTaskDtoType, 
  TaskQueryDtoType,
  CreateTaskDependencyDtoType,
  CreateTaskTimeEntryDtoType,
  UpdateTaskTimeEntryDtoType,
  TaskCalendarViewDtoType
} from '../dto/enhanced-task.dto';

export class EnhancedTaskService {
  private permissionService: PermissionService;

  constructor(private prisma: PrismaClient) {
    this.permissionService = new PermissionService(prisma);
  }

  async createTask(data: CreateEnhancedTaskDtoType, creatorId: number, companyId: number) {
    // Check project permission
    const hasPermission = await this.permissionService.checkProjectPermission(
      data.projectId,
      creatorId,
      'WRITE'
    );

    if (!hasPermission) {
      throw new Error('Access denied to project');
    }

    // Verify assignee if provided
    if (data.assignedToId) {
      const canAssign = await this.permissionService.canAssignTaskTo(
        creatorId,
        data.assignedToId,
        data.projectId
      );

      if (!canAssign) {
        throw new Error('Cannot assign task to specified user');
      }
    }

    // Verify parent task if provided
    if (data.parentTaskId) {
      const parentTask = await this.prisma.task.findFirst({
        where: { 
          id: data.parentTaskId,
          projectId: data.projectId,
          isActive: true
        }
      });

      if (!parentTask) {
        throw new Error('Parent task not found in the same project');
      }
    }

    // Generate task code if not provided
    const taskCode = data.code || await this.generateTaskCode(data.projectId);

    return this.prisma.$transaction(async (tx) => {
      // Create task
      const task = await tx.task.create({
        data: {
          title: data.title,
          description: data.description,
          code: taskCode,
          projectId: data.projectId,
          milestoneId: data.milestoneId,
          assignedToId: data.assignedToId,
          parentTaskId: data.parentTaskId,
          createdById: creatorId,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          startDate: data.startDate ? new Date(data.startDate) : null,
          estimatedHours: data.estimatedHours
        },
        include: {
          assignedTo: {
            select: { id: true, name: true, designation: true }
          },
          createdBy: {
            select: { id: true, name: true, designation: true }
          },
          project: {
            select: { id: true, name: true }
          },
          milestone: {
            select: { id: true, name: true }
          },
          parentTask: {
            select: { id: true, title: true }
          }
        }
      });

      // Create dependencies if provided
      if (data.dependencies?.length) {
        await tx.taskDependency.createMany({
          data: data.dependencies.map(dep => ({
            predecessorTaskId: dep.predecessorTaskId,
            dependentTaskId: task.id,
            type: dep.type,
            lag: dep.lag
          }))
        });
      }

      return task;
    });
  }

  async getTasks(query: TaskQueryDtoType, employeeId: number, companyId: number) {
    const { 
      page, 
      limit, 
      projectId, 
      milestoneId, 
      assignedToId, 
      parentTaskId, 
      status, 
      priority, 
      isActive, 
      search,
      dueDateFrom,
      dueDateTo
    } = query;
    const skip = (page - 1) * limit;

    // Get user's accessible projects
    const accessInfo = await this.permissionService.getAccessibleProjects(employeeId);

    const where: any = {
      project: { companyId },
      ...(projectId && { projectId }),
      ...(milestoneId && { milestoneId }),
      ...(assignedToId && { assignedToId }),
      ...(parentTaskId && { parentTaskId }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(dueDateFrom && { dueDate: { gte: new Date(dueDateFrom) } }),
      ...(dueDateTo && { dueDate: { lte: new Date(dueDateTo) } })
    };

    // Apply project access restrictions
    if (!accessInfo.canViewAll) {
      where.project = {
        ...where.project,
        OR: [
          { ownerId: employeeId },
          { id: { in: accessInfo.projectIds } }
        ]
      };
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignedTo: {
            select: { id: true, name: true, designation: true }
          },
          createdBy: {
            select: { id: true, name: true, designation: true }
          },
          project: {
            select: { id: true, name: true }
          },
          milestone: {
            select: { id: true, name: true }
          },
          parentTask: {
            select: { id: true, title: true }
          },
          subTasks: {
            select: { id: true, title: true, status: true }
          },
          dependencies: {
            include: {
              predecessorTask: {
                select: { id: true, title: true, status: true }
              }
            }
          },
          dependents: {
            include: {
              dependentTask: {
                select: { id: true, title: true, status: true }
              }
            }
          },
          _count: {
            select: { 
              comments: true,
              timeEntries: true,
              attachments: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ]
      }),
      this.prisma.task.count({ where })
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getTaskById(id: number, employeeId: number, companyId: number) {
    const task = await this.prisma.task.findFirst({
      where: { 
        id, 
        project: { companyId }
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, designation: true }
        },
        createdBy: {
          select: { id: true, name: true, designation: true }
        },
        project: {
          select: { id: true, name: true, ownerId: true }
        },
        milestone: {
          select: { id: true, name: true, dueDate: true }
        },
        parentTask: {
          select: { id: true, title: true, status: true }
        },
        subTasks: {
          include: {
            assignedTo: {
              select: { id: true, name: true }
            }
          }
        },
        dependencies: {
          include: {
            predecessorTask: {
              select: { id: true, title: true, status: true, completedAt: true }
            }
          }
        },
        dependents: {
          include: {
            dependentTask: {
              select: { id: true, title: true, status: true }
            }
          }
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, designation: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        timeEntries: {
          include: {
            employee: {
              select: { id: true, name: true }
            }
          },
          orderBy: { startTime: 'desc' }
        },
        attachments: {
          include: {
            uploadedBy: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!task) {
      throw new Error('Task not found');
    }

    // Check permission
    const hasPermission = await this.permissionService.checkTaskPermission(
      id,
      employeeId,
      'READ'
    );

    if (!hasPermission) {
      throw new Error('Access denied');
    }

    return task;
  }

  async updateTask(id: number, data: UpdateEnhancedTaskDtoType, employeeId: number, companyId: number) {
    const task = await this.prisma.task.findFirst({
      where: { 
        id, 
        project: { companyId }
      },
      include: { project: true }
    });

    if (!task) {
      throw new Error('Task not found');
    }

    // Check permission
    const hasPermission = await this.permissionService.checkTaskPermission(
      id,
      employeeId,
      'WRITE'
    );

    if (!hasPermission) {
      throw new Error('Access denied');
    }

    // Verify assignee if provided
    if (data.assignedToId) {
      const canAssign = await this.permissionService.canAssignTaskTo(
        employeeId,
        data.assignedToId,
        task.projectId
      );

      if (!canAssign) {
        throw new Error('Cannot assign task to specified user');
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, designation: true }
        },
        createdBy: {
          select: { id: true, name: true, designation: true }
        },
        project: {
          select: { id: true, name: true }
        },
        milestone: {
          select: { id: true, name: true }
        }
      }
    });
  }

  async deleteTask(id: number, employeeId: number, companyId: number) {
    const task = await this.prisma.task.findFirst({
      where: { 
        id, 
        project: { companyId }
      },
      include: { project: true }
    });

    if (!task) {
      throw new Error('Task not found');
    }

    // Check permission (ADMIN level required for deletion)
    const hasPermission = await this.permissionService.checkProjectPermission(
      task.projectId,
      employeeId,
      'ADMIN'
    );

    if (!hasPermission && task.createdById !== employeeId) {
      throw new Error('Access denied');
    }

    return this.prisma.task.delete({
      where: { id }
    });
  }

  async createTaskDependency(data: CreateTaskDependencyDtoType, employeeId: number) {
    // Verify both tasks exist and user has access
    const [predecessorTask, dependentTask] = await Promise.all([
      this.prisma.task.findUnique({
        where: { id: data.predecessorTaskId },
        include: { project: true }
      }),
      this.prisma.task.findUnique({
        where: { id: data.dependentTaskId },
        include: { project: true }
      })
    ]);

    if (!predecessorTask || !dependentTask) {
      throw new Error('One or both tasks not found');
    }

    // Check permissions for both tasks
    const [hasPredecessorPermission, hasDependentPermission] = await Promise.all([
      this.permissionService.checkTaskPermission(data.predecessorTaskId, employeeId, 'READ'),
      this.permissionService.checkTaskPermission(data.dependentTaskId, employeeId, 'WRITE')
    ]);

    if (!hasPredecessorPermission || !hasDependentPermission) {
      throw new Error('Access denied to one or both tasks');
    }

    // Check for circular dependencies
    const hasCircularDependency = await this.checkCircularDependency(
      data.predecessorTaskId,
      data.dependentTaskId
    );

    if (hasCircularDependency) {
      throw new Error('Circular dependency detected');
    }

    return this.prisma.taskDependency.create({
      data,
      include: {
        predecessorTask: {
          select: { id: true, title: true, status: true }
        },
        dependentTask: {
          select: { id: true, title: true, status: true }
        }
      }
    });
  }

  async createTimeEntry(taskId: number, data: CreateTaskTimeEntryDtoType, employeeId: number) {
    // Check task permission
    const hasPermission = await this.permissionService.checkTaskPermission(
      taskId,
      employeeId,
      'WRITE'
    );

    if (!hasPermission) {
      throw new Error('Access denied');
    }

    return this.prisma.taskTimeEntry.create({
      data: {
        ...data,
        taskId,
        employeeId,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null
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
  }

  async getCalendarView(query: TaskCalendarViewDtoType, employeeId: number, companyId: number) {
    const { startDate, endDate, viewType, projectIds, assigneeIds } = query;

    // Get user's accessible projects
    const accessInfo = await this.permissionService.getAccessibleProjects(employeeId);

    const where: any = {
      project: { companyId },
      isActive: true,
      OR: [
        {
          dueDate: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        {
          startDate: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }
      ]
    };

    // Apply project filters
    if (projectIds?.length) {
      where.projectId = { in: projectIds };
    } else if (!accessInfo.canViewAll) {
      where.project = {
        ...where.project,
        OR: [
          { ownerId: employeeId },
          { id: { in: accessInfo.projectIds } }
        ]
      };
    }

    // Apply assignee filters
    if (assigneeIds?.length) {
      where.assignedToId = { in: assigneeIds };
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        },
        milestone: {
          select: { id: true, name: true }
        }
      },
      orderBy: [
        { dueDate: 'asc' },
        { startDate: 'asc' }
      ]
    });

    return {
      tasks,
      viewType,
      dateRange: {
        startDate,
        endDate
      }
    };
  }

  private async generateTaskCode(projectId: number): Promise<string> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { code: true }
    });

    const taskCount = await this.prisma.task.count({
      where: { projectId }
    });

    return `${project?.code || 'TASK'}-${String(taskCount + 1).padStart(4, '0')}`;
  }

  private async checkCircularDependency(predecessorId: number, dependentId: number): Promise<boolean> {
    // Simple check: see if predecessorId depends on dependentId (directly or indirectly)
    const dependencies = await this.prisma.taskDependency.findMany({
      where: { dependentTaskId: predecessorId },
      select: { predecessorTaskId: true }
    });

    if (dependencies.some(dep => dep.predecessorTaskId === dependentId)) {
      return true;
    }

    // Recursive check for indirect dependencies
    for (const dep of dependencies) {
      const hasCircular = await this.checkCircularDependency(dep.predecessorTaskId, dependentId);
      if (hasCircular) return true;
    }

    return false;
  }

  async getMyTasks(employeeId: number, companyId: number, status?: string) {
    return this.prisma.task.findMany({
      where: {
        assignedToId: employeeId,
        project: { companyId },
        ...(status && { status: status as any }),
        isActive: true
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        createdBy: {
          select: { id: true, name: true }
        },
        milestone: {
          select: { id: true, name: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    });
  }

  async getTaskStats(employeeId: number, companyId: number) {
    // Get user's accessible projects
    const accessInfo = await this.permissionService.getAccessibleProjects(employeeId);

    const where: any = {
      project: { companyId },
      isActive: true
    };

    // Apply access restrictions
    if (!accessInfo.canViewAll) {
      where.project = {
        ...where.project,
        OR: [
          { ownerId: employeeId },
          { id: { in: accessInfo.projectIds } }
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