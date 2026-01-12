'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Sidebar from '../../admin/_components/Sidebar_A';
import PageHeader from '../../admin/_components/PageHeader';
import { 
  FolderOpen, 
  Plus, 
  Calendar, 
  Users, 
  MoreVertical,
  Search,
  Filter,
  ArrowLeft,
  CheckSquare,
  Clock,
  User,
  AlertCircle,
  Target,
  TrendingUp,
  Activity,
  Edit,
  Trash2
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'PLANNING';
  progress: number;
  dueDate: string;
  startDate: string;
  teamMembers: number;
  tasksCount: number;
  completedTasks: number;
  budget: number;
  spent: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  manager: string;
  client: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'TESTING' | 'PUBLISHED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignee: string;
  dueDate: string;
  createdDate: string;
  projectId: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  week: string; // Format: "2024-W50"
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('TODO');
  const [selectedWeek, setSelectedWeek] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Mobile App Development',
          description: 'Developing a cross-platform mobile application for customer engagement with advanced features and analytics',
          status: 'ACTIVE',
          progress: 75,
          dueDate: '2024-12-31',
          startDate: '2024-10-01',
          teamMembers: 5,
          tasksCount: 24,
          completedTasks: 18,
          budget: 150000,
          spent: 112500,
          priority: 'HIGH',
          manager: 'John Doe',
          client: 'TechCorp Inc.'
        },
        {
          id: '2',
          name: 'Website Redesign',
          description: 'Complete overhaul of the company website with modern UI/UX and responsive design',
          status: 'ACTIVE',
          progress: 45,
          dueDate: '2025-01-15',
          startDate: '2024-11-01',
          teamMembers: 3,
          tasksCount: 16,
          completedTasks: 7,
          budget: 80000,
          spent: 36000,
          priority: 'MEDIUM',
          manager: 'Jane Smith',
          client: 'Design Studio'
        },
        {
          id: '3',
          name: 'API Integration',
          description: 'Integration with third-party APIs for enhanced functionality and data synchronization',
          status: 'PLANNING',
          progress: 10,
          dueDate: '2025-02-28',
          startDate: '2024-12-15',
          teamMembers: 4,
          tasksCount: 12,
          completedTasks: 1,
          budget: 60000,
          spent: 6000,
          priority: 'MEDIUM',
          manager: 'Mike Johnson',
          client: 'Enterprise Solutions'
        },
        {
          id: '4',
          name: 'Database Migration',
          description: 'Migrating legacy database to modern cloud infrastructure with improved performance',
          status: 'COMPLETED',
          progress: 100,
          dueDate: '2024-11-30',
          startDate: '2024-09-01',
          teamMembers: 2,
          tasksCount: 8,
          completedTasks: 8,
          budget: 40000,
          spent: 38000,
          priority: 'HIGH',
          manager: 'Sarah Wilson',
          client: 'Internal'
        }
      ];

      const mockTasks: Task[] = [
        // Mobile App Development Tasks
        {
          id: '1',
          title: 'Design Authentication Flow',
          description: 'Create wireframes and mockups for login/register process',
          status: 'COMPLETED',
          priority: 'HIGH',
          assignee: 'Alice Johnson',
          dueDate: '2024-12-20',
          createdDate: '2024-12-01',
          projectId: '1',
          estimatedHours: 16,
          actualHours: 14,
          tags: ['UI/UX', 'Authentication'],
          week: '2024-W50'
        },
        {
          id: '2',
          title: 'Implement User Registration API',
          description: 'Backend API endpoints for user registration and validation',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignee: 'Bob Smith',
          dueDate: '2024-12-25',
          createdDate: '2024-12-05',
          projectId: '1',
          estimatedHours: 20,
          actualHours: 12,
          tags: ['Backend', 'API'],
          week: '2024-W51'
        },
        {
          id: '3',
          title: 'Mobile App Testing',
          description: 'Comprehensive testing of mobile application features',
          status: 'TESTING',
          priority: 'MEDIUM',
          assignee: 'Carol Davis',
          dueDate: '2024-12-30',
          createdDate: '2024-12-10',
          projectId: '1',
          estimatedHours: 24,
          actualHours: 8,
          tags: ['Testing', 'QA'],
          week: '2024-W52'
        },
        {
          id: '4',
          title: 'App Store Deployment',
          description: 'Deploy mobile app to App Store and Play Store',
          status: 'TODO',
          priority: 'URGENT',
          assignee: 'David Wilson',
          dueDate: '2025-01-05',
          createdDate: '2024-12-15',
          projectId: '1',
          estimatedHours: 8,
          actualHours: 0,
          tags: ['Deployment', 'Publishing'],
          week: '2025-W01'
        },
        // Website Redesign Tasks
        {
          id: '5',
          title: 'Homepage Redesign',
          description: 'Redesign homepage with modern layout and branding',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignee: 'Eva Brown',
          dueDate: '2024-12-28',
          createdDate: '2024-12-01',
          projectId: '2',
          estimatedHours: 32,
          actualHours: 20,
          tags: ['Frontend', 'Design'],
          week: '2024-W52'
        },
        {
          id: '6',
          title: 'Contact Form Implementation',
          description: 'Implement contact form with validation and email integration',
          status: 'TODO',
          priority: 'MEDIUM',
          assignee: 'Frank Miller',
          dueDate: '2025-01-10',
          createdDate: '2024-12-08',
          projectId: '2',
          estimatedHours: 12,
          actualHours: 0,
          tags: ['Frontend', 'Forms'],
          week: '2025-W02'
        },
        {
          id: '7',
          title: 'SEO Optimization',
          description: 'Optimize website for search engines and performance',
          status: 'ON_HOLD',
          priority: 'LOW',
          assignee: 'Grace Lee',
          dueDate: '2025-01-20',
          createdDate: '2024-12-12',
          projectId: '2',
          estimatedHours: 16,
          actualHours: 2,
          tags: ['SEO', 'Performance'],
          week: '2025-W03'
        }
      ];

      setProjects(mockProjects);
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: Project['status'] | Task['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'PLANNING':
        return 'bg-purple-100 text-purple-800';
      case 'TODO':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'TESTING':
        return 'bg-orange-100 text-orange-800';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByStatus = (projectId: string, status: Task['status']) => {
    return getProjectTasks(projectId).filter(task => task.status === status);
  };

  const getTasksByWeek = (projectTasks: Task[], week: string) => {
    if (week === 'all') return projectTasks;
    return projectTasks.filter(task => task.week === week);
  };

  const getUniqueWeeks = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    const weeks = [...new Set(projectTasks.map(task => task.week))].sort();
    return weeks;
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
          <PageHeader title="Enhanced Projects" subtitle="Manage and track your project progress" />
          <div className="p-6">
            <div className="animate-fade-in">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Project Detail View
  if (selectedProject) {
    const projectTasks = getProjectTasks(selectedProject.id);
    const weeks = getUniqueWeeks(selectedProject.id);
    const filteredTasks = getTasksByWeek(
      getTasksByStatus(selectedProject.id, activeTab as Task['status']),
      selectedWeek
    );

    return (
      <div className="min-h-screen">
        <Sidebar />
        <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
          <PageHeader 
            title={selectedProject.name} 
            subtitle="Project Details & Task Management"
          >
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Project
            </Button>
          </PageHeader>
          <div className="p-6">
            <div className="space-y-6 animate-fade-in">
              {/* Back Button */}
              <Button 
                variant="outline" 
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Button>

              {/* Project Header */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FolderOpen className="w-6 h-6 text-blue-600" />
                      <Badge className={getStatusColor(selectedProject.status)}>
                        {selectedProject.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(selectedProject.priority)}>
                        {selectedProject.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Project
                  </Button>
                </div>

                {/* Project Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Target className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">{selectedProject.progress}%</p>
                          <p className="text-sm text-gray-600">Progress</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">{selectedProject.completedTasks}/{selectedProject.tasksCount}</p>
                          <p className="text-sm text-gray-600">Tasks</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold">{selectedProject.teamMembers}</p>
                          <p className="text-sm text-gray-600">Team Members</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-2xl font-bold">${(selectedProject.spent / 1000).toFixed(0)}k</p>
                          <p className="text-sm text-gray-600">Budget Used</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Project Manager</h3>
                    <p className="text-gray-600">{selectedProject.manager}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                    <p className="text-gray-600">{selectedProject.client}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                    <p className="text-gray-600">
                      {new Date(selectedProject.startDate).toLocaleDateString()} - {new Date(selectedProject.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Task Management Section */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Task Management</h2>
                    <div className="flex items-center gap-4">
                      <select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Weeks</option>
                        {weeks.map(week => (
                          <option key={week} value={week}>Week {week.split('-W')[1]}, {week.split('-')[0]}</option>
                        ))}
                      </select>
                      <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Task
                      </Button>
                    </div>
                  </div>

                  {/* Task Status Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="TODO" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        To Do ({getTasksByStatus(selectedProject.id, 'TODO').length})
                      </TabsTrigger>
                      <TabsTrigger value="IN_PROGRESS" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        In Progress ({getTasksByStatus(selectedProject.id, 'IN_PROGRESS').length})
                      </TabsTrigger>
                      <TabsTrigger value="TESTING" className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Testing ({getTasksByStatus(selectedProject.id, 'TESTING').length})
                      </TabsTrigger>
                      <TabsTrigger value="COMPLETED" className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Completed ({getTasksByStatus(selectedProject.id, 'COMPLETED').length})
                      </TabsTrigger>
                      <TabsTrigger value="ON_HOLD" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        On Hold ({getTasksByStatus(selectedProject.id, 'ON_HOLD').length})
                      </TabsTrigger>
                      <TabsTrigger value="PUBLISHED" className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Published ({getTasksByStatus(selectedProject.id, 'PUBLISHED').length})
                      </TabsTrigger>
                    </TabsList>

                    {/* Task Content for each tab */}
                    {['TODO', 'IN_PROGRESS', 'TESTING', 'COMPLETED', 'ON_HOLD', 'PUBLISHED'].map(status => (
                      <TabsContent key={status} value={status} className="mt-6">
                        <div className="space-y-4">
                          {filteredTasks.length === 0 ? (
                            <div className="text-center py-8">
                              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No {status.toLowerCase().replace('_', ' ')} tasks</h3>
                              <p className="text-gray-600">Tasks will appear here when they match this status.</p>
                            </div>
                          ) : (
                            filteredTasks.map((task, index) => (
                              <Card key={task.id} className="card-hover animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center gap-3">
                                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                        <Badge className={getPriorityColor(task.priority)}>
                                          {task.priority}
                                        </Badge>
                                        <Badge variant="outline">
                                          Week {task.week.split('-W')[1]}
                                        </Badge>
                                      </div>
                                      
                                      <p className="text-sm text-gray-600">{task.description}</p>
                                      
                                      <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                          <User className="w-4 h-4" />
                                          <span>{task.assignee}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-4 h-4" />
                                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-4 h-4" />
                                          <span>{task.actualHours}h / {task.estimatedHours}h</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        {task.tags.map((tag, tagIndex) => (
                                          <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <select
                                        value={task.status}
                                        onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="TESTING">Testing</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="ON_HOLD">On Hold</option>
                                        <option value="PUBLISHED">Published</option>
                                      </select>
                                      <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Projects List View
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
        <PageHeader 
          title="Enhanced Projects" 
          subtitle="Manage and track your project progress"
        >
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Project
          </Button>
        </PageHeader>
        <div className="p-6">
          <div className="space-y-6 animate-fade-in">
            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="card-hover animate-scale-in cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-blue-600" />
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{project.teamMembers} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(project.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Tasks Summary */}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tasks</span>
                        <span className="font-medium">
                          {project.completedTasks}/{project.tasksCount}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
                </p>
                <Button className="flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Create New Project
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}