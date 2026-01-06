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
      const url = userId ? `/user/attendance/${userId}` : '/user/attendance';
      const response = await api.get<AttendanceRecord[]>(url);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch attendance' };
    }
  },

  markAttendance: async (data: { checkIn?: boolean; checkOut?: boolean }) => {
    try {
      const response = await api.post('/user/attendance', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to mark attendance' };
    }
  },

  // Leave Management
  getLeaveRequests: async () => {
    try {
      const response = await api.get('/user/leave');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch leave requests' };
    }
  },

  applyLeave: async (leaveData: LeaveRequest) => {
    try {
      const response = await api.post('/user/leave', leaveData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to apply for leave' };
    }
  },

  cancelLeave: async (leaveId: string) => {
    try {
      const response = await api.delete(`/user/leave/${leaveId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to cancel leave' };
    }
  },

  // Profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (data: any) => {
    try {
      const response = await api.put('/user/profile', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },
};