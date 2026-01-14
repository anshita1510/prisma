'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Calendar,
  Users,
  User,
  Building2,
  Target,
  TrendingUp,
  Clock,
  CheckSquare,
  Activity,
  AlertCircle,
  Trash2,
  Mail,
  Briefcase,
  Plus
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: any;
  tasks: any[];
  onBack: () => void;
  onAddTask: () => void;
  onDeleteProject: (projectId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onUpdateTaskStatus: (taskId: number, status: string) => void;
}

export function ProjectDetailView({
  project,
  tasks,
  onBack,
  onAddTask,
  onDeleteProject,
  onDeleteTask,
  onUpdateTaskStatus
}: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState('TODO');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-blue-100 text-blue-800',
      'ON_HOLD': 'bg-yellow-100 text-yellow-800',
      'PLANNING': 'bg-purple-100 text-purple-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'TODO': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'IN_REVIEW': 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority?: string) => {
    const colors: Record<string, string> = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800',
    };
    return colors[priority || ''] || 'bg-gray-100 text-gray-800';
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (endDate: string) => {
    if (!endDate) return 'N/A';
    const today = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days` : 'Overdue';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Button>

      {/* Project Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <p className="text-blue-100 mt-1">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Badge className="bg-white/20 text-white border-white/30">
                {project.status?.replace('_', ' ')}
              </Badge>
              {project.progressPercentage && (
                <Badge className="bg-white/20 text-white border-white/30">
                  {project.progressPercentage}% Complete
                </Badge>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
            onClick={() => onDeleteProject(project.id)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{project.progressPercentage || 0}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
            <Progress value={project.progressPercentage || 0} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{project._count?.tasks || 0}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Team Members</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{project._count?.members || 0}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Days Remaining</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{calculateDaysRemaining(project.endDate)}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Project Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Information */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Department</p>
                  <p className="text-gray-900 font-semibold">{project.department?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Company</p>
                  <p className="text-gray-900 font-semibold">{project.company?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Project Code</p>
                  <Badge variant="outline">{project.code || 'N/A'}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Status</p>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Information */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Start Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 font-semibold">{formatDate(project.startDate)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">End Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 font-semibold">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Manager */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Project Manager
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{project.owner?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{project.owner?.designation || 'Manager'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Team Members */}
        <div>
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Team Members ({project._count?.members || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {project.projectRoles && project.projectRoles.length > 0 ? (
                <div className="space-y-3">
                  {project.projectRoles.map((member: any) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.employee?.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No team members assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Management Section */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Task Management
            </CardTitle>
            <Button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={onAddTask}
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Task Status Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="TODO" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">To Do</span>
                <Badge variant="secondary" className="ml-1">{getTasksByStatus('TODO').length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="IN_PROGRESS" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">In Progress</span>
                <Badge variant="secondary" className="ml-1">{getTasksByStatus('IN_PROGRESS').length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="IN_REVIEW" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="hidden sm:inline">In Review</span>
                <Badge variant="secondary" className="ml-1">{getTasksByStatus('IN_REVIEW').length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="COMPLETED" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Completed</span>
                <Badge variant="secondary" className="ml-1">{getTasksByStatus('COMPLETED').length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="CANCELLED" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Cancelled</span>
                <Badge variant="secondary" className="ml-1">{getTasksByStatus('CANCELLED').length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Task Content for each tab */}
            {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED'].map(status => {
              const filteredTasks = getTasksByStatus(status);
              return (
                <TabsContent key={status} value={status} className="mt-0">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No {status.toLowerCase().replace('_', ' ')} tasks</h3>
                      <p className="text-gray-600">Tasks will appear here when they match this status.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                
                                <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                                  {task.assignedTo && (
                                    <div className="flex items-center gap-2">
                                      <User className="w-4 h-4" />
                                      <span>{task.assignedTo.name}</span>
                                    </div>
                                  )}
                                  {task.dueDate && (
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      <span>{formatDate(task.dueDate)}</span>
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
                              
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <select
                                  value={task.status || 'TODO'}
                                  onChange={(e) => onUpdateTaskStatus(task.id, e.target.value)}
                                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                  onClick={() => onDeleteTask(task.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
