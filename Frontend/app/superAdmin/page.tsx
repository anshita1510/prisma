import React from 'react'
import Sidebar from './_components/Sidebarr'
import Banner from "./_components/Banner"

export default function page() {
  return (
   <>
   
   
   <div>
    <div className="flex min-h-screen">
      {/* Sidebar */}

      <Sidebar></Sidebar>

      {/* Main Content */}
      <main className="flex-1 ">
        <Banner></Banner>
        welcome dashboard
        
        </main>
    </div>
    </div>
   
   
   </>
  )
}
