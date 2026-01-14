'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Sidebar from './_components/Sidebar_A';
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
  UserPlus,
  PieChart as PieChartIcon
} from 'lucide-react';
import { authService } from '@/app/services/authService';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

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

  // Chart data
  const attendanceTrendData = [
    { month: 'Jan', present: 92, late: 5, absent: 3 },
    { month: 'Feb', present: 88, late: 7, absent: 5 },
    { month: 'Mar', present: 95, late: 3, absent: 2 },
    { month: 'Apr', present: 90, late: 6, absent: 4 },
    { month: 'May', present: 93, late: 4, absent: 3 },
    { month: 'Jun', present: 96, late: 2, absent: 2 }
  ];

  const departmentPerformanceData = [
    { department: 'Development', productivity: 85, quality: 90, efficiency: 88 },
    { department: 'Design', productivity: 92, quality: 95, efficiency: 90 },
    { department: 'QA', productivity: 78, quality: 85, efficiency: 80 },
    { department: 'Marketing', productivity: 88, quality: 87, efficiency: 85 }
  ];

  const taskStatusData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    { name: 'In Progress', value: 45, color: '#3b82f6' },
    { name: 'Pending', value: 15, color: '#f59e0b' },
    { name: 'Overdue', value: stats.overdueTasks, color: '#ef4444' }
  ];

  const projectProgressData = [
    { project: 'E-commerce', progress: 75, tasks: 45, completed: 34 },
    { project: 'Mobile App', progress: 60, tasks: 30, completed: 18 },
    { project: 'Dashboard', progress: 90, tasks: 25, completed: 23 },
    { project: 'API Gateway', progress: 45, tasks: 40, completed: 18 }
  ];

  const employeeProductivityData = [
    { week: 'Week 1', avgHours: 42, avgTasks: 8 },
    { week: 'Week 2', avgHours: 45, avgTasks: 10 },
    { week: 'Week 3', avgHours: 43, avgTasks: 9 },
    { week: 'Week 4', avgHours: 46, avgTasks: 11 }
  ];

  const leaveStatisticsData = [
    { type: 'Sick Leave', count: 12, color: '#ef4444' },
    { type: 'Casual Leave', count: 18, color: '#3b82f6' },
    { type: 'Vacation', count: 25, color: '#10b981' },
    { type: 'Other', count: 5, color: '#f59e0b' }
  ];

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
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-16 min-h-screen pt-16 lg:pt-0">
          <PageHeader title="Dashboard" subtitle="Admin dashboard overview" showBackButton={false} />
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-16 min-h-screen pt-16 lg:pt-0">
        <PageHeader title="Dashboard" subtitle="Admin dashboard overview" showBackButton={false} />
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
          
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

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Trend */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Attendance Trends
                </CardTitle>
                <CardDescription>
                  Monthly attendance statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={attendanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="present" stackId="1" stroke="#10b981" fill="#10b981" />
                    <Area type="monotone" dataKey="late" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    <Area type="monotone" dataKey="absent" stackId="1" stroke="#ef4444" fill="#ef4444" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task Status Distribution */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Task Status Distribution
                </CardTitle>
                <CardDescription>
                  Current task breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Performance Radar */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Department Performance
                </CardTitle>
                <CardDescription>
                  Performance metrics by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={departmentPerformanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="department" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Productivity" dataKey="productivity" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    <Radar name="Quality" dataKey="quality" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Radar name="Efficiency" dataKey="efficiency" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Project Progress */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Project Progress
                </CardTitle>
                <CardDescription>
                  Active projects completion status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectProgressData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="project" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="progress" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Productivity */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Employee Productivity
                </CardTitle>
                <CardDescription>
                  Average hours and tasks per week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={employeeProductivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgHours" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgTasks" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Leave Statistics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Leave Statistics
                </CardTitle>
                <CardDescription>
                  Leave types distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveStatisticsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.type}: ${entry.count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {leaveStatisticsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
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
                  <a href="/admin/leave-management">
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
        </div>
      </div>
    </div>
  );
}
