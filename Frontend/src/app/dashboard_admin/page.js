"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  User,
  UserPlus,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const DashboardPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // 🔴 Logout handler
  const handleLogout = () => {
    // future: backend logout API call
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- SIDEBAR --- */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-100 p-4 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* LOGO */}
        <div className="hidden lg:flex items-center gap-3 px-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1CAC78]">
            <Clock className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-gray-800">tikr</span>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          <SectionLabel label="Home" />

          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isActive={activeTab === "Dashboard"}
            onClick={() => setActiveTab("Dashboard")}
          />

          <NavItem
            icon={<User size={20} />}
            label="Me"
            isActive={activeTab === "Me"}
            onClick={() => setActiveTab("Me")}
          />

          <SectionLabel label="Pages" className="mt-6" />

          <NavItem
            icon={<Clock size={20} />}
            label="Attendance"
            isActive={activeTab === "Attendance"}
            onClick={() => setActiveTab("Attendance")}
          />

          <NavItem
            icon={<CalendarDays size={20} />}
            label="Leaves"
            isActive={activeTab === "Leaves"}
            onClick={() => setActiveTab("Leaves")}
          />

          <SectionLabel label="Admin" className="mt-6" />

          <NavItem
            icon={<UserPlus size={20} />}
            label="Create User"
            isActive={activeTab === "Create User"}
            onClick={() => setActiveTab("Create User")}
          />
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col">
        {/* MOBILE HEADER */}
        <header className="lg:hidden flex items-center justify-between bg-white p-4 border-b">
          <span className="font-bold text-xl">tikr</span>
          <button onClick={toggleSidebar}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* CONTENT */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to your Dashboard
          </h1>
          <p className="text-gray-600">
            Select an option from the sidebar to get started.
          </p>
        </div>
      </main>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

/* Sidebar helpers */
const SectionLabel = ({ label, className = "" }) => (
  <p
    className={`mb-2 px-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 ${className}`}
  >
    {label}
  </p>
);

const NavItem = ({ icon, label, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition
      ${
        isActive
          ? "bg-[#1CAC78] text-white"
          : "hover:bg-gray-100 text-gray-700"
      }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    <ChevronRight size={16} />
  </div>
);

export default DashboardPage;
