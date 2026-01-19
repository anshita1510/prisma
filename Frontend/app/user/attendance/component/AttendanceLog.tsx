"use client";

import { Check, AlertCircle, MoreHorizontal, CheckCircle } from 'lucide-react';
import { TimelineBar } from './TimelineBar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { attendanceService } from '../../../services/attendanceService';

interface BackendTimeSlot {
  checkIn: string;
  checkOut?: string;
}

interface BackendAttendanceRecord {
  id: number;
  date: string;
  status: string;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  overtime?: number;
  timeSlots?: BackendTimeSlot[];
  isManuallyEdited: boolean;
  editReason?: string;
}

interface AttendanceLogProps {
  records: BackendAttendanceRecord[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MONTHS = ['30 DAYS', 'DEC', 'NOV', 'OCT', 'SEP', 'AUG', 'JUL'];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short' 
  });
};

const getStatusBadge = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PRESENT':
      return <Badge className="bg-green-100 text-green-800 text-xs font-normal">PRESENT</Badge>;
    case 'LATE':
      return <Badge className="bg-orange-100 text-orange-800 text-xs font-normal">LATE</Badge>;
    case 'ABSENT':
      return <Badge className="bg-red-100 text-red-800 text-xs font-normal">ABSENT</Badge>;
    case 'HALF_DAY':
      return <Badge className="bg-yellow-100 text-yellow-800 text-xs font-normal">HALF DAY</Badge>;
    case 'EARLY_DEPARTURE':
      return <Badge className="bg-blue-100 text-blue-800 text-xs font-normal">EARLY OUT</Badge>;
    case 'PARTIAL':
      return <Badge className="bg-purple-100 text-purple-800 text-xs font-normal">PARTIAL</Badge>;
    default:
      return <Badge variant="secondary" className="text-xs font-normal">{status}</Badge>;
  }
};

const getArrivalStatus = (record: BackendAttendanceRecord) => {
  if (!record.checkIn) return null;
  
  const checkInTime = new Date(record.checkIn);
  const hour = checkInTime.getHours();
  const minute = checkInTime.getMinutes();
  
  // Late if after 9:30 AM
  const isLate = hour > 9 || (hour === 9 && minute > 30);
  
  if (isLate) {
    const lateMinutes = (hour - 9) * 60 + (minute - 30);
    return (
      <div className="flex items-center gap-2 text-orange-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">{Math.floor(lateMinutes / 60)}:{(lateMinutes % 60).toString().padStart(2, '0')} late</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-green-600">
      <Check className="w-4 h-4" />
      <span className="text-sm">On Time</span>
    </div>
  );
};

const getLogStatus = (record: BackendAttendanceRecord) => {
  if (record.status === 'PRESENT') {
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  }
  if (record.status === 'LATE') {
    return <AlertCircle className="w-5 h-5 text-orange-600" />;
  }
  if (record.status === 'ABSENT') {
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  }
  return <MoreHorizontal className="w-5 h-5 text-gray-400" />;
};

export const AttendanceLog = ({ records, selectedMonth, onMonthChange }: AttendanceLogProps) => {
  return (
    <div className="overflow-hidden">
      {/* Month filter */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Last 30 Days</h3>
        <div className="flex items-center gap-2">
          {MONTHS.map((month) => (
            <button
              key={month}
              onClick={() => onMonthChange(month)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                selectedMonth === month
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
      
      {/* Table header */}
      <div className="grid grid-cols-[140px_1fr_150px_120px_140px_60px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
        <div>Date</div>
        <div>Attendance Visual</div>
        <div>Work Hours</div>
        <div>Sessions</div>
        <div>Arrival</div>
        <div>Log</div>
      </div>
      
      {/* Records */}
      <div className="divide-y divide-gray-200">
        {records.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <div className="text-sm">No attendance records found</div>
            <div className="text-xs mt-1">Records will appear here once you start checking in</div>
          </div>
        ) : (
          records.map((record) => (
            <div 
              key={record.id}
              className="grid grid-cols-[140px_1fr_150px_120px_140px_60px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
            >
              {/* Date */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(record.date)}
                </span>
                {getStatusBadge(record.status)}
              </div>
              
              {/* Timeline visual */}
              <div className="py-2">
                {record.timeSlots && record.timeSlots.length > 0 ? (
                  <TimelineBar slots={record.timeSlots} />
                ) : (
                  <div className="text-sm text-gray-500 text-center py-2">
                    No time entries logged
                  </div>
                )}
              </div>
              
              {/* Work hours */}
              <div className="flex flex-col gap-1">
                {record.workHours !== null && record.workHours !== undefined ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-500" />
                      <span className="text-sm text-gray-900 font-medium">
                        {attendanceService.formatWorkingHours(record.workHours)}
                      </span>
                    </div>
                    {record.overtime && record.overtime > 0 && (
                      <div className="text-xs text-orange-600">
                        +{attendanceService.formatWorkingHours(record.overtime)} OT
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </div>
              
              {/* Sessions */}
              <div className="text-sm text-gray-900">
                {record.timeSlots && record.timeSlots.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{record.timeSlots.length} session{record.timeSlots.length !== 1 ? 's' : ''}</span>
                    <div className="text-xs text-gray-500">
                      {record.timeSlots.filter(slot => !slot.checkOut).length > 0 && (
                        <span className="text-green-600">● Active</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              
              {/* Arrival */}
              <div>
                {getArrivalStatus(record)}
              </div>
              
              {/* Log */}
              <div className="flex justify-center">
                {getLogStatus(record)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
