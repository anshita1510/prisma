"use client";

import React from 'react';
import Sidebar from '../_components/Sidebar_A';
import Banner from '../_components/banner_A';
import AdminAttendanceContent from '../_components/AdminAttendanceContent';

export default function AdminAttendancePage() {
  return (
    <div>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1">
          <Banner />
          <div className="p-6">
            <AdminAttendanceContent />
          </div>
        </main>
      </div>
    </div>
  );
}