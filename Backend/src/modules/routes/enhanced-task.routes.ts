import { Router } from 'express';
import { EnhancedTaskController } from '../controller/enhanced-task.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();
const taskController = new EnhancedTaskController();

// All routes require authentication
router.use(authenticateToken);

// Task CRUD routes
router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/my-tasks', taskController.getMyTasks);
router.get('/stats', taskController.getTaskStats);
router.get('/calendar', taskController.getCalendarView);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Bulk operations
router.put('/bulk-update', taskController.bulkUpdateTasks);

// Task dependencies
router.post('/dependencies', taskController.createTaskDependency);

// Task comments
router.post('/:id/comments', taskController.addTaskComment);

// Time tracking
router.post('/:id/time-entries', taskController.createTimeEntry);
router.put('/time-entries/:timeEntryId', taskController.updateTimeEntry);

export default router;