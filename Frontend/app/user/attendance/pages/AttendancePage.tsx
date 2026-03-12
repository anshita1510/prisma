"use client";

import { useState, useEffect } from 'react';
import { AttendanceStats } from '../component/AttendanceStats';
import { TimingsCard } from '../component/Timingscard';
import { ActionsCard } from '../component/ActionsCard';
import { LogsTabs } from '../component/Logstab';
import { AttendanceLog } from '../component/AttendanceLog';
import { useAttendance } from '../hooks/useAttendance';
import { useToast } from '../../../hooks/useToast';
import { ToastContainer } from '../../../../components/ui/toast';

export const AttendancePage = () => {
  const {
    records,
    myStats,
    teamStats,
    viewMode,
    setViewMode,
    timeFormat,
    setTimeFormat,
    selectedMonth,
    setSelectedMonth,
    activeTab,
    setActiveTab,
    currentDate,
    loading,
    error,
  } = useAttendance();

  const { toasts, removeToast } = useToast();

  // Live clock
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: timeFormat === '12h'
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeFormat]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Error loading attendance data: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-[1400px] mx-auto">
        {/* Top section - 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <AttendanceStats myStats={myStats} teamStats={teamStats} />
          <TimingsCard currentTime={currentTime} currentDate={currentDate} />
          <ActionsCard currentTime={currentTime} currentDate={currentDate} />
        </div>

        {/* Logs section */}
        <div className="bg-white rounded-lg shadow-sm">
          <LogsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            timeFormat={timeFormat}
            onTimeFormatChange={setTimeFormat}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {activeTab === 'log' && (
            <AttendanceLog
              records={records.map(record => ({
                ...record,
                id: typeof record.id === 'string' ? parseInt(record.id, 10) : record.id,
                date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : record.date,
                timeSlots: record.timeSlots.map(slot => ({
                  ...slot,
                  checkIn: slot.checkIn ?? slot.startTime ?? null, // map your TimeSlot field → checkIn
                  checkOut: slot.checkOut ?? slot.endTime ?? null, // map your TimeSlot field → checkOut
                })),
                isManuallyEdited: false,
              }))} selectedMonth={''} onMonthChange={function (month: string): void {
                throw new Error('Function not implemented.');
              }} />
          )}

          {activeTab === 'calendar' && (
            <div className="p-8 text-center text-gray-500">
              Calendar view coming soon
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="p-8 text-center text-gray-500">
              Attendance requests coming soon
            </div>
          )}
        </div>
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
