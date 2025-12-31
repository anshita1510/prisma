"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  User,
  ChevronRight,
  Menu,
  X,
  LogOut
} from "lucide-react";

const DashboardPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 BACKEND DATA
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // 🔥 BACKEND CALL (same as your simple code)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
          {
            credentials: "include", // if cookies/JWT used
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        router.push("/login"); // ❌ Not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // 🔄 Loading state
  if (loading) {
    return <div className="p-10 text-xl">Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r p-4 flex flex-col transition-transform
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="hidden lg:flex items-center gap-3 px-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1CAC78]">
            <Clock className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-gray-800">tikr</span>
        </div>

        <nav className="flex-1 space-y-2">
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
          <NavItem
            icon={<CalendarDays size={20} />}
            label="Leaves"
            isActive={activeTab === "Leaves"}
            onClick={() => setActiveTab("Leaves")}
          />
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => router.push("/login")}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1">
        <header className="lg:hidden flex justify-between p-4 bg-white">
          <button onClick={toggleSidebar}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="p-6 lg:p-10">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || "User"} 👋
          </h1>

          <p className="text-gray-600 mt-2">
            Email: {user?.email}
          </p>
        </div>
      </main>
    </div>
  );
};

/* Sidebar Item */
const NavItem = ({ icon, label, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
      ${isActive ? "bg-[#1CAC78] text-white" : "hover:bg-gray-100"}`}
  >
    {icon}
    {label}
  </div>
);

export default DashboardPage;
