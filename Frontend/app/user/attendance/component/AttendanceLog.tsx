"use client";

import { Check, AlertCircle, MoreHorizontal, CheckCircle } from 'lucide-react';
import { AttendanceRecord } from '../types/attendanceTypes';
import { TimelineBar } from './TimelineBar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AttendanceLogProps {
  records: AttendanceRecord[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MONTHS = ['30 DAYS', 'DEC', 'NOV', 'OCT', 'SEP', 'AUG', 'JUL'];

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short' 
  });
};

const StatusBadge = ({ status }: { status: AttendanceRecord['status'] }) => {
  if (status === 'weekly-off') {
    return <Badge variant="secondary" className="text-xs font-normal bg-gray-100 text-gray-600">W-OFF</Badge>;
  }
  if (status === 'holiday') {
    return <Badge className="bg-yellow-100 text-yellow-800 text-xs font-normal">HLDY</Badge>;
  }
  return null;
};

const ArrivalIndicator = ({ status, time }: { status: AttendanceRecord['arrivalStatus']; time?: string }) => {
  if (status === 'on-time') {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Check className="w-4 h-4" />
        <span className="text-sm">On Time</span>
      </div>
    );
  }
  if (status === 'late' && time) {
    return (
      <div className="flex items-center gap-2 text-orange-600">
        <Check className="w-4 h-4" />
        <span className="text-sm">0:02:51 late</span>
      </div>
    );
  }
  return null;
};

const LogStatus = ({ record }: { record: AttendanceRecord }) => {
  if (record.status === 'present' && record.arrivalStatus === 'on-time') {
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  }
  if (record.status === 'present' && record.arrivalStatus === 'late') {
    return <AlertCircle className="w-5 h-5 text-orange-600" />;
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
        <div>Effective Hours</div>
        <div>Gross Hours</div>
        <div>Arrival</div>
        <div>Log</div>
      </div>
      
      {/* Records */}
      <div className="divide-y divide-gray-200">
        {records.map((record) => (
          <div 
            key={record.id}
            className={cn(
              "grid grid-cols-[140px_1fr_150px_120px_140px_60px] gap-4 px-6 py-4 items-center",
              (record.status === 'weekly-off' || record.status === 'holiday') && "bg-gray-50"
            )}
          >
            {/* Date */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {formatDate(record.date)}
              </span>
              <StatusBadge status={record.status} />
            </div>
            
            {/* Timeline visual */}
            <div>
              {record.status === 'present' ? (
                <TimelineBar slots={record.timeSlots} />
              ) : record.status === 'weekly-off' ? (
                <div className="text-sm text-gray-500 text-center">Full day Weekly-off</div>
              ) : record.status === 'holiday' ? (
                <div className="text-sm text-gray-500 text-center">Holiday</div>
              ) : (
                <div className="text-sm text-gray-500 text-center">No Time Entries Logged</div>
              )}
            </div>
            
            {/* Effective hours */}
            <div className="flex items-center gap-2">
              {record.status === 'present' && (
                <>
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-sm text-gray-900">{record.effectiveHours}</span>
                </>
              )}
            </div>
            
            {/* Gross hours */}
            <div className="text-sm text-gray-900">
              {record.status === 'present' ? record.grossHours : ''}
            </div>
            
            {/* Arrival */}
            <div>
              {record.status === 'present' && (
                <ArrivalIndicator status={record.arrivalStatus} time={record.arrivalTime} />
              )}
            </div>
            
            {/* Log */}
            <div className="flex justify-center">
              <LogStatus record={record} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
