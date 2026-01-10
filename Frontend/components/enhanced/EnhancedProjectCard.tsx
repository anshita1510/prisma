'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  MoreHorizontal, 
  Target,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EnhancedProject {
  id: number;
  name: string;
  description?: string;
  code?: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  progressPercentage: number;
  owner: {
    id: number;
    name: string;
    designation: string;
  };
  department: {
    id: number;
    name: string;
  };
  members: Array<{
    id: number;
    name: string;
    designation: string;
  }>;
  milestones: Array<{
    id: number;
    name: string;
    dueDate: string;
    isCompleted: boolean;
  }>;
  _count: {
    tasks: number;
    milestones: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface EnhancedProjectCardProps {
  project: EnhancedProject;
  onEdit?: (project: EnhancedProject) => void;
  onDelete?: (project: EnhancedProject) => void;
  onView?: (project: EnhancedProject) => void;
  onManageMembers?: (project: EnhancedProject) => void;
  userRole?: string;
  userDesignation?: string;
}

export function EnhancedProjectCard({ 
  project, 
  onEdit, 
  onDelete, 
  onView, 
  onManageMembers,
  userRole,
  userDesignation
}: EnhancedProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'bg-blue-100 text-blue-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const completedMilestones = project.milestones.filter(m => m.isCompleted).length;
  const budgetUsagePercentage = project.budget && project.actualCost 
    ? (project.actualCost / project.budget) * 100 
    : 0;

  const canManage = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || 
                   userDesignation === 'TECH_LEAD' || userDesignation === 'MANAGER';

  const isOverBudget = project.budget && project.actualCost && project.actualCost > project.budget;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold truncate flex items-center gap-2">
            {project.name}
            {project.code && (
              <Badge variant="outline" className="text-xs">
                {project.code}
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">{project.department.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(project.status)}>
            {project.status.replace('_', ' ')}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(project)}>
                  View Details
                </DropdownMenuItem>
              )}
              {onManageMembers && canManage && (
                <DropdownMenuItem onClick={() => onManageMembers(project)}>
                  Manage Members
                </DropdownMenuItem>
              )}
              {onEdit && canManage && (
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  Edit Project
                </DropdownMenuItem>
              )}
              {onDelete && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
                <DropdownMenuItem 
                  onClick={() => onDelete(project)}
                  className="text-red-600"
                >
                  Delete Project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold">{project.progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progressPercentage)}`}
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{project.members.length + 1} members</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{project._count.tasks} tasks</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {completedMilestones}/{project._count.milestones} milestones
            </span>
          </div>
          {project.endDate && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Due {formatDate(project.endDate)}</span>
            </div>
          )}
        </div>

        {/* Budget Information */}
        {project.budget && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Budget</span>
              </div>
              {isOverBudget && (
                <Badge variant="destructive" className="text-xs">
                  Over Budget
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Allocated:</span>
                <span className="font-medium">{formatCurrency(project.budget)}</span>
              </div>
              {project.actualCost && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent:</span>
                  <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(project.actualCost)}
                  </span>
                </div>
              )}
              {budgetUsagePercentage > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Information */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Project Owner</p>
              <p className="text-sm font-medium">{project.owner.name}</p>
              <p className="text-xs text-gray-400">{project.owner.designation}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm font-medium">{formatDate(project.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView?.(project)}
          >
            <Clock className="h-3 w-3 mr-1" />
            View Tasks
          </Button>
          {canManage && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit?.(project)}
            >
              Manage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}