import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/routes/auth/auth.routes';
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
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/employees', employeeRoutes);

// Enhanced TMS Routes
app.use('/api/v2/projects', enhancedProjectRoutesV2);
app.use('/api/v2/tasks', enhancedTaskRoutes);
app.use('/api/notifications', notificationRoutes);

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