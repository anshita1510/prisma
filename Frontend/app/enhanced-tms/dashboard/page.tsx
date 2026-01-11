'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
  User
} from 'lucide-react';
import { enhancedTaskService } from '@/app/services/enhancedTaskService';
import { enhancedProjectService } from '@/app/services/enhancedProjectService';
import { authService } from '@/app/services/authService';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamMembers: number;
}

interface RecentActivity {
  id: string;
  type: 'task_completed' | 'project_created' | 'task_assigned' | 'milestone_reached';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export default function EnhancedTMSDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    teamMembers: 0
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
      
      // Load dashboard statistics
      const [projectsResponse, tasksResponse] = await Promise.all([
        enhancedProjectService.getProjects(),
        enhancedTaskService.getTasks()
      ]);

      if (projectsResponse.success && tasksResponse.success) {
        const projects = projectsResponse.data;
        const tasks = tasksResponse.data;

        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter((p: any) => p.status === 'ACTIVE').length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t: any) => t.status === 'COMPLETED').length,
          overdueTasks: tasks.filter((t: any) => 
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED'
          ).length,
          teamMembers: new Set(tasks.map((t: any) => t.assignedTo?.id).filter(Boolean)).size
        });

        // Mock recent activity - in real app, this would come from an API
        setRecentActivity([
          {
            id: '1',
            type: 'task_completed',
            title: 'Task Completed',
            description: 'User interface design task was completed',
            timestamp: '2 hours ago',
            user: 'John Doe'
          },
          {
            id: '2',
            type: 'project_created',
            title: 'New Project',
            description: 'Mobile App Development project was created',
            timestamp: '4 hours ago',
            user: 'Jane Smith'
          },
          {
            id: '3',
            type: 'task_assigned',
            title: 'Task Assigned',
            description: 'Backend API development task assigned to team',
            timestamp: '6 hours ago',
            user: 'Mike Johnson'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set mock data as fallback
      setStats({
        totalProjects: 12,
        activeProjects: 8,
        totalTasks: 156,
        completedTasks: 89,
        overdueTasks: 7,
        teamMembers: 24
      });
      
      setRecentActivity([
        {
          id: '1',
          type: 'task_completed',
          title: 'Task Completed',
          description: 'User interface design task was completed',
          timestamp: '2 hours ago',
          user: 'John Doe'
        },
        {
          id: '2',
          type: 'project_created',
          title: 'New Project',
          description: 'Mobile App Development project was created',
          timestamp: '4 hours ago',
          user: 'Jane Smith'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckSquare className="w-4 h-4 text-green-500" />;
      case 'project_created':
        return <FolderOpen className="w-4 h-4 text-blue-500" />;
      case 'task_assigned':
        return <Users className="w-4 h-4 text-orange-500" />;
      case 'milestone_reached':
        return <Target className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="slide-in-from-left">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome {user?.name || 'User'}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Ready to manage your projects and tasks efficiently
                </p>
                <div className="flex items-center mt-3 space-x-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {user?.role || 'USER'}
                  </Badge>
                  <span className="text-blue-100">•</span>
                  <span className="text-blue-100">{user?.designation || 'Team Member'}</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-in-from-bottom">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProjects} active projects
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedTasks} completed
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="card-hover slide-in-from-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <FolderOpen className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckSquare className="mr-2 h-4 w-4" />
                Add New Task
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 card-hover slide-in-from-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates from your projects and tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
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

        {/* Project Overview */}
        <Card className="card-hover slide-in-from-bottom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Overview
            </CardTitle>
            <CardDescription>
              Current status of your active projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* This would be populated with actual project data */}
              <div className="p-4 border rounded-lg space-y-2 animate-scale-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Mobile App Development</h4>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <Progress value={75} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>75% Complete</span>
                  <span>Due: Dec 31</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg space-y-2 animate-scale-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Website Redesign</h4>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <Progress value={45} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>45% Complete</span>
                  <span>Due: Jan 15</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg space-y-2 animate-scale-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">API Integration</h4>
                  <Badge variant="outline">Planning</Badge>
                </div>
                <Progress value={10} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>10% Complete</span>
                  <span>Due: Feb 28</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}