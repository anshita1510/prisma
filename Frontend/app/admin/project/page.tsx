'use client';

import React from 'react';
import Sidebar from '../_components/Sidebar_A';
import ProjectManagementDashboard from '../_components/ProjectManagementDashboard';

export default function AdminProjectPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main content with proper offset for sidebar - 64px (16 * 4) on desktop */}
      <div className="lg:ml-16 min-h-screen pt-16 lg:pt-0">
        {/* Page Header */}
        <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Project & Task Management</h1>
          <p className="text-gray-600 mt-1">Create and manage projects with dynamic team assignment</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ADMIN
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              MANAGER
            </span>
            <span className="text-sm text-gray-500">Full Access</span>
          </div>
        </div>

        {/* Project Management Content */}
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <ProjectManagementDashboard />
        </div>
      </div>
    </div>
  );
}
