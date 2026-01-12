import React from 'react'
import Sidebar from '../_components/Sidebar_A'

export default function AdminProjectPage() {
  return (
    <div>  
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Project & Task Management</h1>
            <p className="text-gray-600 mt-1">Admin access to comprehensive project and task management</p>
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
          <div className="p-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enhanced TMS Dashboard */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-blue-500">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Enhanced TMS Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Complete project and task management system with advanced features, analytics, and team management.
              </p>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Project creation and management</li>
                <li>• Task assignment and tracking</li>
                <li>• Budget and milestone management</li>
                <li>• Team collaboration tools</li>
                <li>• Real-time analytics and reporting</li>
              </ul>
              <a 
                href="/enhanced-tms/dashboard" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Access Enhanced TMS
              </a>
            </div>

            {/* Task Management */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-green-500">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Task Management</h3>
              <p className="text-gray-600 mb-4">
                Dedicated task management interface with admin-level controls and oversight.
              </p>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Create and assign tasks</li>
                <li>• Monitor task progress</li>
                <li>• Manage task priorities</li>
                <li>• Track time and deadlines</li>
                <li>• Generate task reports</li>
              </ul>
              <a 
                href="/admin/tasks" 
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Manage Tasks
              </a>
            </div>

            {/* Demo Mode */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-purple-500">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Demo Mode</h3>
              <p className="text-gray-600 mb-4">
                Explore the full system with sample data and all admin features enabled.
              </p>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Sample projects and tasks</li>
                <li>• Full admin capabilities</li>
                <li>• Interactive demonstrations</li>
                <li>• No authentication required</li>
              </ul>
              <a 
                href="/demo" 
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Try Demo
              </a>
            </div>

            {/* API Status */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-yellow-500">
              <h3 className="text-lg font-medium text-gray-900 mb-2">System Status</h3>
              <p className="text-gray-600 mb-4">
                Current system status and API connectivity information.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Backend API:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Running
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Frontend:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Running
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Database:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Admin + Manager Access Level
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    You have full administrative access to all projects and tasks across the system. 
                    You can create, edit, delete, and manage all aspects of project and task management.
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  )
}
