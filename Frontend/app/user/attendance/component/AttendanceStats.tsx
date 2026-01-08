"use client";

import { Info, ChevronDown, User, Users } from 'lucide-react';
import { AttendanceStats as AttendanceStatsType } from '../types/attendanceTypes';
import { cn } from '@/lib/utils';

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  avgHours: string;
  onTimePercent: number;
  variant?: 'primary' | 'secondary';
}

const StatRow = ({ icon, label, avgHours, onTimePercent, variant = 'primary' }: StatRowProps) => (
  <div className={cn(
    "flex items-center justify-between py-3 px-4 rounded-lg",
    variant === 'primary' ? "bg-yellow-50" : "bg-blue-50"
  )}>
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        variant === 'primary' ? "bg-yellow-400 text-white" : "bg-blue-500 text-white"
      )}>
        {icon}
      </div>
      <span className="font-medium text-gray-900">{label}</span>
    </div>
    <div className="flex items-center gap-8 text-sm">
      <div className="text-right">
        <div className="text-xs text-gray-500 uppercase tracking-wide">Avg Hrs / Day</div>
        <div className="font-semibold text-gray-900">{avgHours}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500 uppercase tracking-wide">On Time Arrival</div>
        <div className="font-semibold text-gray-900">{onTimePercent}%</div>
      </div>
    </div>
  </div>
);

interface AttendanceStatsProps {
  myStats: AttendanceStatsType;
  teamStats: AttendanceStatsType;
}

export const AttendanceStats = ({ myStats, teamStats }: AttendanceStatsProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Attendance Stats</h2>
        <Info className="w-4 h-4 text-gray-400 cursor-help" />
      </div>
      
      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <span>Last Week</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      <div className="space-y-3">
        <StatRow
          icon={<User className="w-4 h-4" />}
          label="Me"
          avgHours={myStats.avgHoursPerDay}
          onTimePercent={myStats.onTimeArrivalPercent}
          variant="primary"
        />
        <StatRow
          icon={<Users className="w-4 h-4" />}
          label="My Team"
          avgHours={teamStats.avgHoursPerDay}
          onTimePercent={teamStats.onTimeArrivalPercent}
          variant="secondary"
        />
      </div>
    </div>
  );
};
