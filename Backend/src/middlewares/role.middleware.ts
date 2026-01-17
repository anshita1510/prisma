import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const authorizeRoles = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    console.log("🔍 Role middleware: Checking roles for", req.path);
    console.log("🔍 Role middleware: User", user);
    console.log("🔍 Role middleware: Allowed roles", allowedRoles);

    if (!user) {
      console.log("❌ Role middleware: No user found");
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(user.role)) {
      console.log("❌ Role middleware: User role not allowed", {
        userRole: user.role,
        allowedRoles
      });
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    console.log("✅ Role middleware: Access granted");
    next();
  };
};

export const requireRole = (role: Role) => {
  return authorizeRoles([role]);
};

export const requireAnyRole = (...roles: Role[]) => {
  return authorizeRoles(roles);
};