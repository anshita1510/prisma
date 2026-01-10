import { Router } from 'express';
import { ProjectController } from '../controller/project.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();
const projectController = new ProjectController();

// All routes require authentication
router.use(authenticateToken);

// Project CRUD routes
router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Project members
router.get('/:id/members', projectController.getProjectMembers);

export default router;