import React from 'react'
import Sidebar from './_components/Sidebar_A'
import Banner from "./_components/banner_A"
import DashboardContent from './_components/DashboardContent'

export default function page() {
  return (
    <div>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">
          <Banner />
          <DashboardContent />
        </main>
      </div>
    </div>
  )
}
