'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Sidebar from "./_components/sidebar_u";
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
  PlayCircle,
  PauseCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import { authService } from '@/app/services/authService';

interface DashboardStats {
  myTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  hoursLogged: number;
  attendanceRate: number;
}

interface RecentActivity {
  id: string;
  type: 'task_completed' | 'task_started' | 'time_logged' | 'comment_added';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export default function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    myTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    hoursLogged: 0,
    attendanceRate: 0
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
        myTasks: 12,
        completedTasks: 8,
        inProgressTasks: 3,
        overdueTasks: 1,
        hoursLogged: 38,
        attendanceRate: 96
      });
      
      setRecentActivity([
        {
          id: '1',
          type: 'task_completed',
          title: 'Task Completed',
          description: 'User interface design task was completed',
          timestamp: '2 hours ago',
          user: user?.name || 'You'
        },
        {
          id: '2',
          type: 'task_started',
          title: 'Task Started',
          description: 'Backend API development task was started',
          timestamp: '4 hours ago',
          user: user?.name || 'You'
        },
        {
          id: '3',
          type: 'time_logged',
          title: 'Time Logged',
          description: '3 hours logged for database optimization',
          timestamp: '6 hours ago',
          user: user?.name || 'You'
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
      case 'task_completed':
        return <CheckSquare className="w-4 h-4 text-green-500" />;
      case 'task_started':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'time_logged':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const completionRate = stats.myTasks > 0 ? (stats.completedTasks / stats.myTasks) * 100 : 0;

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
                <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.myTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.inProgressTasks} in progress
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                <p className="text-xs text-muted-foreground">
                  Tasks finished
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
                <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.hoursLogged}</div>
                <p className="text-xs text-muted-foreground">
                  Time logged
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
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/user/tasks">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    View My Tasks
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/user/projects">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    My Projects
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/user/attendance">
                    <Clock className="mr-2 h-4 w-4" />
                    Check Attendance
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/user/leave">
                    <Calendar className="mr-2 h-4 w-4" />
                    Request Leave
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  My Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest actions and updates
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

          {/* Task Overview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Task Overview
              </CardTitle>
              <CardDescription>
                Current status of your assigned tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Mobile App UI</h4>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>75% Complete</span>
                    <span>Due: Jan 15</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">API Integration</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>100% Complete</span>
                    <span>Completed</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Database Schema</h4>
                    <Badge variant="outline">To Do</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0% Complete</span>
                    <span>Due: Jan 20</span>
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