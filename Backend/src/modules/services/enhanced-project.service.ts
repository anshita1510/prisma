import { PrismaClient } from '@prisma/client';
import { PermissionService } from './permission.service';
import { 
  CreateEnhancedProjectDtoType, 
  UpdateEnhancedProjectDtoType, 
  ProjectQueryDtoType,
  CreateMilestoneDtoType,
  UpdateMilestoneDtoType
} from '../dto/enhanced-project.dto';

export class EnhancedProjectService {
  private permissionService: PermissionService;

  constructor(private prisma: PrismaClient) {
    this.permissionService = new PermissionService(prisma);
  }

  async createProject(data: CreateEnhancedProjectDtoType, creatorId: number, companyId: number) {
    // Check if user can create projects
    const creator = await this.prisma.employee.findUnique({
      where: { id: creatorId },
      include: { user: true }
    });

    if (!creator) {
      throw new Error('Creator not found');
    }

    const canManage = this.permissionService.canManageProjects(
      creator.user.role,
      creator.designation
    );

    if (!canManage) {
      throw new Error('Insufficient permissions to create projects');
    }

    // Verify department belongs to company
    const department = await this.prisma.department.findFirst({
      where: { id: data.departmentId, companyId }
    });
    
    if (!department) {
      throw new Error('Department not found');
    }

    // Generate project code if not provided
    const projectCode = data.code || await this.generateProjectCode(companyId);

    // Verify all member IDs belong to the company
    if (data.memberIds?.length) {
      const members = await this.prisma.employee.findMany({
        where: { 
          id: { in: data.memberIds },
          companyId 
        }
      });
      
      if (members.length !== data.memberIds.length) {
        throw new Error('Some members not found in company');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Create project
      const project = await tx.project.create({
        data: {
          name: data.name,
          description: data.description,
          code: projectCode,
          departmentId: data.departmentId,
          ownerId: creatorId,
          companyId,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          budget: data.budget,
          members: data.memberIds?.length ? {
            connect: data.memberIds.map(id => ({ id }))
          } : undefined
        },
        include: {
          owner: {
            select: { id: true, name: true, designation: true }
          },
          department: {
            select: { id: true, name: true }
          },
          members: {
            select: { id: true, name: true, designation: true }
          }
        }
      });

      // Create project member roles
      if (data.memberRoles?.length) {
        await tx.projectMember.createMany({
          data: data.memberRoles.map(mr => ({
            projectId: project.id,
            employeeId: mr.employeeId,
            role: mr.role
          }))
        });
      }

      // Add default members if not specified in roles
      const roleEmployeeIds = data.memberRoles?.map(mr => mr.employeeId) || [];
      const defaultMembers = data.memberIds?.filter(id => !roleEmployeeIds.includes(id)) || [];
      
      if (defaultMembers.length) {
        await tx.projectMember.createMany({
          data: defaultMembers.map(employeeId => ({
            projectId: project.id,
            employeeId,
            role: 'MEMBER'
          }))
        });
      }

      return project;
    });
  }

