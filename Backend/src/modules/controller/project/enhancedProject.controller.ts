import { Request, Response } from 'express';
import { ProjectStatus, ProjectRole } from '@prisma/client';
import { EnhancedCreateProjectUsecase, EnhancedCreateProjectRequest } from '../../usecase/project/enhancedCreateProject.usecase';
import { AuthorizationUtil, UserContext } from '../../../shared/utils/authorization.util';

export class EnhancedProjectController {

  /**
   * Extract user context from authenticated request
   */
  private extractUserContext = (req: Request): UserContext | null => {
    if (!req.user) {
      return null;
    }

    return {
      id: req.user.id,
      employeeId: req.user.employeeId,
      role: req.user.role,
      designation: req.user.designation ?? undefined,  // ✅ converts null → undefined
      isActive: req.user.isActive || true,
      companyId: req.user.companyId,
      departmentId: req.user.departmentId
    };
  }

  /**
   * Enhanced Project Creation with Dynamic Team Assignment
   */
  createEnhancedProject = async (req: Request, res: Response) => {
    try {
      console.log('🚀 Enhanced project creation request received');

      // Extract and validate user context
      const userContext = this.extractUserContext(req);
      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED',
          code: 'AUTH_001'
        });
      }

      // Extract and validate request data
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
        isPublic,
        teamMembers,
        milestones,
        tags,
        priority,
        category
      } = req.body;

      // Validate required fields
      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Project name is required',
          error: 'VALIDATION_ERROR',
          code: 'VAL_001'
        });
      }

      // Prepare enhanced request object
      const enhancedRequest: EnhancedCreateProjectRequest = {
        name: name.trim(),
        description: description?.trim(),
        code: code?.trim(),
        companyId: parseInt(companyId) || userContext.companyId || 2,
        departmentId: parseInt(departmentId) || userContext.departmentId || 2,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget: budget ? parseFloat(budget) : undefined,
        status: status as ProjectStatus || 'PLANNING',
        isPublic: Boolean(isPublic),
        teamMembers: this.processTeamMembers(teamMembers),
        milestones: this.processMilestones(milestones),
        tags: Array.isArray(tags) ? tags : [],
        priority: priority || 'MEDIUM',
        category: category?.trim()
      };

      console.log('📋 Processing enhanced project request:', {
        name: enhancedRequest.name,
        teamMembersCount: enhancedRequest.teamMembers?.length || 0,
        milestonesCount: enhancedRequest.milestones?.length || 0,
        companyId: enhancedRequest.companyId,
        departmentId: enhancedRequest.departmentId
      });

      // Execute enhanced use case
      const createProjectUsecase = new EnhancedCreateProjectUsecase();
      const result = await createProjectUsecase.execute(enhancedRequest, userContext);

      // Handle response based on result
      if (result.success) {
        console.log('✅ Enhanced project created successfully:', result.data?.project.id);

        res.status(201).json({
          success: true,
          message: result.message,
          data: {
            project: result.data?.project,
            teamMembers: result.data?.teamMembers,
            milestones: result.data?.milestones,
            permissions: result.data?.permissions,
            stats: {
              totalTeamMembers: result.data?.teamMembers.length || 0,
              totalMilestones: result.data?.milestones.length || 0,
              createdAt: new Date().toISOString()
            }
          },
          meta: {
            createdBy: {
              id: userContext.id,
              employeeId: userContext.employeeId,
              role: userContext.role,
              designation: userContext.designation
            },
            warnings: result.warnings,
            version: '2.0',
            enhanced: true
          }
        });
      } else {
        console.log('❌ Enhanced project creation failed:', result.message);

        res.status(400).json({
          success: false,
          message: result.message,
          errors: result.errors,
          warnings: result.warnings,
          validationFailed: true,
          meta: {
            requestedBy: userContext.id,
            timestamp: new Date().toISOString()
          }
        });
      }

    } catch (error: any) {
      console.error('💥 Error in enhanced project creation:', error);

      res.status(500).json({
        success: false,
        message: 'Internal server error during project creation',
        error: error.message || 'Unknown error occurred',
        code: 'SRV_001',
        meta: {
          timestamp: new Date().toISOString(),
          enhanced: true
        }
      });
    }
  }

  /**
   * Get Enhanced Project Details with Permissions
   */
  getEnhancedProject = async (req: Request, res: Response) => {
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
          error: 'PERMISSION_DENIED',
          code: 'PERM_001'
        });
      }

      // Get project with enhanced details
      const project = await this.getProjectWithEnhancedDetails(parseInt(projectId));

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
          capabilities: {
            canEdit: userPermissions.includes('project:update'),
            canDelete: userPermissions.includes('project:delete'),
            canManageTeam: userPermissions.includes('project:assign_members'),
            canManageBudget: userPermissions.includes('project:manage_budget'),
            canChangeStatus: userPermissions.includes('project:change_status')
          },
          viewedBy: userContext.id,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('Error in getEnhancedProject:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project details',
        error: error.message
      });
    }
  }

  /**
   * Get Available Team Members with Enhanced Filtering
   */
  getAvailableTeamMembers = async (req: Request, res: Response) => {
    try {
      const { companyId, departmentId, role, skills, availability } = req.query;
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

      // Get available employees with enhanced filtering
      const employees = await AuthorizationUtil.getAssignableUsers(
        finalCompanyId,
        departmentId ? parseInt(departmentId as string) : undefined
      );

      // Apply additional filters
      let filteredEmployees = employees;

      if (role) {
        filteredEmployees = filteredEmployees.filter(emp =>
          emp.user.role === role || emp.designation === role
        );
      }

      // Add enhanced employee information
      const enhancedEmployees = filteredEmployees.map(emp => ({
        ...emp,
        capabilities: {
          canBeProjectManager: this.canBeProjectManager(emp),
          canBeTeamLead: this.canBeTeamLead(emp),
          recommendedRoles: this.getRecommendedRoles(emp)
        },
        availability: {
          status: 'available', // This would come from a real availability system
          currentProjects: 0, // This would be calculated from actual data
          workload: 'normal'
        }
      }));

      res.status(200).json({
        success: true,
        data: enhancedEmployees,
        meta: {
          total: enhancedEmployees.length,
          filtered: employees.length - enhancedEmployees.length,
          filters: {
            companyId: finalCompanyId,
            departmentId: departmentId ? parseInt(departmentId as string) : null,
            role: role || null
          }
        }
      });

    } catch (error: any) {
      console.error('Error in getAvailableTeamMembers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch available team members',
        error: error.message
      });
    }
  }

  /**
   * Bulk Team Member Assignment
   */
  bulkAssignTeamMembers = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const { teamMembers } = req.body;
      const userContext = this.extractUserContext(req);

      if (!userContext) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'UNAUTHORIZED'
        });
      }

      if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Team members array is required'
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

      // Process bulk assignment
      const results = await this.processBulkTeamAssignment(
        parseInt(projectId),
        teamMembers,
        userContext
      );

      res.status(200).json({
        success: true,
        message: 'Bulk team assignment completed',
        data: results,
        meta: {
          assignedBy: userContext.id,
          timestamp: new Date().toISOString(),
          totalProcessed: teamMembers.length,
          successful: results.successful.length,
          failed: results.failed.length
        }
      });

    } catch (error: any) {
      console.error('Error in bulkAssignTeamMembers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process bulk team assignment',
        error: error.message
      });
    }
  }

  /**
   * Get Project Analytics and Insights
   */
  getProjectAnalytics = async (req: Request, res: Response) => {
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
          message: 'Insufficient permissions to view project analytics',
          error: 'PERMISSION_DENIED'
        });
      }

      const analytics = await this.calculateProjectAnalytics(parseInt(projectId));

      res.status(200).json({
        success: true,
        data: analytics,
        meta: {
          generatedBy: userContext.id,
          timestamp: new Date().toISOString(),
          projectId: parseInt(projectId)
        }
      });

    } catch (error: any) {
      console.error('Error in getProjectAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate project analytics',
        error: error.message
      });
    }
  }

  // Helper Methods

  private processTeamMembers(teamMembers: any[]): any[] {
    if (!Array.isArray(teamMembers)) return [];

    return teamMembers.map(member => ({
      employeeId: parseInt(member.employeeId),
      role: member.role as ProjectRole,
      permissions: member.permissions || []
    }));
  }

  private processMilestones(milestones: any[]): any[] {
    if (!Array.isArray(milestones)) return [];

    return milestones.map(milestone => ({
      name: milestone.name,
      description: milestone.description,
      dueDate: new Date(milestone.dueDate)
    }));
  }

  private canBeProjectManager(employee: any): boolean {
    const managerRoles = ['ADMIN', 'MANAGER'];
    const managerDesignations = ['MANAGER', 'TECH_LEAD', 'SENIOR_ENGINEER'];

    return (
      managerRoles.includes(employee.user.role) ||
      managerDesignations.includes(employee.designation)
    );
  }

  private canBeTeamLead(employee: any): boolean {
    const leadDesignations = ['TECH_LEAD', 'SENIOR_ENGINEER', 'MANAGER'];
    return leadDesignations.includes(employee.designation);
  }

  private getRecommendedRoles(employee: any): ProjectRole[] {
    const roles: ProjectRole[] = [];

    if (this.canBeProjectManager(employee)) {
      roles.push('MANAGER');
    }

    if (this.canBeTeamLead(employee)) {
      roles.push('MEMBER');
    } else {
      roles.push('VIEWER', 'MEMBER');
    }

    return roles;
  }

  private async getProjectWithEnhancedDetails(projectId: number): Promise<any> {
    // This would be implemented with enhanced project fetching logic
    // For now, return a placeholder
    return {
      id: projectId,
      enhanced: true,
      // ... other project details
    };
  }

  private async processBulkTeamAssignment(
    projectId: number,
    teamMembers: any[],
    userContext: UserContext
  ): Promise<any> {
    const successful: any[] = [];
    const failed: any[] = [];

    // Process each team member assignment
    for (const member of teamMembers) {
      try {
        // Individual assignment logic would go here
        successful.push({
          employeeId: member.employeeId,
          role: member.role,
          status: 'assigned'
        });
      } catch (error: any) {
        failed.push({
          employeeId: member.employeeId,
          error: error.message
        });
      }
    }

    return { successful, failed };
  }

  private async calculateProjectAnalytics(projectId: number): Promise<any> {
    // This would calculate real project analytics
    return {
      projectId,
      analytics: {
        teamPerformance: {},
        progressMetrics: {},
        budgetAnalysis: {},
        timelineAnalysis: {}
      }
    };
  }
}

export const enhancedProjectController = new EnhancedProjectController();