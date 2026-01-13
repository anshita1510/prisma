import React from 'react'
import Sidebar from '../_components/Sidebar_A'
import Create from "../_components/createu"

export default function page() {
  return (
    <div>
         <div className="flex min-h-screen">
      {/* Sidebar */}

      <Sidebar></Sidebar>
      {/* Main Content */}
      <main className="flex-1 ">
        <Create></Create>

      </main>
    </div>
    </div>
  )
}
