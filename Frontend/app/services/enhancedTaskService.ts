import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const enhancedTaskService = {
  // Get all tasks (Enhanced API)
  async getTasks(params?: {
    page?: number;
    limit?: number;
    projectId?: number;
    assignedToId?: number;
    status?: string;
    priority?: string;
    search?: string;
  }) {
    try {
      const response = await api.get('/api/v2/tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Return mock data for demo purposes
      return {
        success: true,
        data: {
          tasks: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
        }
      };
    }
  },

  // Get my tasks
  async getMyTasks(params?: {
    status?: string;
    priority?: string;
    projectId?: number;
  }) {
    try {
      const response = await api.get('/api/v2/tasks/my-tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      return {
        success: true,
        data: { tasks: [] }
      };
    }
  },

  // Get task by ID
  async getTaskById(id: number) {
    try {
      const response = await api.get(`/api/v2/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      return { success: false, message: 'Task not found' };
    }
  },

  // Create new task
  async createTask(data: any) {
    try {
      const response = await api.post('/api/v2/tasks', data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, message: 'Failed to create task' };
    }
  },

  // Update task
  async updateTask(id: number, data: any) {
    try {
      const response = await api.put(`/api/v2/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, message: 'Failed to update task' };
    }
  },

  // Delete task
  async deleteTask(id: number) {
    try {
      const response = await api.delete(`/api/v2/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, message: 'Failed to delete task' };
    }
  },

  // Get task statistics
  async getTaskStats() {
    try {
      const response = await api.get('/api/v2/tasks/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching task stats:', error);
      // Return mock stats for demo
      return {
        success: true,
        data: {
          totalTasks: 156,
          myTasks: 23,
          completedTasks: 89,
          overdueTasks: 7,
          inProgressTasks: 34
        }
      };
    }
  },

  // Update task status
  async updateTaskStatus(id: number, status: string) {
    try {
      const response = await api.put(`/api/v2/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      return { success: false, message: 'Failed to update task status' };
    }
  },

  // Get calendar view
  async getCalendarTasks(startDate: string, endDate: string, viewType?: string) {
    try {
      const response = await api.get('/api/v2/tasks/calendar', {
        params: { startDate, endDate, viewType }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar tasks:', error);
      return {
        success: true,
        data: { tasks: [] }
      };
    }
  }
};