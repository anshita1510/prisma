import { z } from 'zod';

export const ProjectStatusEnum = z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']);
export const ProjectRoleEnum = z.enum(['OWNER', 'MANAGER', 'MEMBER', 'VIEWER']);

export const CreateEnhancedProjectDto = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  code: z.string().optional(),
  departmentId: z.number().int().positive(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  memberIds: z.array(z.number().int().positive()).optional().default([]),
  memberRoles: z.array(z.object({
    employeeId: z.number().int().positive(),
    role: ProjectRoleEnum
  })).optional().default([])
});

export const UpdateEnhancedProjectDto = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  departmentId: z.number().int().positive().optional(),
  status: ProjectStatusEnum.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  actualCost: z.number().positive().optional(),
  progressPercentage: z.number().int().min(0).max(100).optional(),
  memberIds: z.array(z.number().int().positive()).optional(),
  memberRoles: z.array(z.object({
    employeeId: z.number().int().positive(),
    role: ProjectRoleEnum
  })).optional(),
  isActive: z.boolean().optional()
});

export const ProjectQueryDto = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default(1),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional().default(10),
  departmentId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  ownerId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  status: ProjectStatusEnum.optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
  search: z.string().optional()
});

export const CreateMilestoneDto = z.object({
  name: z.string().min(1, 'Milestone name is required'),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  projectId: z.number().int().positive()
});

export const UpdateMilestoneDto = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  isCompleted: z.boolean().optional()
});

export const ProjectMemberRoleDto = z.object({
  employeeId: z.number().int().positive(),
  role: ProjectRoleEnum
});

export type CreateEnhancedProjectDtoType = z.infer<typeof CreateEnhancedProjectDto>;
export type UpdateEnhancedProjectDtoType = z.infer<typeof UpdateEnhancedProjectDto>;
export type ProjectQueryDtoType = z.infer<typeof ProjectQueryDto>;
export type CreateMilestoneDtoType = z.infer<typeof CreateMilestoneDto>;
export type UpdateMilestoneDtoType = z.infer<typeof UpdateMilestoneDto>;
export type ProjectMemberRoleDtoType = z.infer<typeof ProjectMemberRoleDto>;