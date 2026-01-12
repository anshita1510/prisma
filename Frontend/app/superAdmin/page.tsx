'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Sidebar from './_components/Sidebarr';
import Banner from "./_components/Banner";
import { 
  BarChart3, 
  CheckSquare, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  FolderOpen,
  Target,
  Activity,
  Plus,
  User,
  UserPlus,
  Settings,
  FileText,
  Building,
  Shield,
  Database
} from 'lucide-react';
import { authService } from '@/app/services/authService';

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalProjects: number;
  systemHealth: number;
  activeUsers: number;
  pendingApprovals: number;
}

interface RecentActivity {
  id: string;
  type: 'admin_created' | 'system_update' | 'user_approved' | 'security_alert';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalProjects: 0,
    systemHealth: 0,
    activeUsers: 0,
    pendingApprovals: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const currentUser = authService.getStoredUser();
    setUser(currentUser);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in real app, this would come from APIs
      setStats({
        totalUsers: 156,
        totalAdmins: 8,
        totalProjects: 24,
        systemHealth: 98,
        activeUsers: 142,
        pendingApprovals: 3
      });
      
      setRecentActivity([
        {
          id: '1',
          type: 'admin_created',
          title: 'New Admin Created',
          description: 'Sarah Wilson was promoted to Admin role',
          timestamp: '1 hour ago',
          user: 'Super Admin'
        },
        {
          id: '2',
          type: 'system_update',
          title: 'System Update',
          description: 'Database backup completed successfully',
          timestamp: '3 hours ago',
          user: 'System'
        },
        {
          id: '3',
          type: 'security_alert',
          title: 'Security Alert',
          description: 'Multiple failed login attempts detected',
          timestamp: '5 hours ago',
          user: 'Security System'
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'admin_created':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'system_update':
        return <Database className="w-4 h-4 text-green-500" />;
      case 'user_approved':
        return <UserPlus className="w-4 h-4 text-orange-500" />;
      case 'security_alert':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Banner />
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Banner />
        <div className="p-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers} active users
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.totalAdmins}</div>
                <p className="text-xs text-muted-foreground">
                  Administrative users
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.systemHealth}%</div>
                <Progress value={stats.systemHealth} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Super Admin Actions
                </CardTitle>
                <CardDescription>
                  System-wide administrative controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/superAdmin/createUser">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Admin User
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/superAdmin/projects">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Manage All Projects
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Database Management
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Activity
                </CardTitle>
                <CardDescription>
                  Latest system-wide events and administrative actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Overview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Overview
              </CardTitle>
              <CardDescription>
                Organization-wide metrics and system status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Database Performance</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <Progress value={95} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>95% Efficiency</span>
                    <span>Response: 12ms</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Server Uptime</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <Progress value={99.9} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>99.9% Uptime</span>
                    <span>Last restart: 30d ago</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Security Status</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Secure</Badge>
                  </div>
                  <Progress value={98} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>98% Security Score</span>
                    <span>0 threats detected</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
