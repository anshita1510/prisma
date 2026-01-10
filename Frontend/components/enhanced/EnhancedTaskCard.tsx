'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Link as LinkIcon,
  Paperclip
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EnhancedTask {
  id: number;
  title: string;
  description?: string;
  code?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  progressPercentage: number;
  assignedTo?: {
    id: number;
    name: string;
    designation: string;
  };
  createdBy: {
    id: number;
    name: string;
    designation: string;
  };
  project: {
    id: number;
    name: string;
  };
  milestone?: {
    id: number;
    name: string;
  };
  parentTask?: {
    id: number;
    title: string;
  };
  subTasks: Array<{
    id: number;
    title: string;
    status: string;
  }>;
  dependencies: Array<{
    predecessorTask: {
      id: number;
      title: string;
      status: string;
    };
  }>;
  _count: {
    comments: number;
    timeEntries: number;
    attachments: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface EnhancedTaskCardProps {
  task: EnhancedTask;
  onEdit?: (task: EnhancedTask) => void;
  onDelete?: (task: EnhancedTask) => void;
  onView?: (task: EnhancedTask) => void;
  onStatusChange?: (task: EnhancedTask, status: EnhancedTask['status']) => void;
  onStartTimer?: (task: EnhancedTask) => void;
  onStopTimer?: (task: EnhancedTask) => void;
  userRole?: string;
  currentUserId?: number;
}

export function EnhancedTaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onView, 
  onStatusChange,
  onStartTimer,
  onStopTimer,
  userRole,
  currentUserId
}: EnhancedTaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
  const isAssignedToUser = task.assignedTo?.id === currentUserId;
  const isCreatedByUser = task.createdBy.id === currentUserId;
  const canEdit = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || isAssignedToUser || isCreatedByUser;

  const blockedDependencies = task.dependencies.filter(dep => dep.predecessorTask.status !== 'COMPLETED');
  const isBlocked = blockedDependencies.length > 0;

  const completedSubTasks = task.subTasks.filter(sub => sub.status === 'COMPLETED').length;

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${
      isOverdue ? 'border-l-4 border-l-red-500' : 
      task.priority === 'URGENT' ? 'border-l-4 border-l-orange-500' :
      'border-l-4 border-l-blue-500'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="truncate">{task.title}</span>
            {task.code && (
              <Badge variant="outline" className="text-xs">
                {task.code}
              </Badge>
            )}
            {isBlocked && (
              <span title="Task is blocked by dependencies">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">{task.project.name}</span>
            {task.milestone && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-blue-600">{task.milestone.name}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          <Badge className={getStatusColor(task.status)}>
            {task.status.replace('_', ' ')}
          </Badge>
          {isOverdue && (
            <Badge variant="destructive">Overdue</Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(task)}>
                  View Details
                </DropdownMenuItem>
              )}
              {onStatusChange && canEdit && (
                <>
                  <DropdownMenuItem onClick={() => onStatusChange(task, 'TODO')}>
                    Mark as Todo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(task, 'IN_PROGRESS')}>
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(task, 'IN_REVIEW')}>
                    Mark as In Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(task, 'COMPLETED')}>
                    Mark as Completed
                  </DropdownMenuItem>
                </>
              )}
              {onEdit && canEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  Edit Task
                </DropdownMenuItem>
              )}
              {onDelete && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || isCreatedByUser) && (
                <DropdownMenuItem 
                  onClick={() => onDelete(task)}
                  className="text-red-600"
                >
                  Delete Task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold">{task.progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(task.progressPercentage)}`}
              style={{ width: `${task.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Task Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {task.assignedTo && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-600 truncate">{task.assignedTo.name}</p>
                <p className="text-xs text-gray-400">{task.assignedTo.designation}</p>
              </div>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className={`text-gray-600 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                  {formatDate(task.dueDate)}
                </p>
                <p className="text-xs text-gray-400">Due date</p>
              </div>
            </div>
          )}
          {(task.estimatedHours || task.actualHours) && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-600">
                  {task.actualHours || 0}h / {task.estimatedHours || 0}h
                </p>
                <p className="text-xs text-gray-400">Actual / Estimated</p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-600">
                {task._count.comments} comments
              </p>
              <p className="text-xs text-gray-400">
                {task._count.attachments} attachments
              </p>
            </div>
          </div>
        </div>

        {/* Dependencies and Sub-tasks */}
        {(task.dependencies.length > 0 || task.subTasks.length > 0) && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            {task.dependencies.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <LinkIcon className="h-3 w-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">Dependencies</span>
                </div>
                <div className="space-y-1">
                  {task.dependencies.slice(0, 2).map((dep) => (
                    <div key={dep.predecessorTask.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate">{dep.predecessorTask.title}</span>
                      <Badge 
                        className={`text-xs ${getStatusColor(dep.predecessorTask.status)}`}
                      >
                        {dep.predecessorTask.status}
                      </Badge>
                    </div>
                  ))}
                  {task.dependencies.length > 2 && (
                    <p className="text-xs text-gray-500">+{task.dependencies.length - 2} more</p>
                  )}
                </div>
              </div>
            )}
            
            {task.subTasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-700">Sub-tasks</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {completedSubTasks}/{task.subTasks.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full"
                    style={{ width: `${(completedSubTasks / task.subTasks.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Parent Task */}
        {task.parentTask && (
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-700">
                Sub-task of: {task.parentTask.title}
              </span>
            </div>
          </div>
        )}

        {/* Time Tracking Actions */}
        {isAssignedToUser && task.status === 'IN_PROGRESS' && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onStartTimer?.(task)}
            >
              <PlayCircle className="h-3 w-3 mr-1" />
              Start Timer
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onStopTimer?.(task)}
            >
              <PauseCircle className="h-3 w-3 mr-1" />
              Stop Timer
            </Button>
          </div>
        )}

        {/* Task Footer */}
        <div className="pt-3 border-t flex items-center justify-between text-xs text-gray-500">
          <div>
            Created by {task.createdBy.name}
          </div>
          <div>
            {task.completedAt ? (
              <span className="text-green-600">
                Completed {formatDate(task.completedAt)}
              </span>
            ) : (
              <span>
                Updated {formatDate(task.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}