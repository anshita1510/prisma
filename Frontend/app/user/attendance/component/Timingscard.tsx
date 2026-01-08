"use client";

import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimingsCardProps {
  currentTime: string;
  currentDate: string;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const TimingsCard = ({ currentTime, currentDate }: TimingsCardProps) => {
  const today = new Date().getDay();
  // Convert from Sunday=0 to Monday=0 format
  const todayIndex = today === 0 ? 6 : today - 1;
  
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
        <div className="text-sm text-gray-600 mb-3">
          Today (9:30 AM - 6:30 PM)
        </div>
        
        {/* Progress bar */}
        <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden mb-3">
          {/* Work segments */}
          <div 
            className="absolute left-0 top-0 h-full bg-teal-400 rounded-l-full"
            style={{ width: '40%' }}
          />
          <div 
            className="absolute left-[42%] top-0 h-full bg-teal-300"
            style={{ width: '8%' }}
          />
          <div 
            className="absolute left-[52%] top-0 h-full bg-teal-400 rounded-r-full"
            style={{ width: '35%' }}
          />
          
          {/* Current time marker */}
          <div 
            className="absolute top-0 w-1 h-full bg-gray-800"
            style={{ left: '60%' }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>Duration: 9h 0m</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>45 min</span>
          </div>
        </div>
      </div>
      
      {/* Current time display */}
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">{currentTime}</div>
        <div className="text-sm text-gray-500">{currentDate}</div>
      </div>
    </div>
  );
};
