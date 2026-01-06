// Frontend/app/services/adminService.ts
import api from '../../lib/axios';

export const adminService = {
  // User Management
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  createUser: async (userData: any) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },

  updateUser: async (userId: string, userData: any) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  // Attendance Management
  getAllAttendance: async (filters?: { date?: string; userId?: string }) => {
    try {
      const response = await api.get('/admin/attendance', { params: filters });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch attendance' };
    }
  },

  // Leave Management
  getPendingLeaves: async () => {
    try {
      const response = await api.get('/admin/leaves/pending');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch pending leaves' };
    }
  },

  approveLeave: async (leaveId: string) => {
    try {
      const response = await api.put(`/admin/leaves/${leaveId}/approve`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to approve leave' };
    }
  },

  rejectLeave: async (leaveId: string, reason?: string) => {
    try {
      const response = await api.put(`/admin/leaves/${leaveId}/reject`, { reason });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to reject leave' };
    }
  },
};