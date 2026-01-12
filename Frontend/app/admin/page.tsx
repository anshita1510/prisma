'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Sidebar from './_components/Sidebar_A';
import Banner from "./_components/banner_A";
import PageHeader from './_components/PageHeader';
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
  UserPlus
} from 'lucide-react';
import { authService } from '@/app/services/authService';

interface DashboardStats {
  totalEmployees: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  pendingLeaves: number;
}

interface RecentActivity {
  id: string;
  type: 'user_created' | 'task_completed' | 'leave_approved' | 'project_created';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 24,
    activeProjects: 8,
    totalTasks: 156,
    completedTasks: 89,
    overdueTasks: 7,
    pendingLeaves: 5
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user_created',
      title: 'New User Created',
      description: 'John Smith was added as a Software Engineer',
      timestamp: '2 hours ago',
      user: 'Admin'
    },
    {
      id: '2',
      type: 'leave_approved',
      title: 'Leave Approved',
      description: 'Sarah Johnson\'s sick leave request was approved',
      timestamp: '4 hours ago',
      user: 'Admin'
    },
    {
      id: '3',
      type: 'project_created',
      title: 'New Project',
      description: 'E-commerce Platform project was created',
      timestamp: '6 hours ago',
      user: 'Admin'
    }
  ]);
  
  const [loading, setLoading] = useState(false);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_created':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'task_completed':
        return <CheckSquare className="w-4 h-4 text-green-500" />;
      case 'leave_approved':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'project_created':
        return <FolderOpen className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
          <PageHeader title="Dashboard" subtitle="Admin dashboard overview" showBackButton={false} />
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
    <div className="min-h-screen">
      <Sidebar />
      <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
        <PageHeader title="Dashboard" subtitle="Admin dashboard overview" showBackButton={false} />
        <div className="p-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  Active team members
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.totalTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completedTasks} completed
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{completionRate.toFixed(1)}%</div>
                <Progress value={completionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.pendingLeaves}</div>
                <p className="text-xs text-muted-foreground">
                  Require approval
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
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/createUser">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create New User
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/project">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Manage Projects
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/attendance">
                    <Clock className="mr-2 h-4 w-4" />
                    View Attendance
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/leave">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Leaves
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest administrative actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
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

          {/* Team Overview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Team Overview
              </CardTitle>
              <CardDescription>
                Current status of your team and departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Development Team</h4>
                    <Badge variant="secondary">12 Members</Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>85% Attendance</span>
                    <span>2 on leave</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Design Team</h4>
                    <Badge variant="secondary">6 Members</Badge>
                  </div>
                  <Progress value={92} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>92% Attendance</span>
                    <span>1 on leave</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">QA Team</h4>
                    <Badge variant="secondary">6 Members</Badge>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>78% Attendance</span>
                    <span>2 on leave</span>
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
