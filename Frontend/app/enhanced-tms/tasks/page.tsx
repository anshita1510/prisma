'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '../../admin/_components/Sidebar_A';
import PageHeader from '../../admin/_components/PageHeader';
import { CreateTaskModal } from '@/components/projects/CreateTaskModal';
import { dynamicProjectService } from '@/app/services/dynamicProjectService';
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  MoreVertical,
  AlertCircle
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  startDate?: string;
  assignedTo?: {
    id: number;
    name: string;
  };
  project?: {
    id: number;
    name: string;
  };
  tags?: string[];
  estimatedHours?: number;
  progressPercentage?: number;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setDebugInfo('Loading projects...');
    try {
      // Get all projects first
      console.log('🔍 Fetching all projects...');
      const projectsResult = await dynamicProjectService.getAllProjects();
      
      console.log('📊 Projects result:', projectsResult);
      
      if (projectsResult.success && projectsResult.data && projectsResult.data.length > 0) {
        console.log('✅ Found projects:', projectsResult.data.length);
        setProjects(projectsResult.data);
        setSelectedProjectId(projectsResult.data[0].id);
        setDebugInfo(`Found ${projectsResult.data.length} projects. Fetching tasks...`);
        
        // Fetch tasks from all projects
        const allTasks: Task[] = [];
        
        for (const project of projectsResult.data) {
          console.log(`📋 Fetching tasks for project ${project.id}...`);
          const tasksResult = await dynamicProjectService.getProjectTasks(project.id);
          console.log(`📋 Tasks result for project ${project.id}:`, tasksResult);
          
          if (tasksResult.success && tasksResult.data) {
            console.log(`✅ Found ${tasksResult.data.length} tasks in project ${project.id}`);
            const projectTasks = tasksResult.data.map((task: any) => ({
              id: task.id,
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              dueDate: task.dueDate,
              assignedTo: task.assignedTo,
              project: { id: project.id, name: project.name },
              tags: task.tags || []
            }));
            allTasks.push(...projectTasks);
          }
        }
        
        setTasks(allTasks);
        setDebugInfo(`✅ Loaded ${allTasks.length} total tasks`);
        console.log('✅ Tasks loaded:', allTasks.length);
      } else {
        console.warn('⚠️ No projects found or API error');
        setDebugInfo('No projects found. Create a project first to add tasks.');
        setTasks([]);
        setProjects([]);
      }
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Task['status'], dueDate?: string) => {
    // Check if overdue
    if (dueDate && status !== 'COMPLETED' && status !== 'CANCELLED') {
      const due = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (due < today) {
        return 'bg-red-100 text-red-800';
      }
    }

    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'IN_REVIEW':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
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

  const isOverdue = (dueDate?: string, status?: Task['status']) => {
    if (!dueDate || status === 'COMPLETED' || status === 'CANCELLED') {
      return false;
    }
    return new Date(dueDate) < new Date();
  };

  const handleTaskCreated = () => {
    // Reload tasks after creation
    console.log('📝 Task created, reloading tasks...');
    loadTasks();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
          <PageHeader title="Enhanced Tasks" subtitle="Manage and track your team's tasks" />
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

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
        <PageHeader 
          title="Enhanced Tasks" 
          subtitle="Manage and track your team's tasks"
        >
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsCreateTaskOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create New Task
          </Button>
        </PageHeader>
        <div className="p-6">
          <div className="space-y-6 animate-fade-in">
            {/* Debug Info */}
            {debugInfo && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{debugInfo}</p>
              </div>
            )}

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <Card
                key={task.id}
                className="card-hover animate-scale-in cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Title and Status */}
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <Badge className={getStatusColor(task.status, task.dueDate)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {isOverdue(task.dueDate, task.status) && (
                          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm">{task.description}</p>

                      {/* Meta Information */}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{task.assignedTo?.name || 'Unassigned'}</span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{task.project?.name || 'No Project'}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2">
                        {task.tags && task.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first task'
                }
              </p>
              <Button 
                className="flex items-center gap-2 mx-auto"
                onClick={() => setIsCreateTaskOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Create New Task
              </Button>
            </div>
          )}
          </div>
        </div>

        <CreateTaskModal 
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          onSuccess={handleTaskCreated}
          projectId={selectedProjectId}
          projectName={projects.find(p => p.id === selectedProjectId)?.name || 'Tasks'}
        />
      </main>
    </div>
  );
}