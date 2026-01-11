import React from 'react'
import Sidebar from '../_components/Sidebar_A'
import Banner from '../_components/banner_A'

export default function AdminLeavePage() {
  return (
    <div>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1">
          <Banner />
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
              <p className="text-gray-600">Manage employee leave requests and policies</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Leave Management System</h3>
                <p className="text-gray-600 mb-4">
                  Leave management functionality will be implemented here.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
