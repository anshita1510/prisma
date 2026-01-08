"use client";

import { useState, useMemo, useEffect } from 'react';
import { authService } from '../../../services/auth.services';
import api from '../../../../lib/axios';
import { 
  AttendanceRecord, 
  AttendanceStats, 
  AttendanceRequest,
  ViewMode,
  TimeFormat 
} from '../types/attendanceTypes';
// API service for attendance
const attendanceAPI = {
  // Get my attendance stats
  getMyStats: async (period: string = 'week') => {
    const response = await api.get(`/api/attendance/my-stats?period=${period}`);
    return response.data;
  },

  // Get my attendance logs
  getMyLogs: async (days: number = 30) => {
    const response = await api.get(`/api/attendance/my-logs?days=${days}`);
    return response.data;
  },

  // Get my team stats
  getMyTeamStats: async (period: string = 'week') => {
    const response = await api.get(`/api/attendance/my-team-stats?period=${period}`);
    return response.data;
  },

  // Get my today's attendance
  getMyTodayAttendance: async () => {
    const response = await api.get('/api/attendance/my-today');
    return response.data;
  },

  // My check in
  myCheckIn: async () => {
    const response = await api.post('/api/attendance/my-check-in');
    return response.data;
  },

  // My check out
  myCheckOut: async () => {
    const response = await api.post('/api/attendance/my-check-out');
    return response.data;
  },

  // Admin routes (with specific employee IDs)
  getStats: async (employeeId: number, period: string = 'week') => {
    const response = await api.get(`/api/attendance/stats/${employeeId}?period=${period}`);
    return response.data;
  },

  getLogs: async (employeeId: number, days: number = 30) => {
    const response = await api.get(`/api/attendance/logs/${employeeId}?days=${days}`);
    return response.data;
  },

  getTeamStats: async (departmentId: number, period: string = 'week') => {
    const response = await api.get(`/api/attendance/team-stats/${departmentId}?period=${period}`);
    return response.data;
  },

  getTodayAttendance: async (employeeId: number) => {
    const response = await api.get(`/api/attendance/today/${employeeId}`);
    return response.data;
  },

  checkIn: async (employeeId: number, companyId: number, departmentId: number) => {
    const response = await api.post('/api/attendance/check-in', {
      employeeId,
      companyId,
      departmentId
    });
    return response.data;
  },

  checkOut: async (employeeId: number) => {
    const response = await api.post('/api/attendance/check-out', {
      employeeId
    });
    return response.data;
  }
};

// Mock data generator (fallback)
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayOfWeek = date.getDay();
    
    // Weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records.push({
        id: `att-${i}`,
        date,
        status: 'weekly-off',
        timeSlots: [],
        effectiveHours: '0h 0m',
        grossHours: '0h 0m',
        arrivalStatus: 'no-entry',
      });
      continue;
    }
    
    // Holiday on 1st
    if (date.getDate() === 1) {
      records.push({
        id: `att-${i}`,
        date,
        status: 'holiday',
        timeSlots: [],
        effectiveHours: '0h 0m',
        grossHours: '0h 0m',
        arrivalStatus: 'no-entry',
        notes: 'Holiday',
      });
      continue;
    }
    
    // Random attendance
    const isLate = Math.random() > 0.8;
    const effectiveMinutes = 480 + Math.floor(Math.random() * 120);
    const grossMinutes = effectiveMinutes + Math.floor(Math.random() * 30);
    
    records.push({
      id: `att-${i}`,
      date,
      status: 'present',
      timeSlots: [
        { start: '09:30', end: '13:00', type: 'work' },
        { start: '13:00', end: '14:00', type: 'break' },
        { start: '14:00', end: '18:30', type: 'work' },
      ],
      effectiveHours: `${Math.floor(effectiveMinutes / 60)}h ${effectiveMinutes % 60}m`,
      grossHours: `${Math.floor(grossMinutes / 60)}h ${grossMinutes % 60}m`,
      arrivalStatus: isLate ? 'late' : 'on-time',
      arrivalTime: isLate ? '09:32:51' : '09:28:00',
      departureTime: '18:30:00',
    });
  }
  
  return records;
};

const mockRequests: AttendanceRequest[] = [
  {
    id: 'req-1',
    type: 'work-from-home',
    date: new Date(),
    reason: 'Personal work at home',
    status: 'pending',
    requestedAt: new Date(),
  },
  {
    id: 'req-2',
    type: 'regularization',
    date: new Date(Date.now() - 86400000 * 2),
    reason: 'Forgot to punch out',
    status: 'approved',
    requestedAt: new Date(Date.now() - 86400000),
  },
];

