'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedProjectCard } from '@/components/enhanced/EnhancedProjectCard';
import { EnhancedTaskCard } from '@/components/enhanced/EnhancedTaskCard';
import { 
  FolderOpen, 
  CheckSquare, 
  AlertCircle, 
  Users,
  Plus,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

// Demo data for admin with manager designation
const demoData = {
  user: {
    id: 1,
    name: 'Admin Manager',
    role: 'ADMIN',
    designation: 'MANAGER',
    avatar: '/api/placeholder/32/32'
  },
  stats: {
    totalProjects: 15,
    activeProjects: 12,
    totalTasks: 89,
    myTasks: 8,
    completedTasks: 67,
    overdueTasks: 3,
    teamMembers: 32,
    notifications: 7
  },
  projects: [
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'Complete e-commerce solution with payment integration and inventory management',
      code: 'PROJ-001',
      status: 'ACTIVE' as const,
      startDate: '2024-01-01',
      endDate: '2024-08-30',
      budget: 250000,
      actualCost: 180000,
      progressPercentage: 85,
      owner: { id: 1, name: 'Admin Manager', designation: 'MANAGER' },
      department: { id: 1, name: 'Engineering' },
      members: [
        { id: 2, name: 'Sarah Johnson', designation: 'TECH_LEAD' },
        { id: 3, name: 'Mike Chen', designation: 'SENIOR_ENGINEER' },
        { id: 4, name: 'Lisa Wang', designation: 'SOFTWARE_ENGINEER' }
      ],
      milestones: [
        { id: 1, name: 'MVP Release', dueDate: '2024-03-15', isCompleted: true },
        { id: 2, name: 'Beta Testing', dueDate: '2024-06-01', isCompleted: true },
        { id: 3, name: 'Production Launch', dueDate: '2024-08-15', isCompleted: false }
      ],
      _count: { tasks: 34, milestones: 3 },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application for iOS and Android',
      code: 'PROJ-002',
      status: 'ACTIVE' as const,
      startDate: '2024-02-01',
      endDate: '2024-09-30',
      budget: 180000,
      actualCost: 95000,
      progressPercentage: 60,
      owner: { id: 2, name: 'Sarah Johnson', designation: 'TECH_LEAD' },
      department: { id: 1, name: 'Engineering' },
      members: [
        { id: 1, name: 'Admin Manager', designation: 'MANAGER' },
        { id: 5, name: 'Alex Rodriguez', designation: 'SOFTWARE_ENGINEER' }
      ],
      milestones: [
        { id: 4, name: 'UI/UX Design', dueDate: '2024-03-30', isCompleted: true },
        { id: 5, name: 'Core Features', dueDate: '2024-07-15', isCompleted: false }
      ],
      _count: { tasks: 28, milestones: 2 },
      createdAt: '2024-02-01',
      updatedAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Data Analytics Dashboard',
      description: 'Business intelligence dashboard with real-time analytics and reporting',
      code: 'PROJ-003',
      status: 'PLANNING' as const,
      startDate: '2024-03-01',
      endDate: '2024-10-30',
      budget: 120000,
      actualCost: 25000,
      progressPercentage: 15,
      owner: { id: 1, name: 'Admin Manager', designation: 'MANAGER' },
      department: { id: 2, name: 'Data Science' },
      members: [
        { id: 6, name: 'David Kim', designation: 'SENIOR_ENGINEER' },
        { id: 7, name: 'Emma Thompson', designation: 'SOFTWARE_ENGINEER' }
      ],
      milestones: [
        { id: 6, name: 'Requirements Analysis', dueDate: '2024-03-30', isCompleted: false }
      ],
      _count: { tasks: 12, milestones: 1 },
      createdAt: '2024-03-01',
      updatedAt: '2024-03-05'
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Implement Payment Gateway Integration',
      description: 'Integrate Stripe and PayPal payment systems with proper error handling',
      code: 'TASK-001',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      dueDate: '2024-01-25',
      startDate: '2024-01-15',
      estimatedHours: 24,
      actualHours: 16,
      progressPercentage: 75,
      assignedTo: { id: 3, name: 'Mike Chen', designation: 'SENIOR_ENGINEER' },
      createdBy: { id: 1, name: 'Admin Manager', designation: 'MANAGER' },
      project: { id: 1, name: 'E-Commerce Platform' },
      milestone: { id: 2, name: 'Beta Testing' },
      subTasks: [
        { id: 11, title: 'Setup Stripe SDK', status: 'COMPLETED' },
        { id: 12, title: 'Implement PayPal integration', status: 'IN_PROGRESS' }
      ],
      dependencies: [],
      _count: { comments: 5, timeEntries: 8, attachments: 3 },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      title: 'Design User Authentication Flow',
      description: 'Create wireframes and user flow for login, registration, and password reset',
      code: 'TASK-002',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      dueDate: '2024-02-15',
      estimatedHours: 16,
      actualHours: 0,
      progressPercentage: 0,
      assignedTo: { id: 4, name: 'Lisa Wang', designation: 'SOFTWARE_ENGINEER' },
      createdBy: { id: 1, name: 'Admin Manager', designation: 'MANAGER' },
      project: { id: 2, name: 'Mobile App Development' },
      subTasks: [],
      dependencies: [],
      _count: { comments: 2, timeEntries: 0, attachments: 1 },
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    }
  ]
};

