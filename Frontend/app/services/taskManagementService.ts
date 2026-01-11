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

export const taskManagementService = {
  // ========== BASIC TASK OPERATIONS ==========
  
  // Get all tasks (Basic API)
  async getTasks(params?: {
    page?: number;
    limit?: number;
    projectId?: number;
    assignedToId?: number;
    status?: string;
    priority?: string;
    isActive?: boolean;
  }) {
    try {
      const response = await api.get('/api/tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return { success: false, message: 'Failed to fetch tasks' };
    }
  },

  // Get my tasks (Basic API)
  async getMyTasks(status?: string) {
    try {
      const response = await api.get('/api/tasks/my-tasks', { 
        params: status ? { status } : undefined 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      return { success: false, message: 'Failed to fetch my tasks' };
    }
  },

  // Get task statistics (Basic API)
  async getTaskStats() {
    try {
      const response = await api.get('/api/tasks/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching task stats:', error);
      return { success: false, message: 'Failed to fetch task statistics' };
    }
  },

  // Create task (Basic API)
  async createTask(data: any) {
    try {
      const response = await api.post('/api/tasks', data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, message: 'Failed to create task' };
    }
  },

  // Update task (Basic API)
  async updateTask(id: number, data: any) {
    try {
      const response = await api.put(`/api/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, message: 'Failed to update task' };
    }
  },

  // Delete task (Basic API)
  async deleteTask(id: number) {
    try {
      const response = await api.delete(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, message: 'Failed to delete task' };
    }
  },

  // ========== ENHANCED TASK OPERATIONS ==========

  // Get all tasks (Enhanced API)
  async getEnhancedTasks(params?: {
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
      console.error('Error fetching enhanced tasks:', error);
      return { success: false, message: 'Failed to fetch enhanced tasks' };
    }
  },

  // Get my tasks (Enhanced API)
  async getMyEnhancedTasks(params?: {
    status?: string;
    priority?: string;
    projectId?: number;
  }) {
    try {
      const response = await api.get('/api/v2/tasks/my-tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching my enhanced tasks:', error);
      return { success: false, message: 'Failed to fetch my enhanced tasks' };
    }
  },

  // Get calendar view (Enhanced API)
  async getCalendarTasks(startDate: string, endDate: string, viewType?: string) {
    try {
      const response = await api.get('/api/v2/tasks/calendar', {
        params: { startDate, endDate, viewType }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar tasks:', error);
      return { success: false, message: 'Failed to fetch calendar tasks' };
    }
  },

  // Bulk update tasks (Enhanced API)
  async bulkUpdateTasks(data: any) {
    try {
      const response = await api.put('/api/v2/tasks/bulk-update', data);
      return response.data;
    } catch (error) {
      console.error('Error bulk updating tasks:', error);
      return { success: false, message: 'Failed to bulk update tasks' };
    }
  },

  // Create task dependency (Enhanced API)
  async createTaskDependency(data: any) {
    try {
      const response = await api.post('/api/v2/tasks/dependencies', data);
      return response.data;
    } catch (error) {
      console.error('Error creating task dependency:', error);
      return { success: false, message: 'Failed to create task dependency' };
    }
  },

  // Add task comment
  async addTaskComment(taskId: number, content: string) {
    try {
      const response = await api.post(`/api/v2/tasks/${taskId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error('Error adding task comment:', error);
      return { success: false, message: 'Failed to add task comment' };
    }
  },

  // Create time entry (Enhanced API)
  async createTimeEntry(taskId: number, data: any) {
    try {
      const response = await api.post(`/api/v2/tasks/${taskId}/time-entries`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating time entry:', error);
      return { success: false, message: 'Failed to create time entry' };
    }
  },

  // ========== PROJECT OPERATIONS ==========

  // Get all projects (Basic API)
  async getProjects(params?: {
    page?: number;
    limit?: number;
    departmentId?: number;
    ownerId?: number;
    isActive?: boolean;
  }) {
    try {
      const response = await api.get('/api/projects', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { success: false, message: 'Failed to fetch projects' };
    }
  },

  // Get all projects (Enhanced API)
  async getEnhancedProjects(params?: {
    page?: number;
    limit?: number;
    status?: string;
    departmentId?: number;
    search?: string;
  }) {
    try {
      const response = await api.get('/api/v2/projects', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching enhanced projects:', error);
      return { success: false, message: 'Failed to fetch enhanced projects' };
    }
  },

  // Create project (Enhanced API)
  async createProject(data: any) {
    try {
      const response = await api.post('/api/v2/projects', data);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, message: 'Failed to create project' };
    }
  },

  // ========== UTILITY FUNCTIONS ==========

  // Check API connectivity
  async checkApiConnectivity() {
    try {
      // Try to hit a simple endpoint
      const response = await api.get('/api/tasks/stats');
      return { connected: true, message: 'API is accessible' };
    } catch (error: any) {
      if (error.response?.status === 401) {
        return { connected: true, message: 'API is accessible (authentication required)' };
      }
      return { connected: false, message: 'API is not accessible' };
    }
  },

  // Get user info for context
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};