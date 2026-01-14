import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/routes/auth/auth.routes';
import leaveRoutes from './modules/routes/leave/leave.routes';
import attendanceRoutes from './modules/routes/attendance/attendance.routes';
import projectRoutes from './modules/routes/project.routes';
import taskRoutes from './modules/routes/task.routes';
import enhancedProjectRoutesV2 from './modules/routes/enhanced-project.routes';
import enhancedTaskRoutes from './modules/routes/enhanced-task.routes';
import notificationRoutes from './modules/routes/notification.routes';
import newProjectRoutes from './modules/routes/project/project.routes';
import employeeRoutes from './modules/routes/employee.routes';
import { errorHandler } from './middlewares/validation.middleware';
import { scheduleAutoCheckout } from './cron/autoCheckout.cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/employees', employeeRoutes);

// Enhanced TMS Routes
app.use('/api/v2/projects', enhancedProjectRoutesV2);
app.use('/api/v2/tasks', enhancedTaskRoutes);
app.use('/api/notifications', notificationRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Debug routes to check data
app.get('/api/debug/employees', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const employees = await prisma.employee.findMany({
      include: { user: true, department: true }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.get('/api/debug/users', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isActive: true,
        password: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/debug/departments', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// New Project Management Routes
app.use('/api/project-management', newProjectRoutes);


// Error handling middleware
app.use(errorHandler);

// Initialize cron jobs
scheduleAutoCheckout();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Auto-checkout scheduled for 6:30 PM daily`);
});

export default app;