import { Router } from 'express';
import { EnhancedProjectController } from '../controller/enhanced-project.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const projectController = new EnhancedProjectController();

// All routes require authentication
router.use(authenticate);

// Project CRUD routes
router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/templates', projectController.getProjectTemplates);
router.get('/stats', projectController.getGlobalProjectStats); // Global stats endpoint
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Project statistics and analytics
router.get('/:id/stats', projectController.getProjectStats);
router.get('/:id/gantt', projectController.getGanttData);

// Milestone management
router.post('/milestones', projectController.createMilestone);
router.put('/milestones/:milestoneId', projectController.updateMilestone);

export default router;