"use client";

import React from 'react';
import Sidebar from '../_components/Sidebar_A';
import { AttendancePage } from '../../user/attendance/pages/AttendancePage';

export default function AdminAttendancePage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
      <Sidebar />
      <main className="flex-1 min-w-0 pt-[57px] lg:pt-0">
        <div className="px-6 py-4 sticky top-0 z-10"
          style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>My Attendance</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Track your attendance and work hours</p>
          <span className="inline-block mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary-color)' }}>
            ADMIN
          </span>
        </div>
        <div className="">
          <AttendancePage />
        </div>
      </main>
    </div>
  );
}
