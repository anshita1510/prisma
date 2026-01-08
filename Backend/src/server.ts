import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/routes/auth/auth.routes';
import leaveRoutes from './modules/routes/leave/leave.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/leaves', leaveRoutes);

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

// Error handling
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong!'
//   });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});