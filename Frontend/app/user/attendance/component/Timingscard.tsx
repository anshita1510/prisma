"use client";

import { cn } from '@/lib/utils';
import { Clock, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { attendanceService } from '../../../services/attendanceService';
import api from '../../../../lib/axios';

interface TimingsCardProps {
  currentTime: string;
  currentDate: string;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const TimingsCard = ({ currentTime, currentDate }: TimingsCardProps) => {
  const { currentUser } = useAttendance();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [workProgress, setWorkProgress] = useState(0);
  const [currentSessionTime, setCurrentSessionTime] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  
  const today = new Date().getDay();
  // Convert from Sunday=0 to Monday=0 format
  const todayIndex = today === 0 ? 6 : today - 1;
  
  // Standard work hours: 9:30 AM to 6:30 PM = 9 hours
  const STANDARD_WORK_HOURS = 9;
  const WORK_START_HOUR = 9.5; // 9:30 AM
  const WORK_END_HOUR = 18.5; // 6:30 PM
  
  useEffect(() => {
    fetchTodayAttendance();
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (todayAttendance?.timeSlots) {
        updateProgress();
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [todayAttendance]);

  useEffect(() => {
    if (todayAttendance?.timeSlots) {
      updateProgress();
    }
  }, [todayAttendance]);

  const fetchTodayAttendance = async () => {
    if (!currentUser?.employeeId) return;

    try {
      const response = await api.get('/api/attendance/my-today');
      if (response.data.success && response.data.data) {
        setTodayAttendance(response.data.data);
      }
    } catch (error) {
      console.log('Could not fetch today attendance:', error);
    }
  };

  const updateProgress = () => {
    if (!todayAttendance?.timeSlots) return;

    const timeSlots = todayAttendance.timeSlots;
    
    // Calculate total completed work time
    const completedTime = attendanceService.calculateTotalWorkingHours(timeSlots);
    
    // Calculate current session time if checked in
    const currentSession = attendanceService.calculateCurrentSessionTime(timeSlots);
    
    // Calculate total time including current session
    const totalTime = completedTime + (currentSession / 60);
    
    // Calculate progress percentage (0-100%)
    const progress = Math.min((totalTime / STANDARD_WORK_HOURS) * 100, 100);
    
    setTotalWorkTime(completedTime);
    setCurrentSessionTime(currentSession);
    setWorkProgress(progress);
  };

  const getCurrentTimeProgress = () => {
    const now = new Date();
    const currentHour = now.getHours() + (now.getMinutes() / 60);
    
    if (currentHour < WORK_START_HOUR) return 0;
    if (currentHour > WORK_END_HOUR) return 100;
    
    return ((currentHour - WORK_START_HOUR) / (WORK_END_HOUR - WORK_START_HOUR)) * 100;
  };

  const isCheckedIn = todayAttendance?.timeSlots?.some((slot: any) => slot.checkIn && !slot.checkOut);
  const timeProgressPercent = getCurrentTimeProgress();
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Timings</h2>
      
      {/* Day selector */}
      <div className="flex gap-2 mb-6">
        {DAYS.map((day, index) => (
          <button
            key={index}
            className={cn(
              "w-8 h-8 rounded-full text-sm font-medium transition-colors",
              index === todayIndex
                ? "bg-teal-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {day}
          </button>
        ))}
      </div>
      
      {/* Time display */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-3 flex items-center justify-between">
          <span>Today (9:30 AM - 6:30 PM)</span>
          {isCheckedIn && (
            <span className="text-green-600 text-xs font-medium animate-pulse">● Active</span>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden mb-3">
          {/* Work progress */}
          {workProgress > 0 && (
            <div 
              className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                isCheckedIn ? 'bg-green-400' : 'bg-teal-400'
              } rounded-l-full`}
              style={{ width: `${Math.min(workProgress, 100)}%` }}
            />
          )}
          
          {/* Overtime indicator */}
          {workProgress > 100 && (
            <div 
              className="absolute left-0 top-0 h-full bg-orange-400 rounded-full animate-pulse"
              style={{ width: `${Math.min(workProgress, 150)}%` }}
            />
          )}
          
          {/* Current time marker */}
          <div 
            className="absolute top-0 w-1 h-full bg-gray-800 z-10"
            style={{ left: `${timeProgressPercent}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Progress: {attendanceService.formatWorkingHours(totalWorkTime + (currentSessionTime / 60))} / {STANDARD_WORK_HOURS}h
          </span>
          <span>{Math.round(workProgress)}%</span>
        </div>
        
        {/* Work sessions summary */}
        {todayAttendance?.timeSlots && todayAttendance.timeSlots.length > 0 && (
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center justify-between">
              <span>Sessions: {todayAttendance.timeSlots.length}</span>
              {currentSessionTime > 0 && (
                <span className="text-green-600">
                  Current: {attendanceService.formatDuration(currentSessionTime)}
                </span>
              )}
            </div>
            
            {todayAttendance.overtime > 0 && (
              <div className="text-orange-600 font-medium">
                Overtime: {attendanceService.formatWorkingHours(todayAttendance.overtime)}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Current time display */}
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">{currentTime}</div>
        <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3" />
          {currentDate}
        </div>
      </div>
    </div>
  );
};
