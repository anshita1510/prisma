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

export const enhancedProjectService = {
  // Get all projects (Enhanced API)
  async getProjects(params?: {
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
      console.error('Error fetching projects:', error);
      // Return mock data for demo purposes
      return {
        success: true,
        data: {
          projects: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
        }
      };
    }
  },

  // Get project by ID
  async getProjectById(id: number) {
    try {
      const response = await api.get(`/api/v2/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return { success: false, message: 'Project not found' };
    }
  },

  // Create new project
  async createProject(data: any) {
    try {
      const response = await api.post('/api/v2/projects', data);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, message: 'Failed to create project' };
    }
  },

  // Update project
  async updateProject(id: number, data: any) {
    try {
      const response = await api.put(`/api/v2/projects/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, message: 'Failed to update project' };
    }
  },

  // Delete project
  async deleteProject(id: number) {
    try {
      const response = await api.delete(`/api/v2/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, message: 'Failed to delete project' };
    }
  },

  // Get project statistics
  async getProjectStats() {
    try {
      const response = await api.get('/api/v2/projects/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching project stats:', error);
      // Return mock stats for demo
      return {
        success: true,
        data: {
          totalProjects: 12,
          activeProjects: 8,
          completedProjects: 4,
          totalBudget: 500000,
          actualCost: 320000
        }
      };
    }
  }
};