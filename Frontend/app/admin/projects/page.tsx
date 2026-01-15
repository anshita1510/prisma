'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '../_components/Sidebar_A';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { CreateTaskModal } from '@/components/projects/CreateTaskModal';
import { projectService } from '@/app/services/projectService';
import { ProjectDetailView } from '@/components/projects/ProjectDetailView';
import { Loader, Plus, Search, Filter, FolderOpen, Users, Calendar, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ProjectType = 'standard' | 'enhanced';

interface UnifiedProject {
  id: number;
  name: string;
  description?: string;
  status: string;
  progressPercentage: number;
  type: ProjectType;
  members?: any[];
  tasks?: any[];
  _count?: { members?: number; tasks?: number };
  stats?: {
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
    teamMembersCount: number;
  };
  endDate?: string;
  dueDate?: string;
  owner?: any;
  department?: any;
}

export default function UnifiedProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'standard' | 'enhanced'>('all');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await projectService.getAllProjects();
      
      // Mark all projects as 'standard' for now
      // In the future, you can add a 'type' field to the database
      const unifiedProjects: UnifiedProject[] = (result.data || []).map((project: any) => ({
        ...project,
        type: 'standard' as ProjectType,
        // Normalize member count
        _count: {
          members: project.members?.length || project._count?.members || 0,
          tasks: project.tasks?.length || project._count?.tasks || 0,
        }
      }));
      
      setProjects(unifiedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectTasks = async (projectId: number) => {
    try {
      const result = await projectService.getProjectTasks(projectId);
      setTasks(result.data || []);
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
      try {
        await projectService.deleteProject(projectId);
        loadProjects();
        setSelectedProject(null);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await projectService.deleteTask(taskId);
        if (selectedProject) {
          loadProjectTasks(selectedProject.id);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      await projectService.updateTask(taskId, { status: newStatus as any });
      if (selectedProject) {
        loadProjectTasks(selectedProject.id);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleUpdateProjectStatus = async (projectId: number, newStatus: string) => {
    try {
      const result = await projectService.updateProject(projectId, { status: newStatus as any });
      if (result.success) {
        // Reload projects to reflect the change
        await loadProjects();
        // Update the selected project with new status
        if (selectedProject && selectedProject.id === projectId) {
          setSelectedProject({ ...selectedProject, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-blue-100 text-blue-800',
      'ON_HOLD': 'bg-yellow-100 text-yellow-800',
      'PLANNING': 'bg-purple-100 text-purple-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || project.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const projectCounts = {
    all: projects.length,
    standard: projects.filter(p => p.type === 'standard').length,
    enhanced: projects.filter(p => p.type === 'enhanced').length,
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <Sidebar />
        <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
          <div className="p-8 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="relative inline-block">
                <Loader className="w-12 h-12 animate-spin text-blue-600" />
                <div className="absolute inset-0 w-12 h-12 animate-ping text-blue-400 opacity-20">
                  <Loader className="w-12 h-12" />
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading projects...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Project Detail View
  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <Sidebar />
        <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
          <div className="p-8 animate-fade-in">
            <ProjectDetailView
              project={selectedProject as any}
              tasks={tasks}
              onBack={() => setSelectedProject(null)}
              onAddTask={() => setIsCreateTaskOpen(true)}
              onDeleteProject={handleDeleteProject}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateProjectStatus={handleUpdateProjectStatus}
            />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <Sidebar />
      <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
        <div className="p-8 max-w-[1600px] mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-8 animate-fade-in">
            <Button 
              variant="ghost" 
              className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 -ml-2 transition-all duration-200"
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                ADMIN PANEL <span className="text-gray-400 mx-2">•</span> <span className="text-blue-600">Projects</span>
              </h1>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                onClick={() => setIsCreateProjectOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Create New Project
              </Button>
            </div>
          </div>

          {/* Tab Buttons with Counts */}
          <div className="flex items-center gap-3 mb-8 animate-slide-up">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              className={`transition-all duration-300 ${
                activeTab === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/30' 
                  : 'hover:bg-gray-100 hover:border-blue-300'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Projects {projectCounts.all}
            </Button>
            <Button
              variant={activeTab === 'standard' ? 'default' : 'outline'}
              className={`transition-all duration-300 ${
                activeTab === 'standard' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/30' 
                  : 'hover:bg-gray-100 hover:border-blue-300'
              }`}
              onClick={() => setActiveTab('standard')}
            >
              Standard {projectCounts.standard}
            </Button>
            <Button
              variant={activeTab === 'enhanced' ? 'default' : 'outline'}
              className={`transition-all duration-300 ${
                activeTab === 'enhanced' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/30' 
                  : 'hover:bg-gray-100 hover:border-blue-300'
              }`}
              onClick={() => setActiveTab('enhanced')}
            >
              Enhanced {projectCounts.enhanced}
            </Button>
          </div>

          {/* Search and Filter Side by Side */}
          <div className="flex items-center gap-4 mb-8 animate-slide-up">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-300"
              />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-gray-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <Loader className="w-10 h-10 animate-spin text-blue-600" />
                <div className="absolute inset-0 w-10 h-10 animate-ping text-blue-400 opacity-20">
                  <Loader className="w-10 h-10" />
                </div>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
              </p>
              <Button 
                className="flex items-center gap-2 mx-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:scale-105"
                onClick={() => setIsCreateProjectOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Create New Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {filteredProjects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="group hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border border-gray-200 hover:border-blue-300 hover:-translate-y-2 animate-fade-in-up overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    setSelectedProject(project);
                    loadProjectTasks(project.id);
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
                  
                  <CardHeader className="pb-4 relative">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                        <FolderOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className={`${getStatusColor(project.status)} transition-all duration-300 group-hover:scale-105`}>
                            {project.status?.replace('_', ' ')}
                          </Badge>
                          {project.type === 'enhanced' && (
                            <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 transition-all duration-300 group-hover:scale-105">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Enhanced
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                          {project.name}
                        </CardTitle>
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{project.description}</p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4 relative">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-bold text-gray-900">
                          {project.stats?.progressPercentage || project.progressPercentage || 0}%
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${project.stats?.progressPercentage || project.progressPercentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 group/stat">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center group-hover/stat:bg-purple-100 transition-colors duration-300">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {project.stats?.teamMembersCount || project._count?.members || 0} members
                        </span>
                      </div>
                      <div className="flex items-center gap-2 group/stat">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center group-hover/stat:bg-green-100 transition-colors duration-300">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {project.stats?.completedTasks || 0}/{project.stats?.totalTasks || project._count?.tasks || 0} tasks
                        </span>
                      </div>
                    </div>

                    {/* Due Date */}
                    {(project.endDate || project.dueDate) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100">
                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="font-medium">
                          Due: {new Date(project.endDate || project.dueDate!).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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


