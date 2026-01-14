'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Sidebar from '../_components/sidebar_u';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle,
  Calendar,
  FolderOpen,
  User,
  TrendingUp
} from 'lucide-react';
import { projectService } from '@/app/services/projectService';
import { authService } from '@/app/services/authService';

interface Task {
  id: number;
  title: string;
  description?: string;
  code: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  progressPercentage: number;
  project: {
    id: number;
    name: string;
    code: string;
  };
  assignedTo?: {
    id: number;
    name: string;
    employeeCode: string;
  };
  createdBy: {
    id: number;
    name: string;
    employeeCode: string;
  };
}

export default function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    setUser(currentUser);
    if (currentUser) {
      loadMyTasks();
    }
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, activeTab]);

  const loadMyTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('User information not found. Please log in again.');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userStr);
      
      if (!userData.employeeId) {
        setError('Employee ID not found. Please contact administrator.');
        setLoading(false);
        return;
      }

      console.log('📥 Loading tasks for employee:', userData.employeeId);

      // First, get all projects where user is a member
      const projectsResult = await projectService.getAllProjects(userData.companyId);
      
      if (!projectsResult.success) {
        setError('Failed to load projects: ' + projectsResult.message);
        setLoading(false);
        return;
      }

      // Filter projects where user is a member
      const userProjects = projectsResult.data.filter((project: any) => 
        project.members?.some((member: any) => member.employeeId === userData.employeeId && member.isActive)
      );

      setProjects(userProjects);
      console.log('📊 User is member of', userProjects.length, 'projects');

      // Get tasks from all user's projects
      const allTasks: Task[] = [];
      
      for (const project of userProjects) {
        try {
          const tasksResult = await projectService.getProjectTasks(project.id);
          
          if (tasksResult.success && tasksResult.data) {
            // Filter tasks assigned to this user and ensure project data is included
            const userTasks = tasksResult.data
              .filter((task: any) => task.assignedTo?.id === userData.employeeId)
              .map((task: any) => ({
                ...task,
                // Ensure project data is included
                project: task.project || {
                  id: project.id,
                  name: project.name,
                  code: project.code
                }
              }));
            
            console.log(`✅ Found ${userTasks.length} tasks in project ${project.name}`);
            allTasks.push(...userTasks);
          }
        } catch (err) {
          console.error(`Error loading tasks for project ${project.id}:`, err);
        }
      }

      console.log('✅ Loaded', allTasks.length, 'tasks assigned to user');
      setTasks(allTasks);
      
      if (allTasks.length === 0 && userProjects.length === 0) {
        setError('You are not assigned to any projects yet. Contact your manager to get assigned to projects.');
      } else if (allTasks.length === 0) {
        setError('No tasks assigned to you yet.');
      }
    } catch (err: any) {
      console.error('❌ Error loading tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;
    
    switch (activeTab) {
      case 'todo':
        filtered = tasks.filter(task => task.status === 'TODO');
        break;
      case 'in-progress':
        filtered = tasks.filter(task => task.status === 'IN_PROGRESS');
        break;
      case 'in-review':
        filtered = tasks.filter(task => task.status === 'IN_REVIEW');
        break;
      case 'completed':
        filtered = tasks.filter(task => task.status === 'COMPLETED');
        break;
      default:
        filtered = tasks;
    }
    
    setFilteredTasks(filtered);
  };

  const getStatusBadge = (status: string) => {
    const colorClass = projectService.getStatusColor(status);
    return (
      <Badge className={`${colorClass} border-0`}>
        {status === 'TODO' && <Clock className="w-3 h-3 mr-1" />}
        {status === 'IN_PROGRESS' && <TrendingUp className="w-3 h-3 mr-1" />}
        {status === 'COMPLETED' && <CheckSquare className="w-3 h-3 mr-1" />}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colorClass = projectService.getPriorityColor(priority);
    return (
      <Badge className={`${colorClass} border-0`}>
        {priority}
      </Badge>
    );
  };

  const getTabCounts = () => {
    return {
      all: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      inReview: tasks.filter(t => t.status === 'IN_REVIEW').length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length
    };
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && filteredTasks.find(t => t.dueDate === dueDate)?.status !== 'COMPLETED';
  };

  const tabCounts = getTabCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-16 min-h-screen pt-16 lg:pt-0">
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
        {/* Page Header */}
        <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">View and manage your assigned tasks</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              EMPLOYEE
            </span>
            <span className="text-sm text-gray-500">{tasks.length} tasks assigned</span>
          </div>
        </div>
        
        {/* Tasks Content */}
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {error && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-orange-600">{tabCounts.inProgress}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{tabCounts.completed}</p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Projects</p>
                    <p className="text-2xl font-bold text-purple-600">{projects.length}</p>
                  </div>
                  <FolderOpen className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
              <TabsTrigger value="todo">To Do ({tabCounts.todo})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({tabCounts.inProgress})</TabsTrigger>
              <TabsTrigger value="in-review">In Review ({tabCounts.inReview})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({tabCounts.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    My Tasks
                  </CardTitle>
                  <CardDescription>
                    {activeTab === 'all' && 'All your assigned tasks'}
                    {activeTab === 'todo' && 'Tasks waiting to be started'}
                    {activeTab === 'in-progress' && 'Tasks you are currently working on'}
                    {activeTab === 'in-review' && 'Tasks pending review'}
                    {activeTab === 'completed' && 'Your completed tasks'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {activeTab === 'all' ? 'No tasks assigned to you yet' : `No ${activeTab.replace('-', ' ')} tasks`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
                        <div 
                          key={task.id} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium text-lg text-gray-900">{task.title}</h3>
                                {getStatusBadge(task.status)}
                                {getPriorityBadge(task.priority)}
                                {isOverdue(task.dueDate) && (
                                  <Badge className="bg-red-100 text-red-800 border-0">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                              
                              {task.description && (
                                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                {task.project && (
                                  <div className="flex items-center gap-2">
                                    <FolderOpen className="w-4 h-4" />
                                    <span>{task.project.name}</span>
                                  </div>
                                )}
                                
                                {task.dueDate && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                
                                {task.createdBy && (
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>Created by: {task.createdBy.name}</span>
                                  </div>
                                )}
                              </div>

                              {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
                                <div className="mt-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-medium">{task.progressPercentage}%</span>
                                  </div>
                                  <Progress value={task.progressPercentage} className="h-2" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="text-xs text-gray-500">
                              {task.code ? `Task Code: ${task.code}` : 'No task code'}
                            </div>
                            {task.estimatedHours && (
                              <div className="text-xs text-gray-500">
                                Estimated: {task.estimatedHours}h
                                {task.actualHours && ` | Actual: ${task.actualHours}h`}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
