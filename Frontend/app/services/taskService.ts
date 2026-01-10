import axios from 'axios';
import { Task, CreateTaskData, UpdateTaskData, TaskStats } from '../types/project';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004/api';

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

export const taskService = {
  // Get all tasks
  async getTasks(params?: {
    page?: number;
    limit?: number;
    projectId?: number;
    assignedToId?: number;
    status?: string;
    priority?: string;
    isActive?: boolean;
  }) {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get task by ID
  async getTaskById(id: number) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  async createTask(data: CreateTaskData) {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // Update task
  async updateTask(id: number, data: UpdateTaskData) {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  // Delete task
  async deleteTask(id: number) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get my tasks
  async getMyTasks(status?: string) {
    const response = await api.get('/tasks/my-tasks', { 
      params: status ? { status } : undefined 
    });
    return response.data;
  },

  // Get task statistics
  async getTaskStats(): Promise<{ success: boolean; data: TaskStats }> {
    const response = await api.get('/tasks/stats');
    return response.data;
  },

  // Add comment to task
  async addTaskComment(taskId: number, content: string) {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  }
};