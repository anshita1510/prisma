import { Request, Response } from 'express';
import { prisma } from '../../../config/db';
import { AuthUser } from '../../../types/express';
import { Role } from '@prisma/client';

export const getAnalyticsData = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthUser;
    const { period = 'monthly' } = req.query;

    // Only SuperAdmin can access analytics
    if (user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. SuperAdmin access required.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    console.log('🔍 Analytics - Getting data for period:', period);

    // Calculate date ranges based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); // 1 year ago
        break;
      case 'monthly':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 months ago
        break;
    }

    // Get user registrations over time
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        role: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group users by time period
    const userRegistrations = groupDataByPeriod(users, period as string, 'createdAt').map(item => ({
      period: item.period,
      total: item.data.length,
      admins: item.data.filter((u: any) => [Role.ADMIN, Role.SUPER_ADMIN].includes(u.role)).length,
      managers: item.data.filter((u: any) => u.role === Role.MANAGER).length,
      employees: item.data.filter((u: any) => u.role === Role.EMPLOYEE).length
    }));

    // Get company registrations over time
    const companies = await prisma.company.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        isActive: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const companyRegistrations = groupDataByPeriod(companies, period as string, 'createdAt').map(item => ({
      period: item.period,
      total: item.data.length,
      active: item.data.filter((c: any) => c.isActive).length
    }));

    // Get role distribution
    const [admins, managers, employees] = await Promise.all([
      prisma.user.count({ where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } } }),
      prisma.user.count({ where: { role: Role.MANAGER } }),
      prisma.user.count({ where: { role: Role.EMPLOYEE } })
    ]);

    const roleDistribution = [
      { role: 'Admins', count: admins, color: '#3B82F6' },
      { role: 'Managers', count: managers, color: '#10B981' },
      { role: 'Employees', count: employees, color: '#F59E0B' }
    ];

    // Get activity trends (using updatedAt as proxy for activity)
    const userActivity = await prisma.user.findMany({
      where: {
        updatedAt: {
          gte: startDate
        }
      },
      select: {
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'asc'
      }
    });

    const activityTrends = groupDataByPeriod(userActivity, period as string, 'updatedAt').map(item => ({
      period: item.period,
      activity: item.data.length
    }));

    // Get current totals for comparison
    const currentTotals = {
      totalUsers: await prisma.user.count(),
      totalAdmins: await prisma.user.count({ where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } } }),
      totalManagers: await prisma.user.count({ where: { role: Role.MANAGER } }),
      totalEmployees: await prisma.user.count({ where: { role: Role.EMPLOYEE } }),
      totalCompanies: await prisma.company.count(),
      activeUsers: await prisma.user.count({ where: { isActive: true } }),
    };

    return res.json({
      success: true,
      analytics: {
        period,
        dateRange: {
          start: startDate.toISOString(),
          end: now.toISOString()
        },
        userRegistrations,
        companyRegistrations,
        roleDistribution,
        activityTrends,
        currentTotals
      }
    });
  } catch (error: any) {
    console.error('Error fetching analytics data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
};

export const getDetailedAnalytics = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthUser;
    const { metric, period = 'monthly' } = req.query;

    if (user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. SuperAdmin access required.'
      });
    }

    let data;
    switch (metric) {
      case 'users':
        data = await prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            company: {
              select: {
                name: true,
                code: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        break;
      case 'companies':
        data = await prisma.company.findMany({
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
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        break;
      case 'roles':
        data = await prisma.user.groupBy({
          by: ['role'],
          _count: {
            role: true
          },
          orderBy: {
            _count: {
              role: 'desc'
            }
          }
        });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid metric specified'
        });
    }

    return res.json({
      success: true,
      metric,
      period,
      data
    });
  } catch (error: any) {
    console.error('Error fetching detailed analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch detailed analytics',
      error: error.message
    });
  }
};

// Helper function to group data by time period
function groupDataByPeriod(data: any[], period: string, dateField: string) {
  const grouped = new Map();

  data.forEach(item => {
    const date = new Date(item[dateField]);
    let key: string;

    if (period === 'weekly') {
      key = date.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (period === 'monthly') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    } else {
      key = date.getFullYear().toString(); // YYYY
    }

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(item);
  });

  // Convert to array and sort
  return Array.from(grouped.entries())
    .map(([period, data]) => ({ period, data }))
    .sort((a, b) => a.period.localeCompare(b.period));
}