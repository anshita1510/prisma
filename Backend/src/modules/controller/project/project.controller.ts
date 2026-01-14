import { Request, Response } from 'express';
import { projectService } from '../../services/projectService';
import { $Enums } from '@prisma/client';
import { CreateProjectUsecase } from '../../usecase/project/createProject.usecase';
import { AuthorizationUtil, UserContext } from '../../../shared/utils/authorization.util';

// Type aliases for easier use
type ProjectStatus = $Enums.ProjectStatus;
type ProjectRole = $Enums.ProjectRole;
type TaskStatus = $Enums.TaskStatus;
type TaskPriority = $Enums.TaskPriority;

class ProjectController {
  // Helper method to extract user context
  private extractUserContext = (req: Request): UserContext | null => {
    if (!req.user) {
      return null;
    }

    return {
      id: req.user.id,
      employeeId: req.user.employeeId,
      role: req.user.role,
      designation: req.user.designation,
      isActive: req.user.isActive || true,
      companyId: req.user.companyId,
      departmentId: req.user.departmentId
    };
  }

  // Enhanced Project Creation with Authorization
  createProject = async (req: Request, res: Response) => {
    try {
      // Extract user context from authenticated request
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      // Check authorization
      const canCreate = await AuthorizationUtil.canCreateProject(userContext);
      if (!canCreate) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to create projects',
          error: 'PERMISSION_DENIED',
          requiredPermissions: ['project:create'],
          userRole: userContext.role,
          userDesignation: userContext.designation
        });
      }

      // Prepare request data
      const {
        name,
        description,
        code,
        companyId,
        departmentId,
        startDate,
        endDate,
        budget,
        status,
        teamMembers
      } = req.body;

      const createProjectRequest = {
        name,
        description,
        code,
        companyId: parseInt(companyId) || userContext.companyId || 2,
        departmentId: parseInt(departmentId) || userContext.departmentId || 2,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget: budget ? parseFloat(budget) : undefined,
        status: status as ProjectStatus || 'PLANNING',
        teamMembers: teamMembers || []
      };

      // Execute use case
      const createProjectUsecase = new CreateProjectUsecase();
      const result = await createProjectUsecase.execute(createProjectRequest, userContext);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          data: result.data,
          meta: {
            createdBy: userContext.id,
            createdAt: new Date().toISOString(),
            permissions: await AuthorizationUtil.getUserPermissions(userContext, {
              projectId: result.data.id
            })
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          errors: result.errors,
          validationFailed: true
        });
      }
    } catch (error: any) {
      console.error('Error in createProject controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message || 'Unknown error occurred'
      });
    }
  }

  // Enhanced Project Update with Authorization
  updateProject = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      // Check authorization for project update
      const canUpdate = await AuthorizationUtil.hasPermission(
        'project:update',
        userContext,
        { projectId: parseInt(projectId) }
      );

      if (!canUpdate) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to update this project',
          error: 'PERMISSION_DENIED'
        });
      }

      const updateData = req.body;

      // Convert date strings to Date objects
      if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
      if (updateData.budget) updateData.budget = parseFloat(updateData.budget);
      if (updateData.progressPercentage) updateData.progressPercentage = parseInt(updateData.progressPercentage);

      const project = await projectService.updateProject(
        parseInt(projectId),
        updateData,
        req
      );

      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project,
        meta: {
          updatedBy: userContext.id,
          updatedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update project'
      });
    }
  }

  getProject = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      // Check view permission
      const canView = await AuthorizationUtil.hasPermission(
        'project:view',
        userContext,
        { projectId: parseInt(projectId) }
      );

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to view this project',
          error: 'PERMISSION_DENIED'
        });
      }

      const project = await projectService.getProjectById(parseInt(projectId));

      // Get user permissions for this project
      const userPermissions = await AuthorizationUtil.getUserPermissions(
        userContext,
        { projectId: parseInt(projectId) }
      );

      res.status(200).json({
        success: true,
        data: project,
        meta: {
          userPermissions,
          canEdit: userPermissions.includes('project:update'),
          canDelete: userPermissions.includes('project:delete'),
          canManageTeam: userPermissions.includes('project:assign_members')
        }
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Project not found'
      });
    }
  }

  getAllProjects = async (req: Request, res: Response) => {
    try {
      const { companyId, departmentId, ownerId } = req.query;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      const projects = await projectService.getAllProjects(
        companyId ? parseInt(companyId as string) : userContext.companyId,
        departmentId ? parseInt(departmentId as string) : undefined,
        ownerId ? parseInt(ownerId as string) : undefined
      );

      // Filter projects based on user permissions
      const accessibleProjects = [];
      for (const project of projects) {
        const canView = await AuthorizationUtil.hasPermission(
          'project:view',
          userContext,
          { projectId: project.id }
        );
        if (canView) {
          accessibleProjects.push(project);
        }
      }

      res.status(200).json({
        success: true,
        data: accessibleProjects,
        meta: {
          total: accessibleProjects.length,
          filtered: projects.length - accessibleProjects.length,
          userRole: userContext.role
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch projects'
      });
    }
  }

  deleteProject = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      // Check delete permission
      const canDelete = await AuthorizationUtil.hasPermission(
        'project:delete',
        userContext,
        { projectId: parseInt(projectId) }
      );

      if (!canDelete) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to delete this project',
          error: 'PERMISSION_DENIED'
        });
      }

      const project = await projectService.deleteProject(parseInt(projectId), req);

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
        data: project,
        meta: {
          deletedBy: userContext.id,
          deletedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete project'
      });
    }
  }

  // Team Member Management Endpoints with Authorization
  assignTeamMember = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const { employeeId, role } = req.body;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      if (!employeeId || !role) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID and role are required'
        });
      }

      // Check permission to assign team members
      const canAssign = await AuthorizationUtil.hasPermission(
        'project:assign_members',
        userContext,
        { projectId: parseInt(projectId) }
      );

      if (!canAssign) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to assign team members',
          error: 'PERMISSION_DENIED'
        });
      }

      const projectMember = await projectService.assignTeamMember({
        projectId: parseInt(projectId),
        employeeId: parseInt(employeeId),
        role: role as ProjectRole
      }, req);

      res.status(201).json({
        success: true,
        message: 'Team member assigned successfully',
        data: projectMember,
        meta: {
          assignedBy: userContext.id,
          assignedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to assign team member'
      });
    }
  }

  removeTeamMember = async (req: Request, res: Response) => {
    try {
      const { projectId, employeeId } = req.params;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      // Check permission to remove team members
      const canRemove = await AuthorizationUtil.hasPermission(
        'project:remove_members',
        userContext,
        { projectId: parseInt(projectId) }
      );

      if (!canRemove) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to remove team members',
          error: 'PERMISSION_DENIED'
        });
      }

      const projectMember = await projectService.removeTeamMember(
        parseInt(projectId),
        parseInt(employeeId),
        req
      );

      res.status(200).json({
        success: true,
        message: 'Team member removed successfully',
        data: projectMember,
        meta: {
          removedBy: userContext.id,
          removedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to remove team member'
      });
    }
  }

  updateTeamMemberRole = async (req: Request, res: Response) => {
    try {
      const { projectId, employeeId } = req.params;
      const { role } = req.body;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'Role is required'
        });
      }

      // Check permission to manage team members
      const canManage = await AuthorizationUtil.hasPermission(
        'project:assign_members',
        userContext,
        { projectId: parseInt(projectId) }
      );

      if (!canManage) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to update team member roles',
          error: 'PERMISSION_DENIED'
        });
      }

      const projectMember = await projectService.updateTeamMemberRole(
        parseInt(projectId),
        parseInt(employeeId),
        role as ProjectRole,
        req
      );

      res.status(200).json({
        success: true,
        message: 'Team member role updated successfully',
        data: projectMember,
        meta: {
          updatedBy: userContext.id,
          updatedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update team member role'
      });
    }
  }

  getProjectTeamMembers = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      // Check view permission
      const canView = await AuthorizationUtil.hasPermission(
        'project:view',
        userContext,
        { projectId: parseInt(projectId) }
      );

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to view team members',
          error: 'PERMISSION_DENIED'
        });
      }

      const teamMembers = await projectService.getProjectTeamMembers(parseInt(projectId));

      res.status(200).json({
        success: true,
        data: teamMembers
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch team members'
      });
    }
  }

  // Task Management Endpoints (keeping existing functionality)
  createTask = async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        code,
        projectId,
        assignedToId,
        createdById,
        status,
        priority,
        dueDate,
        startDate,
        estimatedHours,
        milestoneId,
        parentTaskId
      } = req.body;

      // Get createdById from authenticated user if not provided
      const finalCreatedById = createdById || req.user?.employeeId;

      if (!title || !projectId || !finalCreatedById) {
        return res.status(400).json({
          success: false,
          message: 'Title and project ID are required. User must be authenticated.'
        });
      }

      const task = await projectService.createTask({
        title,
        description,
        code,
        projectId: parseInt(projectId),
        assignedToId: assignedToId ? parseInt(assignedToId) : undefined,
        createdById: parseInt(finalCreatedById.toString()),
        status: status as TaskStatus,
        priority: priority as TaskPriority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        estimatedHours: estimatedHours ? parseInt(estimatedHours) : undefined,
        milestoneId: milestoneId ? parseInt(milestoneId) : undefined,
        parentTaskId: parentTaskId ? parseInt(parentTaskId) : undefined
      }, req);

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
  }

  updateTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const updateData = req.body;

      // Convert data types
      if (updateData.assignedToId) updateData.assignedToId = parseInt(updateData.assignedToId);
      if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);
      if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
      if (updateData.estimatedHours) updateData.estimatedHours = parseInt(updateData.estimatedHours);
      if (updateData.actualHours) updateData.actualHours = parseInt(updateData.actualHours);
      if (updateData.progressPercentage) updateData.progressPercentage = parseInt(updateData.progressPercentage);

      const task = await projectService.updateTask(
        parseInt(taskId),
        updateData,
        req
      );

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update task'
      });
    }
  }

  getProjectTasks = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const { status, assignedToId } = req.query;

      const tasks = await projectService.getProjectTasks(
        parseInt(projectId),
        status as TaskStatus,
        assignedToId ? parseInt(assignedToId as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch tasks'
      });
    }
  }

  deleteTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;

      const task = await projectService.deleteTask(parseInt(taskId), req);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: task
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete task'
      });
    }
  }

  // Dashboard and Analytics Endpoints
  getDashboardStats = async (req: Request, res: Response) => {
    try {
      const { companyId, departmentId } = req.query;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      const stats = await projectService.getProjectDashboardStats(
        companyId ? parseInt(companyId as string) : userContext.companyId,
        departmentId ? parseInt(departmentId as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch dashboard stats'
      });
    }
  }

  // Utility Endpoints
  getAvailableEmployees = async (req: Request, res: Response) => {
    try {
      const { companyId, departmentId } = req.query;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      const finalCompanyId = companyId ? parseInt(companyId as string) : userContext.companyId;
      
      if (!finalCompanyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID is required'
        });
      }

      const employees = await AuthorizationUtil.getAssignableUsers(
        finalCompanyId,
        departmentId ? parseInt(departmentId as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: employees
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch available employees'
      });
    }
  }

  // Permission Check Endpoint
  checkPermissions = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      const resourceContext = projectId ? { projectId: parseInt(projectId) } : undefined;
      const permissions = await AuthorizationUtil.getUserPermissions(userContext, resourceContext);

      res.status(200).json({
        success: true,
        data: {
          permissions,
          userRole: userContext.role,
          userDesignation: userContext.designation,
          canCreateProject: permissions.includes('project:create'),
          canUpdateProject: permissions.includes('project:update'),
          canDeleteProject: permissions.includes('project:delete'),
          canManageTeam: permissions.includes('project:assign_members')
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to check permissions'
      });
    }
  }
}

export const projectController = new ProjectController();