"use client";

import { Home, Briefcase, Clock, FileText, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useToast } from '../../../hooks/useToast';
import api from '../../../../lib/axios';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'success';
  disabled?: boolean;
}

const ActionButton = ({ icon, label, onClick, variant = 'default', disabled = false }: ActionButtonProps) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 text-sm transition-colors py-2 px-3 rounded-md w-full ${
      disabled 
        ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
        : variant === 'primary'
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

  // Check today's attendance status on mount
  useEffect(() => {
    checkTodayStatus();
  }, [currentUser]);

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
      } else {
        setIsCheckedIn(false);
        setTodayAttendance(null);
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
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-blue-900 font-medium">Today's Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              isCheckedIn 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isCheckedIn ? 'Checked In' : 'Checked Out'}
            </span>
          </div>
          
          {/* Total work hours */}
          {todayAttendance.workHours !== null && todayAttendance.workHours !== undefined && (
            <div className="mb-2 p-2 bg-white rounded border border-blue-100">
              <div className="text-xs text-blue-600 font-medium">Total Work Time</div>
              <div className="text-lg font-bold text-blue-900">
                {Math.floor(todayAttendance.workHours)}h {Math.round((todayAttendance.workHours % 1) * 60)}m
              </div>
              {todayAttendance.overtime > 0 && (
                <div className="text-xs text-green-600">
                  +{todayAttendance.overtime.toFixed(1)}h overtime
                </div>
              )}
            </div>
          )}
          
          {/* Time slots */}
          {todayAttendance.timeSlots && todayAttendance.timeSlots.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="text-xs text-blue-700 font-medium">Time Entries:</div>
              {todayAttendance.timeSlots.map((slot: any, index: number) => (
                <div key={index} className="text-xs text-blue-700 bg-white p-1.5 rounded border border-blue-100">
                  <span className="font-medium">#{index + 1}</span>
                  {' '}In: {new Date(slot.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {slot.checkOut && (
                    <>
                      {' → Out: '}
                      {new Date(slot.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      <span className="ml-2 text-green-600 font-medium">
                        ({Math.round((new Date(slot.checkOut).getTime() - new Date(slot.checkIn).getTime()) / (1000 * 60))}m)
                      </span>
                    </>
                  )}
                  {!slot.checkOut && (
                    <span className="ml-2 text-orange-600 font-medium">(Active)</span>
                  )}
                </div>
              ))}
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
            variant="primary"
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
