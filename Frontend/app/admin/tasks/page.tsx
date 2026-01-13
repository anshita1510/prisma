import React from 'react'
import Sidebar from '../_components/Sidebar_A'

export default function AdminTasksPage() {
  return (
    <div>  
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600 mt-1">Manage all tasks across projects</p>
          </div>
          <div className="p-6">
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Enhanced Task Management</h3>
              <p className="text-gray-600 mb-4">
                For advanced task management features, please use the Enhanced TMS Dashboard.
              </p>
              <a 
                href="/enhanced-tms/dashboard" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Enhanced TMS Dashboard
              </a>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  )
}