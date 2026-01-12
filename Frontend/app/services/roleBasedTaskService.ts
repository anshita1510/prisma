import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Task {
  id: number;
  title: string;
  description?: string;
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
    code?: string;
  };
  assignedTo?: {
    id: number;
    name: string;
    email: string;
  };
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  code?: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  progressPercentage: number;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  members: Array<{
    id: number;
    name: string;
    email: string;
    role: 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER';
  }>;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export const roleBasedTaskService = {
  // Get tasks based on user role
  async getTasks() {
    try {
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let endpoint = '/api/enhanced-tasks';
      
      // For employees, only get assigned tasks
      if (user.role === 'EMPLOYEE') {
        endpoint = `/api/enhanced-tasks/assigned/${user.id}`;
      }

      const response = await api.get(endpoint);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Get tasks error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch tasks'
      };
    }
  },

  // Get projects based on user role
  async getProjects() {
    try {
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let endpoint = '/api/enhanced-projects';
      
      // For employees, only get projects they are members of
      if (user.role === 'EMPLOYEE') {
        endpoint = `/api/enhanced-projects/member/${user.id}`;
      }

      const response = await api.get(endpoint);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Get projects error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch projects'
      };
    }
  },

  // Get task by ID (with role-based access control)
  async getTaskById(taskId: number) {
    try {
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await api.get(`/api/enhanced-tasks/${taskId}`);
      const task = response.data;

      // For employees, check if they are assigned to this task
      if (user.role === 'EMPLOYEE') {
        if (!task.assignedTo || task.assignedTo.id !== user.id) {
          throw new Error('Access denied: Task not assigned to you');
        }
      }

      return {
        success: true,
        data: task
      };
    } catch (error: any) {
      console.error('Get task error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch task'
      };
    }
  },

  // Update task status (employees can only update their assigned tasks)
  async updateTaskStatus(taskId: number, status: string, progressPercentage?: number) {
    try {
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First check if user has access to this task
      const taskResult = await this.getTaskById(taskId);
      if (!taskResult.success) {
        return taskResult;
      }

      const updateData: any = { status };
      if (progressPercentage !== undefined) {
        updateData.progressPercentage = progressPercentage;
      }

      // If task is completed, set completedAt
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date().toISOString();
        updateData.progressPercentage = 100;
      }

      const response = await api.put(`/api/enhanced-tasks/${taskId}`, updateData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Update task status error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update task status'
      };
    }
  },

  // Add time entry to task (employees can only add time to their assigned tasks)
  async addTimeEntry(taskId: number, timeEntry: {
    description?: string;
    startTime: string;
    endTime?: string;
    duration?: number;
  }) {
    try {
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First check if user has access to this task
      const taskResult = await this.getTaskById(taskId);
      if (!taskResult.success) {
        return taskResult;
      }

      const response = await api.post(`/api/enhanced-tasks/${taskId}/time-entries`, {
        ...timeEntry,
        employeeId: user.id
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Add time entry error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to add time entry'
      };
    }
  },

  // Add comment to task (employees can only comment on their assigned tasks)
  async addTaskComment(taskId: number, content: string) {
    try {
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First check if user has access to this task
      const taskResult = await this.getTaskById(taskId);
      if (!taskResult.success) {
        return taskResult;
      }

      const response = await api.post(`/api/enhanced-tasks/${taskId}/comments`, {
        content,
        authorId: user.id
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Add comment error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to add comment'
      };
    }
  },

  // Get task statistics for dashboard
  async getTaskStatistics() {
    try {
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let endpoint = '/api/enhanced-tasks/statistics';
      
      // For employees, only get statistics for their assigned tasks
      if (user.role === 'EMPLOYEE') {
        endpoint = `/api/enhanced-tasks/statistics/assigned/${user.id}`;
      }

      const response = await api.get(endpoint);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Get task statistics error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch task statistics'
      };
    }
  },

  // Check if user can create tasks (only admins and managers)
  canCreateTasks() {
    const user = authService.getStoredUser();
    return user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role);
  },

  // Check if user can create projects (only admins and managers)
  canCreateProjects() {
    const user = authService.getStoredUser();
    return user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role);
  },

  // Check if user can manage all tasks (only admins and managers)
  canManageAllTasks() {
    const user = authService.getStoredUser();
    return user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role);
  },

  // Check if user can view reports (only admins and managers)
  canViewReports() {
    const user = authService.getStoredUser();
    return user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role);
  }
};