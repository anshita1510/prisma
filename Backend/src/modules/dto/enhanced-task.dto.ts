import { z } from 'zod';

export const TaskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']);
export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export const TaskDependencyTypeEnum = z.enum(['FINISH_TO_START', 'START_TO_START', 'FINISH_TO_FINISH', 'START_TO_FINISH']);

export const CreateEnhancedTaskDto = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  code: z.string().optional(),
  projectId: z.number().int().positive(),
  milestoneId: z.number().int().positive().optional(),
  assignedToId: z.number().int().positive().optional(),
  parentTaskId: z.number().int().positive().optional(),
  priority: TaskPriorityEnum.optional().default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  estimatedHours: z.number().int().positive().optional(),
  dependencies: z.array(z.object({
    predecessorTaskId: z.number().int().positive(),
    type: TaskDependencyTypeEnum.optional().default('FINISH_TO_START'),
    lag: z.number().int().optional().default(0)
  })).optional().default([])
});

export const UpdateEnhancedTaskDto = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  assignedToId: z.number().int().positive().optional(),
  milestoneId: z.number().int().positive().optional(),
  parentTaskId: z.number().int().positive().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  estimatedHours: z.number().int().positive().optional(),
  actualHours: z.number().int().positive().optional(),
  progressPercentage: z.number().int().min(0).max(100).optional(),
  isActive: z.boolean().optional()
});

export const TaskQueryDto = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default(1),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional().default(10),
  projectId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  milestoneId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  assignedToId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  parentTaskId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
  search: z.string().optional(),
  dueDateFrom: z.string().datetime().optional(),
  dueDateTo: z.string().datetime().optional()
});

export const CreateTaskDependencyDto = z.object({
  predecessorTaskId: z.number().int().positive(),
  dependentTaskId: z.number().int().positive(),
  type: TaskDependencyTypeEnum.optional().default('FINISH_TO_START'),
  lag: z.number().int().optional().default(0)
});

export const CreateTaskTimeEntryDto = z.object({
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  duration: z.number().int().positive().optional() // in minutes
});

export const UpdateTaskTimeEntryDto = z.object({
  description: z.string().optional(),
  endTime: z.string().datetime().optional(),
  duration: z.number().int().positive().optional()
});

export const CreateTaskCommentDto = z.object({
  content: z.string().min(1, 'Comment content is required')
});

export const TaskCalendarViewDto = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  viewType: z.enum(['DAY', 'WEEK', 'MONTH', 'GANTT']).optional().default('WEEK'),
  projectIds: z.array(z.number().int().positive()).optional(),
  assigneeIds: z.array(z.number().int().positive()).optional()
});

export type CreateEnhancedTaskDtoType = z.infer<typeof CreateEnhancedTaskDto>;
export type UpdateEnhancedTaskDtoType = z.infer<typeof UpdateEnhancedTaskDto>;
export type TaskQueryDtoType = z.infer<typeof TaskQueryDto>;
export type CreateTaskDependencyDtoType = z.infer<typeof CreateTaskDependencyDto>;
export type CreateTaskTimeEntryDtoType = z.infer<typeof CreateTaskTimeEntryDto>;
export type UpdateTaskTimeEntryDtoType = z.infer<typeof UpdateTaskTimeEntryDto>;
export type CreateTaskCommentDtoType = z.infer<typeof CreateTaskCommentDto>;
export type TaskCalendarViewDtoType = z.infer<typeof TaskCalendarViewDto>;