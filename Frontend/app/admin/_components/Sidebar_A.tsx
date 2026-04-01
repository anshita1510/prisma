"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import {
  Menu, X, LayoutDashboard, CalendarOff, UserCheck,
  FolderOpen, UserPlus, CheckSquare, Calendar, Users, LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'attendance', name: 'Attendance', icon: UserCheck, href: '/admin/attendance' },
  { id: 'leave', name: 'Leave Management', icon: CalendarOff, href: '/admin/leave' },
  { id: 'projects', name: 'Projects', icon: FolderOpen, href: '/admin/projects' },
  { id: 'tasks', name: 'Tasks', icon: CheckSquare, href: '/admin/tasks' },
  { id: 'create-user', name: 'Create User', icon: UserPlus, href: '/admin/createUser' },
  { id: 'enh-cal', name: 'Calendar', icon: Calendar, href: '/enhanced-tms/calendar' },
  { id: 'enh-team', name: 'Team', icon: Users, href: '/enhanced-tms/team' },
];

const SB = 'var(--card-bg)';
const BORDER = 'var(--card-border)';
const ACTIVE_BG = 'var(--primary-subtle)';
const INACTIVE_CLR = 'var(--text-muted)';

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Use useAuth if available, fallback to authService
  let user: any = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const auth = useAuth();
    user = auth.user;
  } catch {
    // useAuth not available in this context
  }

  const [storedUser, setStoredUser] = useState<any>(null);
  useEffect(() => {
    if (!user) setStoredUser(authService.getStoredUser());
  }, [user]);

  const displayUser = user || storedUser;

  const getInitials = () => {
    if (!displayUser?.name && !displayUser?.firstName) return 'A';
    const name = displayUser.name || `${displayUser.firstName} ${displayUser.lastName || ''}`;
    return name.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const sidebarW = '230px';

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 fixed top-0 left-0 right-0 z-40"
        style={{ backgroundColor: SB, borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center relative">
            <Image src="/prima-logo.svg" alt="PRIMA" width={32} height={32} className="object-contain" />
          </div>
          <span className="font-bold text-[var(--text-color)] text-sm tracking-widest">PRIMA</span>
        </div>
        <button onClick={() => setMobileOpen(true)}
          className="p-1" style={{ background: 'none', border: 'none', cursor: 'pointer', color: INACTIVE_CLR }}>
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 flex flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen transition-all duration-300
          ${mobileOpen ? 'fixed inset-y-0 left-0 z-50 h-screen w-[230px]' : 'hidden lg:flex'}`}
        style={{ width: sidebarW, backgroundColor: SB, borderRight: `1px solid ${BORDER}` }}
      >
        {/* Logo */}
        <div className="py-5 flex items-center justify-between px-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${BORDER}`, height: '73px' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
              <Image src="/prima-logo.svg" alt="PRIMA" width={36} height={36} className="object-contain" />
            </div>
            <span className="font-bold text-[var(--text-color)] text-base tracking-widest">PRIMA</span>
          </div>
          <button onClick={() => setMobileOpen(false)}
            className="lg:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: INACTIVE_CLR }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-5 space-y-1 overflow-y-auto overflow-x-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2"
            style={{ color: INACTIVE_CLR, opacity: 0.6 }}>Navigation</p>

          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.id} href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative"
                style={{
                  backgroundColor: isActive ? ACTIVE_BG : 'transparent',
                  color: isActive ? 'var(--primary-color)' : INACTIVE_CLR,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-subtle)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-color)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = INACTIVE_CLR;
                  }
                }}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                    style={{ backgroundColor: 'var(--primary-color)' }} />
                )}
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: BORDER, margin: '12px 4px' }} />
        </nav>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: BORDER, margin: '0 12px' }} />

        {/* User + Logout */}
        <div className="p-3 flex-shrink-0">
          <div className="flex items-center gap-3 p-2.5 rounded-xl mb-2"
            style={{ backgroundColor: 'var(--bg-subtle)', border: `1px solid ${BORDER}` }}>
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-color)] truncate">
                {displayUser?.name || displayUser?.firstName || 'Admin'}
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary-color)' }}>
                {displayUser?.role || 'ADMIN'}
              </span>
            </div>
          </div>
          <button onClick={() => authService.logout()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: INACTIVE_CLR }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={e => (e.currentTarget.style.color = INACTIVE_CLR)}
          >
            <LogOut size={16} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block flex-shrink-0" style={{ width: sidebarW }} />
    </>
  );
}
