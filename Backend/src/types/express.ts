import { Role } from '@prisma/client';
import { User as PrismaUser } from '@prisma/client';

// Export the AuthUser interface so it can be used in other files
export interface AuthUser {
  id: number;
  role: Role;
  email: string;
  employeeId?: number;
  companyId?: number;
  designation?: string;
  isActive?: boolean;
  departmentId?: number;
}

declare global {
  namespace Express {
    // Extend the existing User interface from Passport
    interface User extends AuthUser {}
  }
}

// Type guard to check if user exists and has required properties
export function isAuthUser(user: any): user is AuthUser {
  return user && typeof user.id === 'number' && typeof user.role === 'string';
}