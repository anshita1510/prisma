const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface CheckInData {
  employeeId: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  deviceType?: string;
}

interface CheckOutData {
  employeeId: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  deviceType?: string;
}

interface RegularizationRequestData {
  employeeId: number;
  attendanceId: number;
  requestType: 'MISSED_PUNCH' | 'TIME_CORRECTION' | 'ATTENDANCE_REGULARIZATION';
  reason: string;
  proposedCheckIn?: string;
  proposedCheckOut?: string;
  proposedStatus?: string;
}

interface AttendanceCorrectionData {
  attendanceId: number;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  reason: string;
  correctedBy: number;
}

class AttendanceService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Personal Attendance Methods
  async checkIn(data: CheckInData) {
    return this.makeRequest('/attendance/checkin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkOut(data: CheckOutData) {
    return this.makeRequest('/attendance/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPersonalAttendanceHistory(employeeId: number, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    return this.makeRequest(`/attendance/history/${employeeId}${queryString ? `?${queryString}` : ''}`);
  }

  async submitRegularizationRequest(data: RegularizationRequestData) {
    return this.makeRequest('/attendance/regularization-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Employee Management Methods
  async getAllEmployeeAttendance(date?: string, departmentId?: number) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (departmentId) params.append('departmentId', departmentId.toString());
    
    const queryString = params.toString();
    return this.makeRequest(`/attendance/employees${queryString ? `?${queryString}` : ''}`);
  }

  async performManualAttendanceCorrection(data: AttendanceCorrectionData) {
    return this.makeRequest('/attendance/correction', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPendingRegularizationRequests(approverId?: number) {
    const params = new URLSearchParams();
    if (approverId) params.append('approverId', approverId.toString());
    
    const queryString = params.toString();
    return this.makeRequest(`/attendance/requests/pending${queryString ? `?${queryString}` : ''}`);
  }

  async approveRegularizationRequest(requestId: string, approverId: number) {
    return this.makeRequest(`/attendance/requests/${requestId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approverId }),
    });
  }

  async rejectRegularizationRequest(requestId: string, approverId: number, rejectionReason: string) {
    return this.makeRequest(`/attendance/requests/${requestId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ approverId, rejectionReason }),
    });
  }

  // Reporting Methods
  async generateDailyAttendanceReport(date?: string, departmentId?: number) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (departmentId) params.append('departmentId', departmentId.toString());
    
    const queryString = params.toString();
    return this.makeRequest(`/attendance/reports/daily${queryString ? `?${queryString}` : ''}`);
  }

  async generateMonthlyAttendanceReport(year: number, month: number, departmentId?: number) {
    const params = new URLSearchParams();
    params.append('year', year.toString());
    params.append('month', month.toString());
    if (departmentId) params.append('departmentId', departmentId.toString());
    
    const queryString = params.toString();
    return this.makeRequest(`/attendance/reports/monthly?${queryString}`);
  }

  // Audit Methods
  async getAuditTrail(attendanceId?: number, employeeId?: number, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (attendanceId) params.append('attendanceId', attendanceId.toString());
    if (employeeId) params.append('employeeId', employeeId.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    return this.makeRequest(`/attendance/audit/trail${queryString ? `?${queryString}` : ''}`);
  }

  // Dashboard Methods
  async getAttendanceDashboardStats(date?: string, departmentId?: number) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (departmentId) params.append('departmentId', departmentId.toString());
    
    const queryString = params.toString();
    return this.makeRequest(`/attendance/dashboard/stats${queryString ? `?${queryString}` : ''}`);
  }

  // Utility Methods
  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  async getLocationData() {
    try {
      const position = await this.getCurrentLocation();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
    } catch (error) {
      console.warn('Could not get location:', error);
      return null;
    }
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      deviceType: this.getDeviceType(),
      platform: navigator.platform,
      language: navigator.language
    };
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  calculateWorkHours(checkIn: Date | string, checkOut: Date | string): number {
    const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
    const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
    
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
  }

  getAttendanceStatusColor(status: string): string {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EARLY_DEPARTURE':
        return 'bg-orange-100 text-orange-800';
      case 'PARTIAL':
        return 'bg-blue-100 text-blue-800';
      case 'REGULARIZED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getRequestStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'ESCALATED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const attendanceService = new AttendanceService();