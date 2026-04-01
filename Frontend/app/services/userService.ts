import api from '@/lib/axios';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/users`,
  timeout: 10000,
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  designation: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  employeeCode?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  designation: string;
  role: string;
  status: string;
  isActive: boolean;
  employeeCode?: string;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  // Create/Invite new user
  async createUser(userData: CreateUserData) {
    try {
      console.log('🚀 Sending request to: /create-user');
      console.log('Payload:', JSON.stringify(userData, null, 2));

      const response = await API.post('/create-user', userData);
      console.log('✅ Success:', response.data);

      return {
        success: true,
        message: response.data.message,
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ API ERROR:', error);
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.error || error.response.data?.message || 'Server error'
        };
      }
      return {
        success: false,
        message: error.code === 'ECONNABORTED'
          ? 'Request timed out. Please check the server is running.'
          : 'Network error - backend not reachable'
      };
    }
  },

  // Get all users (for admin)
  async getUsers() {
    try {
      const response = await API.get('/');
      return {
        success: true,
        data: response.data.users || []
      };
    } catch (error: any) {
      console.error('Get users error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch users',
        data: []
      };
    }
  },

  // Update user credentials
  async updateUser(userId: number, userData: Partial<CreateUserData>) {
    try {
      const response = await API.put(`/update/${userId}`, userData);
      return {
        success: true,
        message: response.data.message,
        data: response.data.user
      };
    } catch (error: any) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update user'
      };
    }
  },

  // Update user password
  async updatePassword(userId: number, newPassword: string) {
    try {
      const response = await API.post(`/${userId}/update-password`, { newPassword });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Update password error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update password'
      };
    }
  }
};