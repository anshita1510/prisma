import { Router } from 'express';
import { enhancedProjectController } from '../../controller/project/enhancedProject.controller';
import { projectController } from '../../controller/project/project.controller';
import { authenticateToken } from '../../../middlewares/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Enhanced Project Management Routes
router.post('/enhanced', enhancedProjectController.createEnhancedProject);
router.get('/enhanced/:projectId', enhancedProjectController.getEnhancedProject);
router.get('/enhanced/:projectId/analytics', enhancedProjectController.getProjectAnalytics);

// Enhanced Team Management Routes
router.get('/team-members/available', enhancedProjectController.getAvailableTeamMembers);
router.post('/:projectId/team-members/bulk-assign', enhancedProjectController.bulkAssignTeamMembers);

// Standard Project Management Routes (existing functionality)
router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProject);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);

// Team Member Management Routes
router.post('/:projectId/team-members', projectController.assignTeamMember);
router.get('/:projectId/team-members', projectController.getProjectTeamMembers);
router.put('/:projectId/team-members/:employeeId', projectController.updateTeamMemberRole);
router.delete('/:projectId/team-members/:employeeId', projectController.removeTeamMember);

// Task Management Routes
router.post('/:projectId/tasks', projectController.createTask);
router.get('/:projectId/tasks', projectController.getProjectTasks);
router.put('/tasks/:taskId', projectController.updateTask);
router.delete('/tasks/:taskId', projectController.deleteTask);

// Utility Routes
router.get('/available-employees', enhancedProjectController.getAvailableTeamMembers);
router.get('/permissions', projectController.checkPermissions);
router.get('/permissions/:projectId', projectController.checkPermissions);

export default router;