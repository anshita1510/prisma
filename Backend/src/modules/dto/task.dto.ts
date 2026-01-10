import { z } from 'zod';

export const TaskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']);
export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const CreateTaskDto = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  projectId: z.number().int().positive(),
  assignedToId: z.number().int().positive().optional(),
  priority: TaskPriorityEnum.optional().default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  estimatedHours: z.number().int().positive().optional()
});

export const UpdateTaskDto = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  assignedToId: z.number().int().positive().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  estimatedHours: z.number().int().positive().optional(),
  actualHours: z.number().int().positive().optional(),
  isActive: z.boolean().optional()
});

export const TaskQueryDto = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional().default(1),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional().default(10),
  projectId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  assignedToId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  isActive: z.string().transform(val => val === 'true').optional()
});

export const CreateTaskCommentDto = z.object({
  content: z.string().min(1, 'Comment content is required')
});

export type CreateTaskDtoType = z.infer<typeof CreateTaskDto>;
export type UpdateTaskDtoType = z.infer<typeof UpdateTaskDto>;
export type TaskQueryDtoType = z.infer<typeof TaskQueryDto>;
export type CreateTaskCommentDtoType = z.infer<typeof CreateTaskCommentDto>;