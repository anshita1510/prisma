import { Router } from 'express';
import { employeeController } from '../controller/employee.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

// All routes require authentication with company context
router.use(authenticateToken);

// SPECIFIC ROUTES FIRST (before generic routes)

// Get all users (Admin, Super Admin) - MUST be before GET /
router.get(
  '/users/all',
  authorizeRoles(['SUPER_ADMIN', 'ADMIN']),
  employeeController.getAllUsers
);

// Get manager's team members (Manager) - MUST be before GET /
router.get(
  '/team/members',
  authorizeRoles(['MANAGER']),
  employeeController.getManagerTeamMembers
);

// Get unassigned employees (Manager) - MUST be before GET /
router.get(
  '/team/unassigned',
  authorizeRoles(['MANAGER']),
  employeeController.getUnassignedEmployees
);

// Get employee statistics (must be before /:employeeId)
router.get(
  '/:employeeId/stats',
  employeeController.getEmployeeStats
);

// GENERIC ROUTES AFTER SPECIFIC ROUTES

// Create new employee (Admin, Super Admin)
router.post(
  '/',
  authorizeRoles(['SUPER_ADMIN', 'ADMIN']),
  employeeController.createEmployee
);

// Get all employees (Admin, Manager, Super Admin)
router.get(
  '/',
  authorizeRoles(['SUPER_ADMIN', 'ADMIN', 'MANAGER']),
  employeeController.getAllEmployees
);

// Assign employee to manager (Manager)
router.post(
  '/team/assign/:employeeId',
  authorizeRoles(['MANAGER']),
  employeeController.assignEmployeeToManager
);

// Get employee by ID
router.get(
  '/:employeeId',
  employeeController.getEmployeeById
);

// Update employee (Admin, Super Admin)
router.put(
  '/:employeeId',
  authorizeRoles(['SUPER_ADMIN', 'ADMIN']),
  employeeController.updateEmployee
);

// Delete employee (Admin, Super Admin)
router.delete(
  '/:employeeId',
  authorizeRoles(['SUPER_ADMIN', 'ADMIN']),
  employeeController.deleteEmployee
);

export default router;
