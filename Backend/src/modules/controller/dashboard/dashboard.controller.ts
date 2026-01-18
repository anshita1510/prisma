import { Request, Response } from 'express';
import { prisma } from '../../../config/db';
import { AuthUser } from '../../../types/express';
import { Role } from '@prisma/client';

export class DashboardController {
  /**
   * Debug endpoint to check database contents (SuperAdmin only)
   */
  async debugDatabaseContents(req: Request, res: Response) {
    try {
      const user = req.user as AuthUser;

      if (user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. SuperAdmin access required.',
        });
      }

      // Get all users with their details
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          status: true,
          companyId: true,
          createdAt: true
        }
      });

      // Get all companies
      const allCompanies = await prisma.company.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              users: true,
              employees: true
            }
          }
        }
      });

      // Get basic counts without filters
      const basicCounts = {
        totalUsersAll: await prisma.user.count(),
        totalUsersActive: await prisma.user.count({ where: { isActive: true } }),
        totalCompaniesAll: await prisma.company.count(),
        totalCompaniesActive: await prisma.company.count({ where: { isActive: true } }),
        totalAdminsAll: await prisma.user.count({ 
          where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } } 
        }),
        totalAdminsActive: await prisma.user.count({ 
          where: { 
            role: { in: [Role.ADMIN, Role.SUPER_ADMIN] },
            isActive: true 
          } 
        })
      };

      return res.json({
        success: true,
        debug: {
          basicCounts,
          allUsers,
          allCompanies,
          currentUser: user
        }
      });
    } catch (error: any) {
      console.error('Error in debug endpoint:', error);
      return res.status(500).json({
        success: false,
        message: 'Debug failed',
        error: error.message
      });
    }
  }

  /**
   * Get dashboard statistics (SuperAdmin only)
   */
  async getDashboardStats(req: Request, res: Response) {
    try {
      const user = req.user as AuthUser;

      // Only SuperAdmin can access dashboard stats
      if (user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. SuperAdmin access required.',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      console.log('🔍 Dashboard Stats - Starting queries...');

      // Get total users count (remove isActive filter for now)
      const totalUsers = await prisma.user.count();
      console.log('📊 Total Users:', totalUsers);

      // Get total admins count (ADMIN + SUPER_ADMIN) - remove isActive filter
      const totalAdmins = await prisma.user.count({
        where: {
          role: {
            in: [Role.ADMIN, Role.SUPER_ADMIN]
          }
        }
      });
      console.log('📊 Total Admins:', totalAdmins);

      // Get total managers count - remove isActive filter
      const totalManagers = await prisma.user.count({
        where: {
          role: Role.MANAGER
        }
      });
      console.log('📊 Total Managers:', totalManagers);

      // Get total employees count - remove isActive filter
      const totalEmployees = await prisma.user.count({
        where: {
          role: Role.EMPLOYEE
        }
      });
      console.log('📊 Total Employees:', totalEmployees);

      // Get total companies count - remove isActive filter
      const totalCompanies = await prisma.company.count();
      console.log('📊 Total Companies:', totalCompanies);

      // Get total projects count
      const totalProjects = await prisma.project.count();

      // Get total departments count
      const totalDepartments = await prisma.department.count();

      // Get active users (users who have logged in recently - last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Since we don't have a lastLogin field, we'll use updatedAt as a proxy
      const activeUsers = await prisma.user.count({
        where: {
          updatedAt: {
            gte: thirtyDaysAgo
          }
        }
      });

      // Get pending approvals (users with PENDING status)
      const pendingApprovals = await prisma.user.count({
        where: {
          status: 'PENDING'
        }
      });

      // Calculate system health (simple metric based on active vs total users)
      const systemHealth = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 100;

      // Get recent user registrations (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentRegistrations = await prisma.user.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      });

      console.log('📊 Final Stats Object:', {
        totalUsers,
        totalAdmins,
        totalManagers,
        totalEmployees,
        totalCompanies,
        totalProjects,
        totalDepartments,
        activeUsers,
        pendingApprovals,
        systemHealth,
        recentRegistrations
      });

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalAdmins,
          totalManagers,
          totalEmployees,
          totalCompanies,
          totalProjects,
          totalDepartments,
          activeUsers,
          pendingApprovals,
          systemHealth,
          recentRegistrations
        }
      });
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error.message
      });
    }
  }

  /**
   * Get recent system activity (SuperAdmin only)
   */
  async getRecentActivity(req: Request, res: Response) {
    try {
      const user = req.user as AuthUser;

      // Only SuperAdmin can access recent activity
      if (user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. SuperAdmin access required.',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Get recent user creations
      const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      // Get recent companies
      const recentCompanies = await prisma.company.findMany({
        take: 3,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          code: true,
          createdAt: true
        }
      });

      // Format activity data
      const activities: { id: string; type: string; title: string; description: string; timestamp: string; user: string; }[] = [];

      // Helper function for time calculation
      const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 60) {
          return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
          return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else {
          return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
      };

      // Add user activities
      recentUsers.forEach((recentUser) => {
        const timeAgo = getTimeAgo(recentUser.createdAt);
        activities.push({
          id: `user-${recentUser.id}`,
          type: recentUser.role === 'ADMIN' ? 'admin_created' : 'user_created',
          title: recentUser.role === 'ADMIN' ? 'New Admin Created' : 'New User Registered',
          description: `${recentUser.firstName} ${recentUser.lastName} (${recentUser.email}) joined as ${recentUser.role}`,
          timestamp: timeAgo,
          user: 'System'
        });
      });

      // Add company activities
      recentCompanies.forEach((company) => {
        const timeAgo = getTimeAgo(company.createdAt);
        activities.push({
          id: `company-${company.id}`,
          type: 'company_created',
          title: 'New Company Added',
          description: `${company.name} (${company.code}) was created`,
          timestamp: timeAgo,
          user: 'Super Admin'
        });
      });

      // Sort by most recent first (based on creation date)
      activities.sort((a, b) => {
        // Extract timestamp from activity ID to sort properly
        // For now, keep original order since we're already sorting by createdAt desc
        return 0;
      });

      return res.json({
        success: true,
        activities: activities.slice(0, 10) // Return top 10 activities
      });
    } catch (error: any) {
      console.error('Error fetching recent activity:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recent activity',
        error: error.message
      });
    }
  }

  /**
   * Helper function to calculate time ago
   */
  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  }
}