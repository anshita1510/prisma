"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth.services';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  CalendarOff, 
  UserCheck, 
  Briefcase,
  UserPlus,
  ChevronRight,
  LogOut,
  Target
} from 'lucide-react';

/**
 * Navigation Items Configuration
 * Use these IDs or HREFs to trigger navigation in your parent component/router
 */
const NAV_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/user' }, 
  { id: 'leave', name: 'Leave', icon: CalendarOff, href: '/user/leave' },       
  { id: 'attendance', name: 'Attendance', icon: UserCheck, href: '/user/Attendance' },    
  { id: 'project', name: 'Project', icon: Briefcase, href: '/user/project' },            
 
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({
    name: "Loading...",
    role: "User",
    initials: "??"
  });

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const initials = parsedUser.name
          ? parsedUser.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
          : "??";

        setUser({
          name: parsedUser.name || "Unknown",
          role: parsedUser.role || "User",
          initials,
        });
      } catch (error) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  // Close sidebar when window is resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <>
      {/* MOBILE TOP BAR - Fixed for mobile screens */}
      <div className="lg:hidden flex items-center justify-between bg-green-700 p-4 text-white fixed top-0 left-0 right-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-white">T</div>
          <span className="font-semibold text-lg tracking-tight">Tikr</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 hover:bg-green-600 rounded-md transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR ASIDE */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-green-700 text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full border-r border-green-800/30 shadow-2xl lg:shadow-none">
          
          {/* LOGO SECTION */}
          <div className="p-6 flex items-center justify-between border-b border-green-600/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-green-700 rounded-xl flex items-center justify-center shadow-lg font-bold">
                <Target size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight uppercase">Tikr</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1.5 hover:bg-green-600 rounded-full">
              <X size={20} />
            </button>
          </div>

          {/* NAV LINKS */}
          <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
  {NAV_ITEMS.map((item) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={() => {
          setActiveTab(item.id); // optional (can remove later)
          setIsOpen(false);
        }}
        className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 
          ${isActive ? 'bg-white text-green-800 shadow-lg' : 'hover:bg-green-600/80 text-white'}
        `}
      >
        <div className="flex items-center gap-4">
          <item.icon
            size={22}
            className={`${isActive ? 'text-green-700' : 'text-green-300'}`}
          />
          <span className="font-semibold text-sm tracking-wide">
            {item.name}
          </span>
        </div>

        <ChevronRight
          size={14}
          className={`transition-all ${
            isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}
        />
      </Link>
    );
  })}
</nav>


          {/* USER & LOGOUT SECTION */}
          <div className="p-4 border-t border-green-600/50 space-y-3 bg-green-800/20 mt-auto">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-green-800/40">
              <div className="w-9 h-9 rounded-full bg-green-400 border-2 border-green-500/50 flex items-center justify-center text-green-900 font-bold text-xs uppercase">
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-[10px] text-green-300 font-bold uppercase tracking-widest">{user.role}</p>
              </div>
            </div> 
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-100 hover:bg-red-500/20 hover:text-white rounded-xl transition-colors font-semibold text-sm"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Global CSS for hidden scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}} />
    </>
  );
}