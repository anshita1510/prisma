import React from "react";
import Sidebar from "../_components/Sidebar_A";

export default function page() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      <Sidebar></Sidebar>
      {/* Main Content */}
      <main className="flex-1 p-6">welcome dashboard</main>
    </div>
  );
}
