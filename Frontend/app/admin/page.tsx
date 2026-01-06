import React from 'react'
import Sidebar from './_components/Sidebar_A'
import Banner from "./_components/banner_A"


export default function page() {
  return (
    <div>
    <div className="flex min-h-screen">
      {/* Sidebar */}

      <Sidebar></Sidebar>

      {/* Main Content */}
      <main className="flex-1">
        <Banner></Banner>
        welcome dashboard
        
        </main>
    </div>
    </div>
  )
}
