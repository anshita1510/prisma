import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EnhancedProjectService } from '../services/enhanced-project.service';
import { NotificationService } from '../services/notification.service';
import { 
  CreateEnhancedProjectDto, 
  UpdateEnhancedProjectDto, 
  ProjectQueryDto,
  CreateMilestoneDto,
  UpdateMilestoneDto
} from '../dto/enhanced-project.dto';

const prisma = new PrismaClient();

export class EnhancedProjectController {
  private projectService: EnhancedProjectService;
  private notificationService: NotificationService;

  constructor() {
    this.projectService = new EnhancedProjectService(prisma);
    this.notificationService = new NotificationService(prisma);
  }

  createProject = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateEnhancedProjectDto.parse(req.body);
      const { employeeId, companyId } = req.user as any;

      const project = await this.projectService.createProject(
        validatedData,
        employeeId,
        companyId
      );

      // Send notifications to project members
      await this.notificationService.notifyProjectCreated(project.id, employeeId);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create project'
      });
    }
  };

  getProjects = async (req: Request, res: Response) => {
    try {
      const validatedQuery = ProjectQueryDto.parse(req.query);
      const { employeeId, companyId } = req.user as any;

      const result = await this.projectService.getProjects(
        validatedQuery,
        employeeId,
        companyId
      );

      res.json({
        success: true,
        data: result.projects,
        pagination: result.pagination
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch projects'
      });
    }
  };

  getProjectById = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const { employeeId, companyId } = req.user as any;

      const project = await this.projectService.getProjectById(
        projectId,
        employeeId,
        companyId
      );

      res.json({
        success: true,
        data: project
      });
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch project'
      });
    }
  };

  updateProject = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const validatedData = UpdateEnhancedProjectDto.parse(req.body);
      const { employeeId, companyId } = req.user as any;

      const project = await this.projectService.updateProject(
        projectId,
        validatedData,
        employeeId,
        companyId
      );

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update project'
      });
    }
  };

  deleteProject = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const { employeeId, companyId } = req.user as any;

      await this.projectService.deleteProject(
        projectId,
        employeeId,
        companyId
      );

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete project'
      });
    }
  };

  getProjectStats = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const { employeeId } = req.user as any;

      const stats = await this.projectService.getProjectStats(projectId, employeeId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      const statusCode = error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch project statistics'
      });
    }
  };

  // Milestone management
  createMilestone = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateMilestoneDto.parse(req.body);
      const { employeeId } = req.user as any;

      const milestone = await this.projectService.createMilestone(
        validatedData,
        employeeId
      );

      res.status(201).json({
        success: true,
        message: 'Milestone created successfully',
        data: milestone
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create milestone'
      });
    }
  };

  updateMilestone = async (req: Request, res: Response) => {
    try {
      const milestoneId = parseInt(req.params.milestoneId);
      const validatedData = UpdateMilestoneDto.parse(req.body);
      const { employeeId } = req.user as any;

      const milestone = await this.projectService.updateMilestone(
        milestoneId,
        validatedData,
        employeeId
      );

      res.json({
        success: true,
        message: 'Milestone updated successfully',
        data: milestone
      });
    } catch (error: any) {
      const statusCode = error.message === 'Milestone not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update milestone'
      });
    }
  };

  // Project templates (future enhancement)
  getProjectTemplates = async (req: Request, res: Response) => {
    try {
      const templates = await prisma.projectTemplate.findMany({
        where: { isActive: true },
        include: {
          createdBy: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: templates
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch project templates'
      });
    }
  };

  // Gantt chart data
  getGanttData = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const { employeeId, companyId } = req.user as any;

      // Get project with tasks and dependencies for Gantt chart
      const project = await this.projectService.getProjectById(
        projectId,
        employeeId,
        companyId
      );

      // Transform data for Gantt chart format
      const ganttData = {
        project: {
          id: project.id,
          name: project.name,
          startDate: project.startDate,
          endDate: project.endDate
        },
        tasks: project.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          startDate: task.startDate,
          dueDate: task.dueDate,
          progress: task.progressPercentage,
          assignee: task.assignedTo?.name,
          milestone: task.milestone?.name,
          dependencies: task.dependencies?.map((dep: any) => dep.predecessorTaskId) || []
        })),
        milestones: project.milestones.map(milestone => ({
          id: milestone.id,
          name: milestone.name,
          dueDate: milestone.dueDate,
          isCompleted: milestone.isCompleted
        }))
      };

      res.json({
        success: true,
        data: ganttData
      });
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch Gantt chart data'
      });
    }
  };
}