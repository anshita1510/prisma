import { authService } from './authService';

export interface LeaveApplication {
  type: 'CASUAL' | 'SICK' | 'EARNED' | 'UNPAID';
  reason?: string;
  startDate: string;
  endDate: string;
}

export interface Leave {
  id: number;
  type: string;
  reason?: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  department: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveResponse {
  success: boolean;
  message?: string;
  leave?: Leave;
  leaves?: Leave[];
  count?: number;
  error?: string;
}

class LeaveService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';

  constructor() {
    console.log('🔧 LeaveService initialized with baseUrl:', this.baseUrl);
    console.log('🔧 Environment variable NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log('🔑 Token exists:', !!token);
    console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async applyLeave(leaveData: LeaveApplication): Promise<LeaveResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/leaves`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(leaveData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply for leave');
      }

      return data;
    } catch (error) {
      console.error('Apply leave error:', error);
      throw error;
    }
  }

  async getMyLeaves(): Promise<LeaveResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/leaves/my-leaves`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch leaves');
      }

      return data;
    } catch (error) {
      console.error('Get my leaves error:', error);
      throw error;
    }
  }

  async getAllLeaves(): Promise<LeaveResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/leaves`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch all leaves');
      }

      return data;
    } catch (error) {
      console.error('Get all leaves error:', error);
      throw error;
    }
  }

  async getLeaveById(id: number): Promise<LeaveResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/leaves/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch leave');
      }

      return data;
    } catch (error) {
      console.error('Get leave by ID error:', error);
      throw error;
    }
  }

  async updateLeaveStatus(id: number, status: 'APPROVED' | 'REJECTED'): Promise<LeaveResponse> {
    try {
      console.log('🔄 updateLeaveStatus called with:', { id, status });
      console.log('🔄 Base URL:', this.baseUrl);
      
      const headers = this.getAuthHeaders();
      console.log('🔄 Headers:', headers);
      
      const url = `${this.baseUrl}/api/leaves/${id}/status`;
      console.log('🔄 Request URL:', url);
      
      const requestBody = { status };
      console.log('🔄 Request body:', requestBody);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(requestBody),
        mode: 'cors',
        credentials: 'include'
      });

      console.log('🔄 Response status:', response.status);
      console.log('🔄 Response ok:', response.ok);
      console.log('🔄 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Response not ok:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to update leave status`);
      }

      const data = await response.json();
      console.log('🔄 Response data:', data);
      
      return data;
    } catch (error: any) {
      console.error('🔴 Update leave status error:', error);
      
      // Handle network errors specifically
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Cannot connect to server. Please check if the backend is running on port 5004.');
      }
      
      throw error;
    }
  }

  async deleteLeave(id: number): Promise<LeaveResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/leaves/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete leave');
      }

      return data;
    } catch (error) {
      console.error('Delete leave error:', error);
      throw error;
    }
  }

  // Helper method to calculate leave duration
  calculateLeaveDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  }

  // Helper method to format leave type for display
  formatLeaveType(type: string): string {
    switch (type) {
      case 'CASUAL':
        return 'Casual Leave';
      case 'SICK':
        return 'Sick Leave';
      case 'EARNED':
        return 'Earned Leave';
      case 'UNPAID':
        return 'Unpaid Leave';
      default:
        return type;
    }
  }

  // Helper method to get status color
  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'APPROVED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
}

export const leaveService = new LeaveService();