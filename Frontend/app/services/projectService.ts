import axios from 'axios';
import { Project, CreateProjectData, UpdateProjectData } from '../types/project';

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

export const projectService = {
  // Get all projects
  async getProjects(params?: {
    page?: number;
    limit?: number;
    departmentId?: number;
    ownerId?: number;
    isActive?: boolean;
  }) {
    const response = await api.get('/api/projects', { params });
    return response.data;
  },

  // Get project by ID
  async getProjectById(id: number) {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  // Create new project
  async createProject(data: CreateProjectData) {
    const response = await api.post('/api/projects', data);
    return response.data;
  },

  // Update project
  async updateProject(id: number, data: UpdateProjectData) {
    const response = await api.put(`/api/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  async deleteProject(id: number) {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },

  // Get project members
  async getProjectMembers(id: number) {
    const response = await api.get(`/api/projects/${id}/members`);
    return response.data;
  }
};