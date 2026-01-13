"use client";

import { Home, Briefcase, Clock, FileText, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useToast } from '../../../hooks/useToast';

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
    className={`flex items-center gap-2 text-sm transition-colors py-2 px-3 rounded-md ${
      disabled 
        ? 'text-gray-400 cursor-not-allowed' 
        : variant === 'primary'
        ? 'text-white bg-purple-600 hover:bg-purple-700'
        : variant === 'success'
        ? 'text-white bg-green-600 hover:bg-green-700'
        : 'text-purple-600 hover:text-purple-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface ActionsCardProps {
  currentTime: string;
  currentDate: string;
}

export const ActionsCard = ({ currentTime, currentDate }: ActionsCardProps) => {
  const { checkIn, checkOut } = useAttendance();
  const { success, error } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      const result = await checkIn();
      if (result.success) {
        setIsCheckedIn(true);
        success(result.message || 'Checked in successfully!');
      } else {
        error(result.message || 'Check-in failed');
      }
    } catch (err: any) {
      console.error('Check-in failed:', err);
      error(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      const result = await checkOut();
      if (result.success) {
        setIsCheckedIn(false);
        success(result.message || 'Checked out successfully!');
      } else {
        error(result.message || 'Check-out failed');
      }
    } catch (err: any) {
      console.error('Check-out failed:', err);
      error(err.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
      
      {/* Clock display */}
      <div className="mb-6 text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
          {currentTime}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {currentDate}
        </div>
      </div>
      
      {/* Check-in/Check-out buttons */}
      <div className="mb-4 space-y-2">
        {!isCheckedIn ? (
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
      
      {/* Other action buttons */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <ActionButton 
          icon={<Home className="w-4 h-4" />} 
          label="Work From Home" 
        />
        <ActionButton 
          icon={<Briefcase className="w-4 h-4" />} 
          label="On Duty" 
        />
        <ActionButton 
          icon={<Clock className="w-4 h-4" />} 
          label="Partial Day Request" 
        />
        <ActionButton 
          icon={<FileText className="w-4 h-4" />} 
          label="Attendance Policy" 
        />
      </div>
    </div>
  );
};