export default function DemoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleProjectView = (project: any) => {
    alert(`Viewing project: ${project.name}`);
  };

  const handleProjectEdit = (project: any) => {
    alert(`Editing project: ${project.name}`);
  };

  const handleTaskView = (task: any) => {
    alert(`Viewing task: ${task.title}`);
  };

  const handleTaskStatusChange = (task: any, status: string) => {
    alert(`Changing task "${task.title}" status to: ${status}`);
  };

  const filteredTasks = demoData.tasks.filter(task => {
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
                <h1 className="text-2xl font-bold text-gray-900">Enhanced TMS Demo</h1>
                <p className="text-gray-600">Welcome back, {demoData.user.name} ({demoData.user.role} - {demoData.user.designation})</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">Demo Mode</Badge>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {demoData.user.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{demoData.user.name}</p>
                  <p className="text-xs text-gray-500">{demoData.user.designation}</p>
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
              <div className="text-2xl font-bold">{demoData.stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                {demoData.stats.totalProjects} total projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoData.stats.myTasks}</div>
              <p className="text-xs text-muted-foreground">
                {demoData.stats.completedTasks} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{demoData.stats.overdueTasks}</div>
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
              <div className="text-2xl font-bold">{demoData.stats.teamMembers}</div>
              <p className="text-xs text-muted-foreground">
                Active members
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Projects (Admin Access)</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            <div className="space-y-6">
              {demoData.projects.map((project) => (
                <EnhancedProjectCard
                  key={project.id}
                  project={project}
                  onView={handleProjectView}
                  onEdit={handleProjectEdit}
                  userRole={demoData.user.role}
                  userDesignation={demoData.user.designation}
                />
              ))}
            </div>
          </div>

          {/* Tasks */}
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
                  userRole={demoData.user.role}
                  currentUserId={demoData.user.id}
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

        {/* Demo Notice */}
        <div className="mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Mode Active</h3>
              <p className="text-blue-800 mb-4">
                This is a demonstration of the Enhanced Task Management System. As an ADMIN with MANAGER designation, you have full access to:
              </p>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Create and manage all projects</li>
                <li>Assign tasks to team members</li>
                <li>View project budgets and progress</li>
                <li>Manage project milestones</li>
                <li>Access all team projects and tasks</li>
              </ul>
              <p className="text-blue-800 mt-4">
                To access the full system with backend integration, please contact your system administrator for login credentials.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}