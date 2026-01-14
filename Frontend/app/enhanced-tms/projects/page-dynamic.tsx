'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Sidebar from '../../admin/_components/Sidebar_A';
import PageHeader from '../../admin/_components/PageHeader';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { CreateTaskModal } from '../../../components/tasks/CreateTaskModal';
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
  Trash2,
  Loader
} from 'lucide-react';
import { dynamicProjectService, Project, Task } from '@/app/services/dynamicProjectService';

export default function DynamicProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('TODO');
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Load user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
  }, []);

  // Load projects
  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  // Load tasks when project is selected
  useEffect(() => {
    if (selectedProject) {
      loadProjectTasks(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await dynamicProjectService.getAllProjects({
        companyId: user?.companyId
      });
      
      if (result.success) {
        setProjects(result.data);
      } else {
        console.error('Failed to load projects:', result.message);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectTasks = async (projectId: number) => {
    try {
      const result = await dynamicProjectService.getProjectTasks(projectId);
      
      if (result.success) {
        setTasks(result.data);
      } else {
        console.error('Failed to load tasks:', result.message);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleProjectCreated = () => {
    loadProjects();
    setIsCreateProjectOpen(false);
  };

  const handleTaskCreated = () => {
    if (selectedProject) {
      loadProjectTasks(selectedProject.id);
    }
    setIsCreateTaskOpen(false);
  };

  const handleDeleteProject = async (projectId: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const result = await dynamicProjectService.deleteProject(projectId);
      if (result.success) {
        loadProjects();
        setSelectedProject(null);
      } else {
        alert('Failed to delete project: ' + result.message);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      const result = await dynamicProjectService.deleteTask(taskId);
      if (result.success) {
        if (selectedProject) {
          loadProjectTasks(selectedProject.id);
        }
      } else {
        alert('Failed to delete task: ' + result.message);
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    const result = await dynamicProjectService.updateTask(taskId, { status: newStatus });
    if (result.success) {
      if (selectedProject) {
        loadProjectTasks(selectedProject.id);
      }
    } else {
      alert('Failed to update task: ' + result.message);
    }
  };

  const getProjectTasks = (projectId: number) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByStatus = (projectId: string, status: Task['status']) => {
    return getProjectTasks(parseInt(projectId)).filter(task => task.status === status);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
          <PageHeader title="Projects" subtitle="Manage and track your project progress" />
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Project Detail View
  if (selectedProject) {
    const projectTasks = getProjectTasks(selectedProject.id);
    const filteredTasks = projectTasks.filter(task => task.status === activeTab as Task['status']);

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
            <div className="space-y-6">
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
                      <Badge className={dynamicProjectService.getStatusColor(selectedProject.status)}>
                        {selectedProject.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => handleDeleteProject(selectedProject.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>

                {/* Project Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Target className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">{selectedProject.progressPercentage}%</p>
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
                          <p className="text-2xl font-bold">{projectTasks.length}</p>
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
                          <p className="text-2xl font-bold">{selectedProject._count?.members || 0}</p>
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
                          <p className="text-2xl font-bold">${(selectedProject.actualCost || 0) / 1000}</p>
                          <p className="text-sm text-gray-600">Cost Used</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Project Manager</h3>
                    <p className="text-gray-600">{selectedProject.owner?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Department</h3>
                    <p className="text-gray-600">{selectedProject.department?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                    <p className="text-gray-600">
                      {selectedProject.startDate ? dynamicProjectService.formatDate(selectedProject.startDate) : 'N/A'} - {selectedProject.endDate ? dynamicProjectService.formatDate(selectedProject.endDate) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Task Management Section */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Task Management</h2>
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => setIsCreateTaskOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Task
                    </Button>
                  </div>

                  {/* Task Status Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="TODO" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        To Do ({getTasksByStatus(selectedProject.id.toString(), 'TODO').length})
                      </TabsTrigger>
                      <TabsTrigger value="IN_PROGRESS" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        In Progress ({getTasksByStatus(selectedProject.id.toString(), 'IN_PROGRESS').length})
                      </TabsTrigger>
                      <TabsTrigger value="IN_REVIEW" className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        In Review ({getTasksByStatus(selectedProject.id.toString(), 'IN_REVIEW').length})
                      </TabsTrigger>
                      <TabsTrigger value="COMPLETED" className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Completed ({getTasksByStatus(selectedProject.id.toString(), 'COMPLETED').length})
                      </TabsTrigger>
                      <TabsTrigger value="CANCELLED" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Cancelled ({getTasksByStatus(selectedProject.id.toString(), 'CANCELLED').length})
                      </TabsTrigger>
                    </TabsList>

                    {/* Task Content for each tab */}
                    {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED'].map(status => (
                      <TabsContent key={status} value={status} className="mt-6">
                        <div className="space-y-4">
                          {filteredTasks.length === 0 ? (
                            <div className="text-center py-8">
                              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No {status.toLowerCase().replace('_', ' ')} tasks</h3>
                              <p className="text-gray-600">Tasks will appear here when they match this status.</p>
                            </div>
                          ) : (
                            filteredTasks.map((task) => (
                              <Card key={task.id} className="card-hover">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center gap-3">
                                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                        <Badge className={dynamicProjectService.getPriorityColor(task.priority)}>
                                          {task.priority}
                                        </Badge>
                                      </div>
                                      
                                      <p className="text-sm text-gray-600">{task.description}</p>
                                      
                                      <div className="flex items-center gap-6 text-sm text-gray-500">
                                        {task.assignedTo && (
                                          <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>{task.assignedTo.name}</span>
                                          </div>
                                        )}
                                        {task.dueDate && (
                                          <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{dynamicProjectService.formatDate(task.dueDate)}</span>
                                          </div>
                                        )}
                                        {task.estimatedHours && (
                                          <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{task.actualHours || 0}h / {task.estimatedHours}h</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <select
                                        value={task.status}
                                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as Task['status'])}
                                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="IN_REVIEW">In Review</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                      </select>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleDeleteTask(task.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
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

        <CreateTaskModal 
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          onSuccess={handleTaskCreated}
          projectId={selectedProject.id}
        />
      </div>
    );
  }

  // Projects List View
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
        <PageHeader 
          title="Projects" 
          subtitle="Manage and track your project progress"
        >
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsCreateProjectOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create New Project
          </Button>
        </PageHeader>
        <div className="p-6">
          <div className="space-y-6">
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
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="card-hover cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-5 h-5 text-blue-600" />
                          <Badge className={dynamicProjectService.getStatusColor(project.status)}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
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
                          <span className="font-medium">{project.progressPercentage}%</span>
                        </div>
                        <Progress value={project.progressPercentage} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{project._count?.members || 0} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {project.endDate ? dynamicProjectService.formatDate(project.endDate) : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Tasks Summary */}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tasks</span>
                          <span className="font-medium">
                            {project._count?.tasks || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
                </p>
                <Button 
                  className="flex items-center gap-2 mx-auto"
                  onClick={() => setIsCreateProjectOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Create New Project
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateProjectModal 
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
}
