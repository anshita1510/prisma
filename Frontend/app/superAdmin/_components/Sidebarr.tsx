"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  FolderKanban, 
  UserPlus, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

// Define Interface for Type Safety
interface NavItemType {
  name: string;
  id: string;
  href: string; // Added href back for your routing
  icon: React.ElementType;
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Handle responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems: NavItemType[] = [
    { name: "Dashboard", id: "dashboard", href: "/superAdmin", icon: LayoutDashboard },
    { name: "Leave", id: "leave", href: "/superAdmin/leave", icon: Calendar },
    { name: "Attendance", id: "attendance", href: "/superAdmin/Attendance", icon: Clock },
    { name: "Project", id: "project", href: "/superAdmin/projectManage", icon: FolderKanban },
    { name: "Create User", id: "create-user", href: "/superAdmin/createUser", icon: UserPlus }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Mobile Top Navbar */}
      <div className="fixed top-0 z-40 flex h-16 w-full items-center justify-between bg-emerald-600 px-4 text-white shadow-md md:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
          </div>
          <span className="text-lg font-bold tracking-tight">TIKR</span>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 2. Mobile Drawer Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setOpen(false)}
        >
          <div 
            className="h-full w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
                  <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45" />
                </div>
                <span className="text-2xl font-bold text-slate-800 tracking-tight">Tikr</span>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
              {navItems.map((item) => (
                /* --- PLACE YOUR MOBILE NEXT.JS LINK HERE --- */
                /* Example: <Link href={item.href} key={item.id} passHref> */
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setOpen(false);
                    // Add routing logic here if not using <Link>
                  }}
                  className={`flex w-full items-center justify-between group rounded-xl px-4 py-3 transition-all ${
                    activeTab === item.name 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronRight size={14} className={`${activeTab === item.name ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity`} />
                </button>
                /* </Link> */
              ))}
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-500 hover:bg-rose-50 transition-colors">
                <LogOut size={20} />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="h-20 flex items-center px-6 mb-2 border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45" />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">Tikr</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            /* --- PLACE YOUR DESKTOP NEXT.JS LINK HERE --- */
            /* Example: <Link href={item.href} key={item.id} passHref> */
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                // Add routing logic here if not using <Link>
              }}
              className={`flex w-full items-center justify-between group rounded-xl px-4 py-3 transition-all ${
                activeTab === item.name 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-slate-500 hover:bg-emerald-50/50 hover:text-emerald-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronRight size={14} className={`${activeTab === item.name ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity`} />
            </button>
            /* </Link> */
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-50 transition-colors">
            <HelpCircle size={20} />
            <span className="font-medium">Support</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-500 hover:bg-rose-100/50 transition-colors font-bold">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 4. Main Content Area */}
      <main className="flex-1 md:ml-64 p-8 pt-24 md:pt-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-slate-800">{activeTab}</h1>
          <div className="mt-6 border-2 border-dashed border-slate-200 rounded-3xl h-64 flex items-center justify-center text-slate-400">
            Content for {activeTab} will appear here.
          </div>
        </div>
      </main>
    </div>
  );
}