import { PrismaClient, ProjectStatus, ProjectRole, Role, Designation } from '@prisma/client';
import { AuthorizationUtil, UserContext } from '../../../shared/utils/authorization.util';

const prisma = new PrismaClient();

export interface TeamMemberAssignment {
  employeeId: number;
  role: ProjectRole;
  permissions?: string[];
}

export interface ProjectMilestone {
  name: string;
  description?: string;
  dueDate: Date;
}

export interface EnhancedCreateProjectRequest {
  // Basic Project Information
  name: string;
  description?: string;
  code?: string;
  
  // Organization Context
  companyId: number;
  departmentId: number;
  
  // Timeline & Budget
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  
  // Project Configuration
  status?: ProjectStatus;
  isPublic?: boolean; // Whether project is visible to all company members
  
  // Dynamic Team Assignment
  teamMembers?: TeamMemberAssignment[];
  
  // Project Structure
  milestones?: ProjectMilestone[];
  
  // Metadata
  tags?: string[];
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
}

export interface EnhancedCreateProjectResponse {
  success: boolean;
  data?: {
    project: any;
    teamMembers: any[];
    milestones: any[];
    permissions: string[];
  };
  message: string;
  errors?: string[];
  warnings?: string[];
}

export class EnhancedCreateProjectUsecase {
  /**
   * Execute enhanced project creation with comprehensive validation and dynamic assignment
   */
  async execute(
    request: EnhancedCreateProjectRequest, 
    creator: UserContext
  ): Promise<EnhancedCreateProjectResponse> {
    try {
      console.log('🚀 Starting enhanced project creation...');
      
      // Step 1: Pre-flight Authorization Check
      const authResult = await this.performAuthorizationCheck(creator);
      if (!authResult.success) {
        return authResult;
      }

      // Step 2: Comprehensive Input Validation
      const validationResult = await this.performComprehensiveValidation(request, creator);
      if (!validationResult.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validationResult.errors,
          warnings: validationResult.warnings
        };
      }

      // Step 3: Business Logic & Conflict Resolution
      const businessValidation = await this.performBusinessValidation(request, creator);
      if (!businessValidation.isValid) {
        return {
          success: false,
          message: 'Business rule validation failed',
          errors: businessValidation.errors
        };
      }

      // Step 4: Dynamic Team Member Validation
      const teamValidation = await this.validateTeamMembers(request.teamMembers || [], creator);
      if (!teamValidation.isValid) {
        return {
          success: false,
          message: 'Team member validation failed',
          errors: teamValidation.errors
        };
      }

      // Step 5: Execute Project Creation Transaction
      const result = await this.executeProjectCreation(request, creator, teamValidation.validatedMembers);

      // Step 6: Post-creation Setup
      await this.performPostCreationSetup(result.project.id, creator);

      console.log('✅ Enhanced project creation completed successfully');
      
      return {
        success: true,
        data: result,
        message: 'Project created successfully with enhanced features',
        warnings: validationResult.warnings
      };

    } catch (error: any) {
      console.error('❌ Error in EnhancedCreateProjectUsecase:', error);
      return {
        success: false,
        message: 'Failed to create project',
        errors: [error.message || 'Unknown error occurred']
      };
    }
  }

  /**
   * Perform comprehensive authorization check
   */
  private async performAuthorizationCheck(creator: UserContext): Promise<any> {
    // Check basic project creation permission
    const canCreate = await AuthorizationUtil.canCreateProject(creator);
    if (!canCreate) {
      return {
        success: false,
        message: 'Insufficient permissions to create projects',
        errors: [
          'User does not have project creation permissions',
          `Current role: ${creator.role}`,
          `Current designation: ${creator.designation || 'Not specified'}`,
          'Required: ADMIN/MANAGER role OR MANAGER/TECH_LEAD designation'
        ]
      };
    }

    // Additional authorization checks
    if (!creator.isActive) {
      return {
        success: false,
        message: 'Account is not active',
        errors: ['User account must be active to create projects']
      };
    }

    if (!creator.employeeId) {
      return {
        success: false,
        message: 'Employee record required',
        errors: ['User must have an associated employee record']
      };
    }

    return { success: true };
  }

  /**
   * Perform comprehensive input validation
   */
  private async performComprehensiveValidation(
    request: EnhancedCreateProjectRequest, 
    creator: UserContext
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!request.name?.trim()) {
      errors.push('Project name is required');
    } else if (request.name.length < 3) {
      errors.push('Project name must be at least 3 characters long');
    } else if (request.name.length > 255) {
      errors.push('Project name must be less than 255 characters');
    }

    if (!request.companyId) {
      errors.push('Company ID is required');
    }

    if (!request.departmentId) {
      errors.push('Department ID is required');
    }

    // Optional field validation
    if (request.description && request.description.length > 2000) {
      errors.push('Project description must be less than 2000 characters');
    }

    if (request.code && (request.code.length < 2 || request.code.length > 20)) {
      errors.push('Project code must be between 2 and 20 characters');
    }

    // Date validation with business logic
    if (request.startDate && request.endDate) {
      if (request.startDate >= request.endDate) {
        errors.push('End date must be after start date');
      }
      
      const daysDifference = Math.ceil((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDifference < 1) {
        errors.push('Project duration must be at least 1 day');
      } else if (daysDifference > 1095) { // 3 years
        warnings.push('Project duration exceeds 3 years - consider breaking into phases');
      }
    }

    if (request.startDate && request.startDate < new Date()) {
      warnings.push('Project start date is in the past');
    }

    // Budget validation
    if (request.budget !== undefined) {
      if (request.budget < 0) {
        errors.push('Budget must be a positive number');
      } else if (request.budget > 10000000) { // 10M limit
        warnings.push('Budget exceeds 10 million - requires additional approval');
      }
    }

    // Team members validation
    if (request.teamMembers) {
      const employeeIds = request.teamMembers.map(tm => tm.employeeId);
      const uniqueIds = new Set(employeeIds);
      
      if (employeeIds.length !== uniqueIds.size) {
        errors.push('Duplicate team members are not allowed');
      }

      if (request.teamMembers.length > 50) {
        warnings.push('Large team size (>50 members) may impact project management efficiency');
      }

      // Validate roles
      const validRoles = Object.values(ProjectRole);
      for (const member of request.teamMembers) {
        if (!validRoles.includes(member.role)) {
          errors.push(`Invalid project role: ${member.role}`);
        }
      }

      // Check for multiple owners
      const ownerCount = request.teamMembers.filter(tm => tm.role === ProjectRole.OWNER).length;
      if (ownerCount > 1) {
        errors.push('Only one project owner is allowed');
      }
    }

    // Milestone validation
    if (request.milestones) {
      for (const milestone of request.milestones) {
        if (!milestone.name?.trim()) {
          errors.push('Milestone name is required');
        }
        
        if (milestone.dueDate && request.endDate && milestone.dueDate > request.endDate) {
          errors.push(`Milestone "${milestone.name}" due date cannot be after project end date`);
        }
      }
    }

    // Tags validation
    if (request.tags) {
      if (request.tags.length > 10) {
        warnings.push('Consider limiting tags to 10 or fewer for better organization');
      }
      
      for (const tag of request.tags) {
        if (tag.length > 50) {
          errors.push('Tag names must be 50 characters or less');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Perform business rule validation
   */
  private async performBusinessValidation(
    request: EnhancedCreateProjectRequest, 
    creator: UserContext
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Check project name uniqueness within company
      if (request.name) {
        const existingProject = await prisma.project.findFirst({
          where: {
            name: request.name,
            companyId: request.companyId,
            isActive: true
          }
        });

        if (existingProject) {
          errors.push(`Project name "${request.name}" already exists in this company`);
        }
      }

      // Check project code uniqueness (if provided)
      if (request.code) {
        const existingCode = await prisma.project.findFirst({
          where: {
            code: request.code,
            companyId: request.companyId,
            isActive: true
          }
        });

        if (existingCode) {
          errors.push(`Project code "${request.code}" already exists in this company`);
        }
      }

      // Validate company exists and is active
      const company = await prisma.company.findUnique({
        where: { id: request.companyId },
        select: { id: true, isActive: true, name: true }
      });

      if (!company) {
        errors.push('Company not found');
      } else if (!company.isActive) {
        errors.push('Cannot create projects in inactive company');
      }

      // Validate department exists and belongs to company
      const department = await prisma.department.findUnique({
        where: { id: request.departmentId },
        select: { id: true, companyId: true, name: true }
      });

      if (!department) {
        errors.push('Department not found');
      } else if (department.companyId !== request.companyId) {
        errors.push('Department does not belong to the specified company');
      }

      // Validate creator has access to company/department
      if (creator.companyId && creator.companyId !== request.companyId) {
        errors.push('Cannot create project in different company');
      }

      // Check department capacity (business rule example)
      const departmentProjectCount = await prisma.project.count({
        where: {
          departmentId: request.departmentId,
          isActive: true,
          status: { in: ['PLANNING', 'ACTIVE'] }
        }
      });

      if (departmentProjectCount >= 20) { // Example limit
        errors.push('Department has reached maximum active project limit (20)');
      }

    } catch (error: any) {
      console.error('Error in business rule validation:', error);
      errors.push('Failed to validate business rules');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate team members and their permissions
   */
  private async validateTeamMembers(
    teamMembers: TeamMemberAssignment[], 
    creator: UserContext
  ): Promise<{ isValid: boolean; errors: string[]; validatedMembers: any[] }> {
    const errors: string[] = [];
    const validatedMembers: any[] = [];

    if (teamMembers.length === 0) {
      return { isValid: true, errors: [], validatedMembers: [] };
    }

    try {
      const employeeIds = teamMembers.map(tm => tm.employeeId);
      
      // Fetch all employees in one query
      const employees = await prisma.employee.findMany({
        where: {
          id: { in: employeeIds },
          companyId: creator.companyId,
          isActive: true
        },
        include: {
          user: {
            select: {
              id: true,
              isActive: true,
              status: true,
              role: true
            }
          },
          department: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      // Validate each team member
      for (const teamMember of teamMembers) {
        const employee = employees.find(emp => emp.id === teamMember.employeeId);
        
        if (!employee) {
          errors.push(`Employee with ID ${teamMember.employeeId} not found or inactive`);
          continue;
        }

        if (!employee.user.isActive || employee.user.status !== 'ACTIVE') {
          errors.push(`Employee ${employee.name} is not active`);
          continue;
        }

        // Role-specific validation
        if (teamMember.role === ProjectRole.OWNER && employee.id !== creator.employeeId) {
          // Only allow creator to be owner, or specific high-level roles to assign ownership
          const allowedOwnerAssignmentRoles: Role[] = [Role.ADMIN, Role.SUPER_ADMIN];
          if (!allowedOwnerAssignmentRoles.includes(creator.role)) {
            errors.push(`Only project creator or admin can be assigned as owner`);
            continue;
          }
        }

        if (teamMember.role === ProjectRole.MANAGER) {
          // Validate manager role assignment
          const canBeManager = await this.canBeProjectManager(employee, creator);
          if (!canBeManager) {
            errors.push(`Employee ${employee.name} cannot be assigned as project manager`);
            continue;
          }
        }

        validatedMembers.push({
          ...teamMember,
          employee: {
            id: employee.id,
            name: employee.name,
            employeeCode: employee.employeeCode,
            designation: employee.designation,
            departmentId: employee.departmentId,
            user: employee.user
          }
        });
      }

    } catch (error: any) {
      console.error('Error validating team members:', error);
      errors.push('Failed to validate team members');
    }

    return {
      isValid: errors.length === 0,
      errors,
      validatedMembers
    };
  }

  /**
   * Check if employee can be assigned as project manager
   */
  private async canBeProjectManager(employee: any, creator: UserContext): Promise<boolean> {
    // Business rules for project manager assignment
    const managerRoles = [Role.ADMIN, Role.MANAGER];
    const managerDesignations = [Designation.MANAGER, Designation.TECH_LEAD, Designation.SENIOR_ENGINEER];

    return (
      managerRoles.includes(employee.user.role) ||
      managerDesignations.includes(employee.designation)
    );
  }

  /**
   * Execute the project creation transaction
   */
  private async executeProjectCreation(
    request: EnhancedCreateProjectRequest,
    creator: UserContext,
    validatedMembers: any[]
  ): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      // Generate project code if not provided
      let projectCode = request.code;
      if (!projectCode) {
        const projectCount = await tx.project.count({
          where: { companyId: request.companyId }
        });
        projectCode = `PRJ${String(projectCount + 1).padStart(4, '0')}`;
      }

      // Create the project
      const project = await tx.project.create({
        data: {
          name: request.name,
          description: request.description,
          code: projectCode,
          companyId: request.companyId,
          departmentId: request.departmentId,
          ownerId: creator.employeeId!,
          status: request.status || ProjectStatus.PLANNING,
          startDate: request.startDate,
          endDate: request.endDate,
          budget: request.budget,
          progressPercentage: 0,
          isActive: true
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
              designation: true
            }
          },
          department: {
            select: {
              name: true,
              type: true
            }
          },
          company: {
            select: {
              name: true,
              code: true
            }
          }
        }
      });

      // Assign creator as project owner
      const ownerMember = await tx.projectMember.create({
        data: {
          projectId: project.id,
          employeeId: creator.employeeId!,
          role: ProjectRole.OWNER,
          isActive: true
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
              designation: true
            }
          }
        }
      });

      // Assign additional team members
      const teamMembers = [ownerMember];
      
      if (validatedMembers.length > 0) {
        const teamMemberData = validatedMembers
          .filter(tm => tm.employeeId !== creator.employeeId) // Don't duplicate owner
          .map(tm => ({
            projectId: project.id,
            employeeId: tm.employeeId,
            role: tm.role,
            isActive: true
          }));

        if (teamMemberData.length > 0) {
          const createdMembers = await tx.projectMember.createMany({
            data: teamMemberData
          });

          // Fetch the created members with employee details
          const additionalMembers = await tx.projectMember.findMany({
            where: {
              projectId: project.id,
              employeeId: { in: teamMemberData.map(tm => tm.employeeId) }
            },
            include: {
              employee: {
                select: {
                  id: true,
                  name: true,
                  employeeCode: true,
                  designation: true
                }
              }
            }
          });

          teamMembers.push(...additionalMembers);
        }
      }

      // Create milestones if provided
      const milestones = [];
      if (request.milestones && request.milestones.length > 0) {
        for (const milestoneData of request.milestones) {
          const milestone = await tx.milestone.create({
            data: {
              name: milestoneData.name,
              description: milestoneData.description,
              projectId: project.id,
              dueDate: milestoneData.dueDate,
              isCompleted: false
            }
          });
          milestones.push(milestone);
        }
      }

      // Get user permissions for the new project
      const permissions = await AuthorizationUtil.getUserPermissions(
        creator,
        { projectId: project.id }
      );

      return {
        project,
        teamMembers,
        milestones,
        permissions
      };
    });
  }

  /**
   * Perform post-creation setup
   */
  private async performPostCreationSetup(projectId: number, creator: UserContext): Promise<void> {
    try {
      // Create audit log
      console.log(`📝 Audit: Project ${projectId} created by user ${creator.id}`);
      
      // Send notifications (if notification system exists)
      // await this.sendProjectCreationNotifications(projectId, creator);
      
      // Initialize project analytics
      // await this.initializeProjectAnalytics(projectId);
      
      // Create default project structure (folders, templates, etc.)
      // await this.createDefaultProjectStructure(projectId);
      
    } catch (error) {
      console.error('Warning: Post-creation setup failed:', error);
      // Don't fail the main operation for post-creation issues
    }
  }
}