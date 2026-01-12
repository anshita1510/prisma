"use client";

import React from 'react';
import Sidebar from '../_components/Sidebar_A';
import AdminAttendanceContent from '../_components/AdminAttendanceContent';

export default function AdminAttendancePage() {
  return (
    <div>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage employee attendance</p>
          </div>
          <div className="p-6">
            <AdminAttendanceContent />
          </div>
        </main>
      </div>
    </div>
  );
}