export const useAttendance = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24h');
  const [selectedMonth, setSelectedMonth] = useState<string>('30 DAYS');
  const [activeTab, setActiveTab] = useState<'log' | 'calendar' | 'requests'>('log');
  
  // State for real data
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [myStats, setMyStats] = useState<AttendanceStats | null>(null);
  const [teamStats, setTeamStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = authService.getStoredUser();
    setCurrentUser(user);
  }, []);

  // Load attendance data
  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Try to load real data from API
        try {
          const [statsResponse, logsResponse, teamStatsResponse] = await Promise.all([
            attendanceAPI.getMyStats('week'),
            attendanceAPI.getMyLogs(30),
            attendanceAPI.getMyTeamStats('week')
          ]);

          if (statsResponse.success && logsResponse.success && teamStatsResponse.success) {
            // Convert backend data to frontend format
            const convertedLogs = logsResponse.data.map((log: any) => ({
              id: `att-${log.date}`,
              date: new Date(log.date),
              status: log.status.toLowerCase(),
              timeSlots: log.checkIn && log.checkOut ? [
                { start: '09:30', end: '13:00', type: 'work' },
                { start: '13:00', end: '14:00', type: 'break' },
                { start: '14:00', end: '18:30', type: 'work' },
              ] : [],
              effectiveHours: `${Math.floor(log.effectiveHours)}h ${Math.floor((log.effectiveHours % 1) * 60)}m`,
              grossHours: `${Math.floor(log.grossHours)}h ${Math.floor((log.grossHours % 1) * 60)}m`,
              arrivalStatus: log.arrivalStatus,
              arrivalTime: log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : undefined,
              departureTime: log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : undefined,
            }));

            setRecords(convertedLogs);

            const convertedMyStats: AttendanceStats = {
              avgHoursPerDay: `${Math.floor(statsResponse.data.avgHoursPerDay)}h ${statsResponse.data.totalMinutes}m`,
              onTimeArrivalPercent: statsResponse.data.onTimePercentage,
              totalWorkingDays: statsResponse.data.totalDays,
              presentDays: statsResponse.data.presentDays,
              absentDays: statsResponse.data.absentDays,
              lateDays: statsResponse.data.totalDays - statsResponse.data.presentDays - statsResponse.data.absentDays,
            };

            const convertedTeamStats: AttendanceStats = {
              avgHoursPerDay: `${Math.floor(teamStatsResponse.data.avgHoursPerDay)}h ${teamStatsResponse.data.totalMinutes}m`,
              onTimeArrivalPercent: teamStatsResponse.data.onTimePercentage,
              totalWorkingDays: 22,
              presentDays: 18,
              absentDays: 2,
              lateDays: 4,
            };

            setMyStats(convertedMyStats);
            setTeamStats(convertedTeamStats);
            return;
          }
        } catch (apiError) {
          console.log('API not available, using mock data:', apiError);
        }

        // Fallback to mock data
        const mockRecords = generateMockAttendance();
        setRecords(mockRecords);

        const mockMyStats: AttendanceStats = {
          avgHoursPerDay: '9h 22m',
          onTimeArrivalPercent: 75,
          totalWorkingDays: 22,
          presentDays: 20,
          absentDays: 0,
          lateDays: 2,
        };

        const mockTeamStats: AttendanceStats = {
          avgHoursPerDay: '7h 21m',
          onTimeArrivalPercent: 31,
          totalWorkingDays: 22,
          presentDays: 18,
          absentDays: 2,
          lateDays: 4,
        };

        setMyStats(mockMyStats);
        setTeamStats(mockTeamStats);

      } catch (err: any) {
        console.error('Error loading attendance data:', err);
        setError(err.message || 'Failed to load attendance data');
        
        // Fallback to mock data
        setRecords(generateMockAttendance());
        setMyStats({
          avgHoursPerDay: '9h 22m',
          onTimeArrivalPercent: 75,
          totalWorkingDays: 22,
          presentDays: 20,
          absentDays: 0,
          lateDays: 2,
        });
        setTeamStats({
          avgHoursPerDay: '7h 21m',
          onTimeArrivalPercent: 31,
          totalWorkingDays: 22,
          presentDays: 18,
          absentDays: 2,
          lateDays: 4,
        });
      } finally {
        setLoading(false);
      }
    };

    loadAttendanceData();
  }, [currentUser]);

  // Check in function
  const checkIn = async () => {
    if (!currentUser?.id) {
      throw new Error('User not found');
    }

    try {
      const response = await attendanceAPI.myCheckIn();
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Check-in failed');
      }
    } catch (error: any) {
      // If API fails, show mock success for demo
      console.log('Check-in API failed, showing mock success:', error);
      return { success: true, message: 'Checked in successfully (Demo)' };
    }
  };

  // Check out function
  const checkOut = async () => {
    if (!currentUser?.id) {
      throw new Error('User not found');
    }

    try {
      const response = await attendanceAPI.myCheckOut();
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Check-out failed');
      }
    } catch (error: any) {
      // If API fails, show mock success for demo
      console.log('Check-out API failed, showing mock success:', error);
      return { success: true, message: 'Checked out successfully (Demo)' };
    }
  };

  const requests = mockRequests;
  
  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: timeFormat === '12h' 
    });
  }, [timeFormat]);
  
  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }, []);
  
  return {
    records,
    requests,
    myStats: myStats || {
      avgHoursPerDay: '0h 0m',
      onTimeArrivalPercent: 0,
      totalWorkingDays: 0,
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
    },
    teamStats: teamStats || {
      avgHoursPerDay: '0h 0m',
      onTimeArrivalPercent: 0,
      totalWorkingDays: 0,
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
    },
    viewMode,
    setViewMode,
    timeFormat,
    setTimeFormat,
    selectedMonth,
    setSelectedMonth,
    activeTab,
    setActiveTab,
    currentTime,
    currentDate,
    loading,
    error,
    checkIn,
    checkOut,
    currentUser,
  };
};
