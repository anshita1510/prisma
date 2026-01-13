"use client";

import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { List, Calendar, MoreHorizontal } from 'lucide-react';

type TabType = 'log' | 'calendar' | 'requests';
type ViewMode = 'list' | 'calendar';

interface LogsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  timeFormat: '12h' | '24h';
  onTimeFormatChange: (format: '12h' | '24h') => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const TABS: { id: TabType; label: string }[] = [
  { id: 'log', label: 'Attendance Log' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'requests', label: 'Attendance Requests' },
];

export const LogsTabs = ({ 
  activeTab, 
  onTabChange, 
  timeFormat, 
  onTimeFormatChange,
  viewMode,
  onViewModeChange,
}: LogsTabsProps) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-semibold text-gray-900">Logs & Requests</h2>
          <div className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors relative",
                  activeTab === tab.id 
                    ? "text-gray-900 border-b-2 border-purple-600" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time format toggle */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Switch 
              checked={timeFormat === '24h'}
              onCheckedChange={(checked: boolean) => onTimeFormatChange(checked ? '24h' : '12h')}
            />
            <span>24 hour format</span>
          </div>
          
          {/* View mode toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                "p-2 transition-colors",
                viewMode === 'list' 
                  ? "bg-purple-600 text-white" 
                  : "bg-white text-gray-600 hover:text-gray-900"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('calendar')}
              className={cn(
                "p-2 transition-colors",
                viewMode === 'calendar' 
                  ? "bg-purple-600 text-white" 
                  : "bg-white text-gray-600 hover:text-gray-900"
              )}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
