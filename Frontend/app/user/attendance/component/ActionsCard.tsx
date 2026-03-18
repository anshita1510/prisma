"use client";

import { Home, Briefcase, Clock, FileText, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useToast } from '../../../hooks/useToast';
import { attendanceService, TimeSlot } from '../../../services/attendanceService';
import api from '../../../../lib/axios';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'PRIMAry' | 'success';
  disabled?: boolean;
}

const ActionButton = ({ icon, label, onClick, variant = 'default', disabled = false }: ActionButtonProps) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 text-sm transition-colors py-2 px-3 rounded-md w-full ${
      disabled 
        ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
        : variant === 'PRIMAry'
        ? 'text-white bg-purple-600 hover:bg-purple-700 shadow-sm'
        : variant === 'success'
        ? 'text-white bg-green-600 hover:bg-green-700 shadow-sm'
        : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface ActionsCardProps {
  currentTime: string;
  currentDate: string;
}

export const ActionsCard = ({ currentTime, currentDate }: ActionsCardProps) => {
  const { currentUser } = useAttendance();
  const { success, error } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [currentSessionTime, setCurrentSessionTime] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(0);

  // Check today's attendance status on mount
  useEffect(() => {
    checkTodayStatus();
  }, [currentUser]);

  // Update real-time calculations every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (todayAttendance?.timeSlots) {
        updateTimeCalculations(todayAttendance.timeSlots);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [todayAttendance]);

  // Initial calculation when attendance data changes
  useEffect(() => {
    if (todayAttendance?.timeSlots) {
      updateTimeCalculations(todayAttendance.timeSlots);
    }
  }, [todayAttendance]);

  const updateTimeCalculations = (timeSlots: TimeSlot[]) => {
    // Calculate total completed work time
    const completedTime = attendanceService.calculateTotalWorkingHours(timeSlots);
    
    // Calculate current session time if checked in
    const currentSession = attendanceService.calculateCurrentSessionTime(timeSlots);
    
    setTotalWorkTime(completedTime);
    setCurrentSessionTime(currentSession);
  };

  const checkTodayStatus = async () => {
    if (!currentUser?.employeeId) return;

    try {
      setCheckingStatus(true);
      const response = await api.get('/api/attendance/my-today');
      
      if (response.data.success && response.data.data) {
        const attendance = response.data.data;
        setTodayAttendance(attendance);
        
        // Check if there's an open time slot (checked in but not checked out)
        const timeSlots = attendance.timeSlots || [];
        const hasOpenSlot = timeSlots.some((slot: any) => slot.checkIn && !slot.checkOut);
        
        setIsCheckedIn(hasOpenSlot);
        updateTimeCalculations(timeSlots);
      } else {
        setIsCheckedIn(false);
        setTodayAttendance(null);
        setTotalWorkTime(0);
        setCurrentSessionTime(0);
      }
    } catch (err: any) {
      console.log('Could not fetch today status:', err);
      setIsCheckedIn(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleCheckIn = async () => {
    if (!currentUser?.employeeId) {
      error('Employee ID not found. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      
      const response = await api.post('/api/attendance/my-check-in', {
        employeeId: currentUser.employeeId,
        location: 'Office', // You can add geolocation here
        deviceType: 'web'
      });

      if (response.data.success) {
        setIsCheckedIn(true);
        setTodayAttendance(response.data.data);
        success(response.data.message || 'Checked in successfully!');
        
        // Refresh attendance data
        await checkTodayStatus();
      } else {
        error(response.data.message || 'Check-in failed');
      }
    } catch (err: any) {
      console.error('Check-in failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Check-in failed';
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentUser?.employeeId) {
      error('Employee ID not found. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      
      const response = await api.post('/api/attendance/my-check-out', {
        employeeId: currentUser.employeeId,
        location: 'Office',
        deviceType: 'web'
      });

      if (response.data.success) {
        setIsCheckedIn(false);
        setTodayAttendance(response.data.data);
        success(response.data.message || 'Checked out successfully!');
        
        // Refresh attendance data
        await checkTodayStatus();
      } else {
        error(response.data.message || 'Check-out failed');
      }
    } catch (err: any) {
      console.error('Check-out failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Check-out failed';
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDisplayTime = () => {
    if (isCheckedIn) {
      // Show total completed time + current session time
      return totalWorkTime + (currentSessionTime / 60); // Convert minutes to hours
    } else {
      // Show only completed time
      return totalWorkTime;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
      
      {/* Clock display */}
      <div className="mb-6 text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
        <div className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
          {currentTime}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {currentDate}
        </div>
      </div>
      
      {/* Status indicator */}
      {todayAttendance && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-blue-900 font-medium">Today's Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              isCheckedIn 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isCheckedIn ? 'Checked In' : 'Checked Out'}
            </span>
          </div>
          
          {/* Real-time work time display */}
          <div className="mb-3 p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-blue-600 font-medium">Total Work Time</div>
              {isCheckedIn && (
                <div className="text-xs text-green-600 font-medium animate-pulse">● Live</div>
              )}
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {attendanceService.formatWorkingHours(getTotalDisplayTime())}
            </div>
            
            {/* Breakdown */}
            <div className="text-xs text-blue-700 space-y-1">
              {totalWorkTime > 0 && (
                <div>Completed: {attendanceService.formatWorkingHours(totalWorkTime)}</div>
              )}
              {isCheckedIn && currentSessionTime > 0 && (
                <div className="text-green-600">
                  Current session: {attendanceService.formatDuration(currentSessionTime)}
                </div>
              )}
              {todayAttendance.overtime > 0 && (
                <div className="text-orange-600 font-medium">
                  Overtime: {attendanceService.formatWorkingHours(todayAttendance.overtime)}
                </div>
              )}
            </div>
          </div>
          
          {/* Time slots */}
          {todayAttendance.timeSlots && todayAttendance.timeSlots.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-blue-700 font-medium">
                Time Entries ({todayAttendance.timeSlots.length}):
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {todayAttendance.timeSlots.map((slot: any, index: number) => {
                  const duration = slot.checkOut 
                    ? attendanceService.calculateWorkingHours(slot.checkIn, slot.checkOut)
                    : attendanceService.calculateCurrentSessionTime([slot]) / 60;
                  
                  return (
                    <div key={index} className="text-xs bg-white p-2 rounded border border-blue-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-blue-800">Session #{index + 1}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          slot.checkOut 
                            ? 'bg-gray-100 text-gray-700' 
                            : 'bg-green-100 text-green-700 animate-pulse'
                        }`}>
                          {slot.checkOut ? 'Completed' : 'Active'}
                        </span>
                      </div>
                      
                      <div className="text-blue-700">
                        <div>
                          In: {new Date(slot.checkIn).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        {slot.checkOut && (
                          <div>
                            Out: {new Date(slot.checkOut).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        )}
                        <div className="font-medium text-blue-800 mt-1">
                          Duration: {attendanceService.formatWorkingHours(duration)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Check-in/Check-out buttons */}
      <div className="space-y-2">
        {checkingStatus ? (
          <div className="flex items-center justify-center py-3 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2"></div>
            <span className="text-sm">Checking status...</span>
          </div>
        ) : !isCheckedIn ? (
          <ActionButton 
            icon={<LogIn className="w-4 h-4" />} 
            label={loading ? "Checking in..." : "Check In"}
            onClick={handleCheckIn}
            variant="PRIMAry"
            disabled={loading}
          />
        ) : (
          <ActionButton 
            icon={<LogOut className="w-4 h-4" />} 
            label={loading ? "Checking out..." : "Check Out"}
            onClick={handleCheckOut}
            variant="success"
            disabled={loading}
          />
        )}
      </div>
    </div>
  );
};
