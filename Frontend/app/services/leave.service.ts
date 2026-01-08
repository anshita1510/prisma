import api from '../../lib/axios';

export interface LeaveRequest {
  id: number;
  employeeId: number;
  departmentId: number;
  type: 'CASUAL' | 'SICK' | 'EARNED' | 'UNPAID';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  startDate: string;
  endDate: string;
  approvedById?: number;
  createdAt: string;
  updatedAt: string;
  employee: {
    id: number;
    name: string;
    designation: string;
    employeeCode: string;
  };
  department: {
    id: number;
    name: string;
    type: string;
  };
  approvedBy?: {
    id: number;
    name: string;
  };
}

export interface CreateLeaveRequest {
  employeeId: number;
  departmentId: number;
  type: 'CASUAL' | 'SICK' | 'EARNED' | 'UNPAID';
  reason?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateLeaveStatusRequest {
  status: 'APPROVED' | 'REJECTED';
  approvedById: number;
}

export const leaveService = {
  // Get all leaves
  getAllLeaves: async (): Promise<LeaveRequest[]> => {
    try {
      const response = await api.get<LeaveRequest[]>('/api/leaves');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch leaves' };
    }
  },

  // Get leave by ID
  getLeaveById: async (id: number): Promise<LeaveRequest> => {
    try {
      const response = await api.get<LeaveRequest>(`/api/leaves/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch leave' };
    }
  },

  // Create new leave request
  createLeave: async (leaveData: CreateLeaveRequest): Promise<LeaveRequest> => {
    try {
      const response = await api.post<LeaveRequest>('/api/leaves', leaveData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to create leave request' };
    }
  },

  // Update leave status (approve/reject)
  updateLeaveStatus: async (id: number, statusData: UpdateLeaveStatusRequest): Promise<LeaveRequest> => {
    try {
      const response = await api.patch<LeaveRequest>(`/api/leaves/${id}/status`, statusData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update leave status' };
    }
  },

  // Delete leave request
  deleteLeave: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await api.delete<{ message: string }>(`/api/leaves/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to delete leave request' };
    }
  },

  // Get pending leaves (filtered)
  getPendingLeaves: async (): Promise<LeaveRequest[]> => {
    try {
      const allLeaves = await leaveService.getAllLeaves();
      return allLeaves.filter(leave => leave.status === 'PENDING');
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch pending leaves' };
    }
  },

  // Get leave statistics for a user
  getLeaveStats: async (employeeId?: number) => {
    try {
      const allLeaves = await leaveService.getAllLeaves();
      
      // Filter by employee if provided
      const userLeaves = employeeId 
        ? allLeaves.filter(leave => leave.employeeId === employeeId)
        : allLeaves;

      // Calculate statistics
      const stats = {
        casual: {
          total: 12, // This should come from company policy
          consumed: userLeaves.filter(l => l.type === 'CASUAL' && l.status === 'APPROVED').length,
          pending: userLeaves.filter(l => l.type === 'CASUAL' && l.status === 'PENDING').length,
        },
        sick: {
          total: 12,
          consumed: userLeaves.filter(l => l.type === 'SICK' && l.status === 'APPROVED').length,
          pending: userLeaves.filter(l => l.type === 'SICK' && l.status === 'PENDING').length,
        },
        earned: {
          total: 12,
          consumed: userLeaves.filter(l => l.type === 'EARNED' && l.status === 'APPROVED').length,
          pending: userLeaves.filter(l => l.type === 'EARNED' && l.status === 'PENDING').length,
        },
        unpaid: {
          total: 0,
          consumed: userLeaves.filter(l => l.type === 'UNPAID' && l.status === 'APPROVED').length,
          pending: userLeaves.filter(l => l.type === 'UNPAID' && l.status === 'PENDING').length,
        }
      };

      return {
        ...stats,
        totalLeaves: userLeaves.length,
        approvedLeaves: userLeaves.filter(l => l.status === 'APPROVED').length,
        pendingLeaves: userLeaves.filter(l => l.status === 'PENDING').length,
        rejectedLeaves: userLeaves.filter(l => l.status === 'REJECTED').length,
      };
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch leave statistics' };
    }
  }
};