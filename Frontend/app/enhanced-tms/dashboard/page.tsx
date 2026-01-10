'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedProjectCard } from '@/components/enhanced/EnhancedProjectCard';
import { EnhancedTaskCard } from '@/components/enhanced/EnhancedTaskCard';
import { 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Plus,
  Calendar,
  Users,
  BarChart3,
  Bell,
  Settings,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data - In real implementation, this would come from API calls
const mockDashboardData = {
  user: {
    id: 1,
    name: 'John Doe',
    role: 'MANAGER',
    designation: 'TECH_LEAD',
    avatar: '/api/placeholder/32/32'
  },
  stats: {
    totalProjects: 12,
    activeProjects: 8,
    totalTasks: 156,
    myTasks: 23,
    completedTasks: 89,
    overdueTasks: 7,
    teamMembers: 24,
    notifications: 5
  },
  recentProjects: [
    {
      id: 1,
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application for customer engagement',
      code: 'PROJ-001',
      status: 'ACTIVE' as const,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      budget: 150000,
      actualCost: 89000,
      progressPercentage: 75,
      owner: { id: 1, name: 'John Doe', designation: 'TECH_LEAD' },
      department: { id: 1, name: 'Engineering' },
      members: [
        { id: 2, name: 'Jane Smith', designation: 'SOFTWARE_ENGINEER' },
        { id: 3, name: 'Mike Johnson', designation: 'SENIOR_ENGINEER' }
      ],
      milestones: [
        { id: 1, name: 'MVP Release', dueDate: '2024-03-15', isCompleted: true },
        { id: 2, name: 'Beta Testing', dueDate: '2024-05-01', isCompleted: false }
      ],
      _count: { tasks: 24, milestones: 3 },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern UI/UX',
      code: 'PROJ-002',
      status: 'ACTIVE' as const,
      startDate: '2023-11-01',
      endDate: '2024-02-28',
      budget: 75000,
      actualCost: 68000,
      progressPercentage: 90,
      owner: { id: 4, name: 'Sarah Wilson', designation: 'MANAGER' },
      department: { id: 2, name: 'Design' },
      members: [
        { id: 5, name: 'Alex Brown', designation: 'SOFTWARE_ENGINEER' }
      ],
      milestones: [
        { id: 3, name: 'Design Phase', dueDate: '2023-12-15', isCompleted: true },
        { id: 4, name: 'Development', dueDate: '2024-02-01', isCompleted: true }
      ],
      _count: { tasks: 18, milestones: 2 },
      createdAt: '2023-11-01',
      updatedAt: '2024-01-10'
    }
  ],
  myTasks: [
    {
      id: 1,
      title: 'Implement User Authentication',
      description: 'Set up JWT-based authentication system with role management',
      code: 'TASK-001',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      dueDate: '2024-01-25',
      startDate: '2024-01-15',
      estimatedHours: 16,
      actualHours: 8,
      progressPercentage: 60,
      assignedTo: { id: 1, name: 'John Doe', designation: 'TECH_LEAD' },
      createdBy: { id: 4, name: 'Sarah Wilson', designation: 'MANAGER' },
      project: { id: 1, name: 'Mobile App Development' },
      milestone: { id: 1, name: 'MVP Release' },
      subTasks: [
        { id: 11, title: 'Setup JWT library', status: 'COMPLETED' },
        { id: 12, title: 'Create login endpoint', status: 'IN_PROGRESS' }
      ],
      dependencies: [],
      _count: { comments: 3, timeEntries: 5, attachments: 2 },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Database Schema Design',
      description: 'Design and implement the core database schema for user management',
      code: 'TASK-002',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      dueDate: '2024-01-30',
      estimatedHours: 12,
      actualHours: 0,
      progressPercentage: 0,
      assignedTo: { id: 1, name: 'John Doe', designation: 'TECH_LEAD' },
      createdBy: { id: 1, name: 'John Doe', designation: 'TECH_LEAD' },
      project: { id: 1, name: 'Mobile App Development' },
      subTasks: [],
      dependencies: [
        { predecessorTask: { id: 1, title: 'Implement User Authentication', status: 'IN_PROGRESS' } }
      ],
      _count: { comments: 1, timeEntries: 0, attachments: 0 },
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    }
  ],
  notifications: [
    {
      id: 1,
      title: 'Task Assigned',
      message: 'You have been assigned a new task: "API Integration Testing"',
      type: 'TASK_ASSIGNED',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Deadline Reminder',
      message: 'Task "Implement User Authentication" is due tomorrow',
      type: 'DEADLINE_REMINDER',
      isRead: false,
      createdAt: '2024-01-15T09:00:00Z'
    }
  ]
};

export default function EnhancedDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [dashboardData, setDashboardData] = useState(mockDashboardData);

  // In real implementation, these would be API calls
  useEffect(() => {
    // loadDashboardData();
  }, []);

  const handleProjectView = (project: any) => {
    console.log('View project:', project);
    // Navigate to project details
  };

  const handleTaskView = (task: any) => {
    console.log('View task:', task);
    // Navigate to task details
  };

  const handleTaskStatusChange = (task: any, status: string) => {
    console.log('Change task status:', task.id, status);
    // Update task status via API
  };

  const filteredTasks = dashboardData.myTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || task.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {dashboardData.user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                  {dashboardData.stats.notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {dashboardData.stats.notifications}
                    </Badge>
                  )}
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {dashboardData.user.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{dashboardData.user.name}</p>
                  <p className="text-xs text-gray-500">{dashboardData.user.designation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.stats.totalProjects} total projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.myTasks}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.stats.completedTasks} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{dashboardData.stats.overdueTasks}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.teamMembers}</div>
              <p className="text-xs text-muted-foreground">
                Active members
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            <div className="space-y-6">
              {dashboardData.recentProjects.map((project) => (
                <EnhancedProjectCard
                  key={project.id}
                  project={project}
                  onView={handleProjectView}
                  userRole={dashboardData.user.role}
                  userDesignation={dashboardData.user.designation}
                />
              ))}
            </div>
          </div>

          {/* My Tasks */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Tasks</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>

            {/* Task Filters */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'].map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter === 'all' ? 'All' : filter.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <EnhancedTaskCard
                  key={task.id}
                  task={task}
                  onView={handleTaskView}
                  onStatusChange={handleTaskStatusChange}
                  userRole={dashboardData.user.role}
                  currentUserId={dashboardData.user.id}
                />
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tasks found matching your criteria
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        {dashboardData.notifications.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6">Recent Notifications</h2>
            <div className="space-y-3">
              {dashboardData.notifications.slice(0, 3).map((notification) => (
                <Card key={notification.id} className={`${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}