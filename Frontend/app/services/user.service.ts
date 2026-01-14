// Frontend/app/services/user.service.ts
import api from '../../lib/axios';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
  checkIn?: string;
  checkOut?: string;
}

export interface LeaveRequest {
  startDate: string;
  endDate: string;
  reason: string;
  type: 'sick' | 'casual' | 'vacation';
}

export const userService = {
  // Attendance
  getAttendance: async (userId?: string): Promise<AttendanceRecord[]> => {
    try {
      const url = userId ? `/api/attendance/logs/${userId}` : '/api/attendance/my-logs';
      const response = await api.get<AttendanceRecord[]>(url);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch attendance' };
    }
  },

  markAttendance: async (data: { checkIn?: boolean; checkOut?: boolean }) => {
    try {
      const endpoint = data.checkIn ? '/api/attendance/my-check-in' : '/api/attendance/my-check-out';
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to mark attendance' };
    }
  },

  // Leave Management
  getLeaveRequests: async () => {
    try {
      const response = await api.get('/api/leaves');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch leave requests' };
    }
  },

  applyLeave: async (leaveData: LeaveRequest) => {
    try {
      const response = await api.post('/api/leaves', leaveData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to apply for leave' };
    }
  },

  cancelLeave: async (leaveId: string) => {
    try {
      const response = await api.delete(`/api/leaves/${leaveId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to cancel leave' };
    }
  },

  // Profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (data: any) => {
    try {
      const response = await api.put('/api/users/update', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },
};