import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/routes/auth/auth.routes';
import attendanceRoutes from './modules/routes/attendance/attendance.routes';
import projectRoutes from './modules/routes/project.routes';
import taskRoutes from './modules/routes/task.routes';
import enhancedProjectRoutes from './modules/routes/enhanced-project.routes';
import enhancedTaskRoutes from './modules/routes/enhanced-task.routes';
import notificationRoutes from './modules/routes/notification.routes';
import { errorHandler } from './middlewares/validation.middleware';

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

// Enhanced TMS Routes
app.use('/api/v2/projects', enhancedProjectRoutes);
app.use('/api/v2/tasks', enhancedTaskRoutes);
app.use('/api/notifications', notificationRoutes);


// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;