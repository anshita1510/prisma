// Backend/src/modules/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Role, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import '../types/express'; // Import express type extensions

const prisma = new PrismaClient();

interface JwtPayload {
  id: number;
  email: string;
  role: Role;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtPayload;

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Enhanced auth middleware that includes employee and company info
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtPayload;

    // Get user with employee and company info
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            designation: true,
            companyId: true,
            departmentId: true,
            isActive: true
          }
        },
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Get companyId from employee or user record
    const companyId = user.employee?.companyId || user.companyId;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company information not found for user'
      });
    }

    // Attach enhanced user info to request
    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      employeeId: user.employee?.id,
      companyId: companyId,
      designation: user.employee?.designation,
      isActive: user.employee?.isActive || user.isActive,
      departmentId: user.employee?.departmentId
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Role-based middleware
export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    next();
  };
};