import React from "react";
import Sidebar from "../_components/sidebar_u";
import Leave from "../_components/LeavePart1";

export default function Page() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* SIDEBAR */}
      <aside
        className="
          hidden lg:block
          fixed top-0 left-0
          h-screen w-64
          bg-white border-r
        "
      >
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="
          flex-1
          ml-0 lg:ml-64
          h-screen
          overflow-y-auto
          p-4
        "
      >
        <Leave />
      </main>

    </div>
  );
}
