import { PrismaClient, ProjectStatus, ProjectRole } from '@prisma/client';
import { AuthorizationUtil, UserContext } from '../../../shared/utils/authorization.util';

const prisma = new PrismaClient();

export interface EnhancedCreateProjectRequest {
    name: string;
    description?: string;
    code?: string;
    companyId: number;
    departmentId: number;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    status?: ProjectStatus;
    isPublic?: boolean;
    teamMembers?: {
        employeeId: number;
        role: ProjectRole;
        permissions?: string[];
    }[];
    milestones?: {
        name: string;
        description?: string;
        dueDate: Date;
    }[];
    tags?: string[];
    priority?: string;
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
     * Execute enhanced project creation with team assignment and milestones
     */
    async execute(
        request: EnhancedCreateProjectRequest,
        creator: UserContext
    ): Promise<EnhancedCreateProjectResponse> {
        const warnings: string[] = [];

        try {
            // Step 1: Authorization Check
            const canCreate = await AuthorizationUtil.canCreateProject(creator);
            if (!canCreate) {
                return {
                    success: false,
                    message: 'Insufficient permissions to create projects',
                    errors: ['User does not have project creation permissions']
                };
            }

            // Step 2: Input Validation
            const validationResult = await this.validateInput(request, creator);
            if (!validationResult.isValid) {
                return {
                    success: false,
                    message: 'Validation failed',
                    errors: validationResult.errors,
                    warnings: validationResult.warnings
                };
            }
            warnings.push(...validationResult.warnings);

            // Step 3: Business Logic Validation
            const businessValidation = await this.validateBusinessRules(request, creator);
            if (!businessValidation.isValid) {
                return {
                    success: false,
                    message: 'Business rule validation failed',
                    errors: businessValidation.errors,
                    warnings: businessValidation.warnings
                };
            }
            warnings.push(...businessValidation.warnings);

            // Step 4: Create Project with Team & Milestones in Transaction
            const result = await this.createProjectWithExtras(request, creator);

            // Step 5: Get permissions for the created project
            const permissions = await AuthorizationUtil.getUserPermissions(creator, {
                projectId: result.project.id
            });

            // Step 6: Audit Log
            await this.createAuditLog(result.project.id, creator, 'PROJECT_CREATED');

            return {
                success: true,
                data: {
                    project: result.project,
                    teamMembers: result.teamMembers,
                    milestones: result.milestones,
                    permissions
                },
                message: 'Project created successfully',
                warnings: warnings.length > 0 ? warnings : undefined
            };

        } catch (error: any) {
            console.error('Error in EnhancedCreateProjectUsecase:', error);
            return {
                success: false,
                message: 'Failed to create project',
                errors: [error.message || 'Unknown error occurred']
            };
        }
    }

    /**
     * Validate input data
     */
    private async validateInput(
        request: EnhancedCreateProjectRequest,
        creator: UserContext
    ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (!request.name?.trim()) {
            errors.push('Project name is required');
        }

        if (!request.companyId) {
            errors.push('Company ID is required');
        }

        if (!request.departmentId) {
            errors.push('Department ID is required');
        }

        if (!creator.employeeId) {
            errors.push('Creator must have an employee record');
        }

        if (request.name && request.name.length > 255) {
            errors.push('Project name must be less than 255 characters');
        }

        if (request.description && request.description.length > 2000) {
            errors.push('Project description must be less than 2000 characters');
        }

        if (request.startDate && request.endDate) {
            if (request.startDate >= request.endDate) {
                errors.push('End date must be after start date');
            }
        }

        if (request.budget !== undefined && request.budget < 0) {
            errors.push('Budget must be a positive number');
        }

        // Team members validation
        if (request.teamMembers && request.teamMembers.length > 0) {
            const employeeIds = request.teamMembers.map(tm => tm.employeeId);
            const uniqueIds = new Set(employeeIds);
            if (employeeIds.length !== uniqueIds.size) {
                errors.push('Duplicate team members are not allowed');
            }

            const validRoles: ProjectRole[] = ['OWNER', 'MANAGER', 'MEMBER', 'VIEWER'];
            for (const member of request.teamMembers) {
                if (!validRoles.includes(member.role)) {
                    errors.push(`Invalid role: ${member.role}`);
                }
            }

            if (request.teamMembers.length > 50) {
                warnings.push('Large team detected (>50 members). Consider splitting into sub-teams.');
            }
        }

        // Milestones validation
        if (request.milestones && request.milestones.length > 0) {
            for (const milestone of request.milestones) {
                if (!milestone.name?.trim()) {
                    errors.push('Milestone name is required');
                }
                if (!milestone.dueDate) {
                    errors.push(`Milestone "${milestone.name}" must have a due date`);
                }
            }
        }

        return { isValid: errors.length === 0, errors, warnings };
    }

