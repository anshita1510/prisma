"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarDays, 
  User, 
  UserPlus, 
  ShieldCheck, 
  ChevronRight,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- SIDEBAR COMPONENT --- */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-100 p-4 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* BRAND LOGO */}
        <div className="hidden lg:flex items-center gap-3 px-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1CAC78] shadow-lg shadow-[#1CAC78]/30">
            <Clock className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-800">tikr</span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          <SectionLabel label="Home" />
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isActive={activeTab === 'Dashboard'} 
            onClick={() => { setActiveTab('Dashboard'); setIsOpen(false); }}
          />
          <NavItem 
            icon={<User size={20} />} 
            label="Me" 
            isActive={activeTab === 'Me'} 
            onClick={() => { setActiveTab('Me'); setIsOpen(false); }}
          />

          <SectionLabel label="Pages" className="mt-6" />
          <NavItem icon={<Clock size={20} />} label="Attendance" hasSubmenu isActive={activeTab === 'Attendance'} onClick={() => { setActiveTab('Attendance'); setIsOpen(false); }} />
          <NavItem icon={<CalendarDays size={20} />} label="Leaves" hasSubmenu isActive={activeTab === 'Leaves'} onClick={() => { setActiveTab('Leaves'); setIsOpen(false); }} />

          <SectionLabel label="Super Admin" className="mt-6" />
          <NavItem icon={<UserPlus size={20} />} label="Create" isActive={activeTab === 'Create User'} onClick={() => {  router.push("/dashboard_superadmin/supercreate"), setActiveTab('Create User'); setIsOpen(false); }} />

        </nav>

        {/* LOGOUT */}
        <div className="mt-auto pt-6">
          <button 
           onClick={() => router.replace('/')}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-medium group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"  />
         
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* MOBILE HEADER */}
        <header className="lg:hidden flex items-center justify-between bg-white p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-[#1CAC78] p-1.5 rounded-lg text-white"><Clock size={20}/></div>
            <span className="font-bold text-xl text-gray-800">tikr</span>
          </div>
          <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          
          {/* HERO IMAGE CARD ON RIGHT/CENTER */}
          <div className="relative h-[300px] lg:h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl mb-10">
            <img 
              src="https://plus.unsplash.com/premium_photo-1661884151947-ad09dee18a07?q=80&w=2940&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover"
              alt="Dashboard Background"
            />
            {/* Overlay Gradient & Text */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-10">
              <h2 className="text-white text-4xl lg:text-5xl font-bold mb-4 drop-shadow-md">
                Welcome to your <br/> <span className="text-[#58ED96]">Dashboard</span>
              </h2>
              <p className="text-gray-200 text-lg max-w-md drop-shadow-sm">
                View your metrics and manage your team efficiently. Everything you need is just a click away.
              </p>
            </div>
          </div>

          {/* QUICK STATS (Example) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Today's Attendance</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1">94%</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Leave Requests</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1">12 Pending</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Users</p>
               <h3 className="text-2xl font-bold text-gray-800 mt-1">1,204</h3>
            </div>
          </div>

        </div>
      </main>
      
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={toggleSidebar}/>
      )}
    </div>
  );
};

/* Components used within Sidebar */
const SectionLabel = ({ label, className }) => (
  <p className={`mb-2 px-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 ${className}`}>
    {label}
  </p>
);

const NavItem = ({ icon, label, isActive, hasSubmenu, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        group flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-all duration-200
        ${isActive 
          ? 'bg-[#1CAC78] text-white shadow-md shadow-[#1CAC78]/30 ring-1 ring-[#1CAC78]' 
          : 'bg-[#1CAC78] text-white hover:bg-white hover:text-[#1CAC78] hover:ring-1 hover:ring-[#1CAC78]/20 shadow-sm'}
      `}
    >
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <span className="text-[15px] font-medium leading-none">{label}</span>
      </div>
      {hasSubmenu && <ChevronRight size={16} className={`transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} />}
    </div>
  );
};

export default DashboardPage;