  async getProjects(query: ProjectQueryDtoType, employeeId: number, companyId: number) {
    const { page, limit, departmentId, ownerId, status, isActive, search } = query;
    const skip = (page - 1) * limit;

    // Get user's accessible projects
    const accessInfo = await this.permissionService.getAccessibleProjects(employeeId);

    const where: any = {
      companyId,
      ...(departmentId && { departmentId }),
      ...(ownerId && { ownerId }),
      ...(status && { status }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    // Apply access restrictions
    if (!accessInfo.canViewAll) {
      where.OR = [
        { ownerId: employeeId },
        { id: { in: accessInfo.projectIds } }
      ];
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: { id: true, name: true, designation: true }
          },
          department: {
            select: { id: true, name: true }
          },
          members: {
            select: { id: true, name: true, designation: true }
          },
          projectRoles: {
            where: { isActive: true },
            include: {
              employee: {
                select: { id: true, name: true, designation: true }
              }
            }
          },
          milestones: {
            select: { id: true, name: true, dueDate: true, isCompleted: true }
          },
          _count: {
            select: { 
              tasks: true,
              milestones: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.project.count({ where })
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProjectById(id: number, employeeId: number, companyId: number) {
    // Check permission
    const hasPermission = await this.permissionService.checkProjectPermission(
      id,
      employeeId,
      'READ'
    );

    if (!hasPermission) {
      throw new Error('Access denied');
    }

    const project = await this.prisma.project.findFirst({
      where: { id, companyId },
      include: {
        owner: {
          select: { id: true, name: true, designation: true }
        },
        department: {
          select: { id: true, name: true }
        },
        members: {
          select: { id: true, name: true, designation: true }
        },
        projectRoles: {
          where: { isActive: true },
          include: {
            employee: {
              select: { id: true, name: true, designation: true }
            }
          }
        },
        milestones: {
          include: {
            tasks: {
              select: { id: true, title: true, status: true }
            }
          },
          orderBy: { dueDate: 'asc' }
        },
        tasks: {
          include: {
            assignedTo: {
              select: { id: true, name: true }
            },
            milestone: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  async updateProject(id: number, data: UpdateEnhancedProjectDtoType, employeeId: number, companyId: number) {
    // Check permission
    const hasPermission = await this.permissionService.checkProjectPermission(
      id,
      employeeId,
      'WRITE'
    );

    if (!hasPermission) {
      throw new Error('Access denied');
    }

    const project = await this.prisma.project.findFirst({
      where: { id, companyId }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Verify department if provided
    if (data.departmentId) {
      const department = await this.prisma.department.findFirst({
        where: { id: data.departmentId, companyId }
      });
      
      if (!department) {
        throw new Error('Department not found');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Update project
      const updatedProject = await tx.project.update({
        where: { id },
        data: {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          ...(data.memberIds && {
            members: {
              set: data.memberIds.map(id => ({ id }))
            }
          })
        },
        include: {
          owner: {
            select: { id: true, name: true, designation: true }
          },
          department: {
            select: { id: true, name: true }
          },
          members: {
            select: { id: true, name: true, designation: true }
          }
        }
      });

      // Update project member roles if provided
      if (data.memberRoles?.length) {
        // Remove existing roles
        await tx.projectMember.updateMany({
          where: { projectId: id },
          data: { isActive: false }
        });

        // Add new roles
        await tx.projectMember.createMany({
          data: data.memberRoles.map(mr => ({
            projectId: id,
            employeeId: mr.employeeId,
            role: mr.role
          }))
        });
      }

      return updatedProject;
    });
  }

  async deleteProject(id: number, employeeId: number, companyId: number) {
    // Check permission (only ADMIN level can delete)
    const hasPermission = await this.permissionService.checkProjectPermission(
      id,
      employeeId,
      'ADMIN'
    );

    if (!hasPermission) {
      throw new Error('Access denied');
    }

    const project = await this.prisma.project.findFirst({
      where: { id, companyId }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return this.prisma.project.delete({
      where: { id }
    });
  }

  async createMilestone(data: CreateMilestoneDtoType, creatorId: number) {
    // Check project permission
    const hasPermission = await this.permissionService.checkProjectPermission(
      data.projectId,
      creatorId,
      'WRITE'
    );

    if (!hasPermission) {
      throw new Error('Access denied');
    }

    return this.prisma.milestone.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate)
      },
      include: {
        project: {
          select: { id: true, name: true }
        }
      }
    });
  }

  async updateMilestone(id: number, data: UpdateMilestoneDtoType, employeeId: number) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!milestone) {
      throw new Error('Milestone not found');
    }

    // Check project permission
    const hasPermission = await this.permissionService.checkProjectPermission(
      milestone.projectId,
      employeeId,
      'WRITE'
    );

    if (!hasPermission) {
      throw new Error('Access denied');
    }

    return this.prisma.milestone.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        completedAt: data.isCompleted ? new Date() : null
      }
    });
  }

  private async generateProjectCode(companyId: number): Promise<string> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { code: true }
    });

    const projectCount = await this.prisma.project.count({
      where: { companyId }
    });

    return `${company?.code || 'PROJ'}-${String(projectCount + 1).padStart(4, '0')}`;
  }

  async getProjectStats(projectId: number, employeeId: number) {
    // Check permission
    const hasPermission = await this.permissionService.checkProjectPermission(
      projectId,
      employeeId,
      'READ'
    );

    if (!hasPermission) {
      throw new Error('Access denied');
    }

    const [taskStats, milestoneStats, completedMilestones, timeStats] = await Promise.all([
      // Task statistics
      this.prisma.task.groupBy({
        by: ['status'],
        where: { projectId, isActive: true },
        _count: { status: true }
      }),
      
      // Milestone statistics
      this.prisma.milestone.aggregate({
        where: { projectId },
        _count: { id: true }
      }),

      // Completed milestones count
      this.prisma.milestone.count({
        where: { projectId, isCompleted: true }
      }),
      
      // Time tracking statistics
      this.prisma.task.aggregate({
        where: { projectId, isActive: true },
        _sum: {
          estimatedHours: true,
          actualHours: true
        }
      })
    ]);

    const taskStatusCounts = taskStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    return {
      tasks: {
        total: Object.values(taskStatusCounts).reduce((sum, count) => sum + count, 0),
        ...taskStatusCounts
      },
      milestones: {
        total: milestoneStats._count?.id || 0,
        completed: completedMilestones
      },
      time: {
        estimatedHours: timeStats._sum.estimatedHours || 0,
        actualHours: timeStats._sum.actualHours || 0
      }
    };
  }
}