    /**
     * Validate business rules
     */
    private async validateBusinessRules(
        request: EnhancedCreateProjectRequest,
        creator: UserContext
    ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
        const errors: string[] = [];
        const warnings: string[] = [];

        try {
            // Check unique project name within company
            if (request.name) {
                const existingProject = await prisma.project.findFirst({
                    where: {
                        name: request.name,
                        companyId: request.companyId,
                        isActive: true
                    }
                });

                if (existingProject) {
                    errors.push('Project name already exists in this company');
                }
            }

            // Check unique project code
            if (request.code) {
                const existingCode = await prisma.project.findFirst({
                    where: {
                        code: request.code,
                        companyId: request.companyId,
                        isActive: true
                    }
                });

                if (existingCode) {
                    errors.push('Project code already exists in this company');
                }
            }

            // Validate company exists and is active
            const company = await prisma.company.findUnique({
                where: { id: request.companyId }
            });

            if (!company || !company.isActive) {
                errors.push('Invalid or inactive company');
            }

            // Validate department exists
            const department = await prisma.department.findUnique({
                where: { id: request.departmentId }
            });

            if (!department) {
                errors.push('Invalid department');
            }

            // Validate creator's company access
            if (creator.companyId && creator.companyId !== request.companyId) {
                errors.push('Cannot create project in different company');
            }

            // Validate team members exist and are active
            if (request.teamMembers && request.teamMembers.length > 0) {
                const employeeIds = request.teamMembers.map(tm => tm.employeeId);
                const employees = await prisma.employee.findMany({
                    where: {
                        id: { in: employeeIds },
                        companyId: request.companyId,
                        isActive: true
                    },
                    include: {
                        user: { select: { isActive: true } }
                    }
                });

                const validEmployeeIds = employees
                    .filter(emp => emp.user.isActive)
                    .map(emp => emp.id);

                const invalidIds = employeeIds.filter(id => !validEmployeeIds.includes(id));
                if (invalidIds.length > 0) {
                    warnings.push(`Some team members could not be validated: ${invalidIds.join(', ')}`);
                }
            }

        } catch (error: any) {
            console.error('Error in business rule validation:', error);
            errors.push('Failed to validate business rules');
        }

        return { isValid: errors.length === 0, errors, warnings };
    }

    /**
     * Create project with team members and milestones in a transaction
     */
    private async createProjectWithExtras(
        request: EnhancedCreateProjectRequest,
        creator: UserContext
    ): Promise<{ project: any; teamMembers: any[]; milestones: any[] }> {
        return await prisma.$transaction(async (tx) => {
            // Generate project code if not provided
            let projectCode = request.code;
            if (!projectCode) {
                const timestamp = Date.now().toString().slice(-6);
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                projectCode = `PRJ${timestamp}${random}`;

                let attempts = 0;
                while (attempts < 5) {
                    const existingCode = await tx.project.findFirst({
                        where: { code: projectCode }
                    });

                    if (!existingCode) break;

                    const newRandom = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                    projectCode = `PRJ${timestamp}${newRandom}`;
                    attempts++;
                }

                if (attempts >= 5) {
                    throw new Error('Failed to generate unique project code after multiple attempts');
                }
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
                    status: request.status || 'PLANNING',
                    startDate: request.startDate,
                    endDate: request.endDate,
                    budget: request.budget,
                    progressPercentage: 0,
                    isActive: true
                },
                include: {
                    owner: {
                        select: { id: true, name: true, employeeCode: true, designation: true }
                    },
                    department: {
                        select: { name: true, type: true }
                    },
                    company: {
                        select: { name: true, code: true }
                    }
                }
            });

            // Assign creator as project owner
            await tx.projectMember.create({
                data: {
                    projectId: project.id,
                    employeeId: creator.employeeId!,
                    role: 'OWNER',
                    isActive: true
                }
            });

            // Assign additional team members
            const assignedMembers: any[] = [];
            if (request.teamMembers && request.teamMembers.length > 0) {
                const teamMemberData = request.teamMembers
                    .filter(tm => tm.employeeId !== creator.employeeId)
                    .map(tm => ({
                        projectId: project.id,
                        employeeId: tm.employeeId,
                        role: tm.role,
                        isActive: true
                    }));

                if (teamMemberData.length > 0) {
                    await tx.projectMember.createMany({ data: teamMemberData });

                    // Fetch assigned members for response
                    const members = await tx.projectMember.findMany({
                        where: { projectId: project.id, isActive: true },
                        include: {
                            employee: {
                                select: { id: true, name: true, employeeCode: true, designation: true }
                            }
                        }
                    });
                    assignedMembers.push(...members);
                }
            }

            // Create milestones
            const createdMilestones: any[] = [];
            if (request.milestones && request.milestones.length > 0) {
                for (const milestone of request.milestones) {
                    const created = await tx.milestone.create({
                        data: {
                            name: milestone.name,
                            description: milestone.description,
                            projectId: project.id,
                            dueDate: milestone.dueDate,
                            isCompleted: false
                        }
                    });
                    createdMilestones.push(created);
                }
            }

            return {
                project,
                teamMembers: assignedMembers,
                milestones: createdMilestones
            };
        });
    }

    /**
     * Create audit log entry
     */
    private async createAuditLog(
        projectId: number,
        creator: UserContext,
        action: string
    ): Promise<void> {
        try {
            console.log(`Audit Log: ${action} - Project ${projectId} by User ${creator.id}`);
        } catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }
}
