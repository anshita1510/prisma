import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
        email: string;
        employeeId?: number;
        companyId?: number;
        designation?: string;
        isActive?: boolean;
        departmentId?: number;
      };
    }
  }
}

export {};