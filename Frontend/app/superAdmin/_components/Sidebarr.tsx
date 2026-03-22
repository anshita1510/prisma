"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.services';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '@/lib/theme/ThemeContext';
import {
  Menu, X, LayoutDashboard, UserPlus, LogOut,
  BarChart3, ChevronLeft, ChevronRight,
  Building2, Users, Crown, Sun, Moon,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, href: "/superAdmin" },
  { id: "analytics", name: "View Analytics", icon: BarChart3, href: "/superAdmin/analytics" },
  { id: "create-ceo", name: "Create CEO", icon: Crown, href: "/superAdmin/createCeo" },
  { id: "manage-companies", name: "Manage Companies", icon: Building2, href: "/superAdmin/manageCompanies" },
  { id: "manage-users", name: "Manage Users", icon: Users, href: "/superAdmin/manageUsers" },
];

const SB = 'var(--card-bg)';
const BORDER = 'var(--card-border)';
const ACTIVE_BG = 'var(--primary-subtle)';
const ACTIVE_COLOR = 'var(--primary-color)';
const INACTIVE_COLOR = 'var(--text-muted)';

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, getUserInitials, getRoleDisplay, refreshUser } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const pathname = usePathname();

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const sidebarW = collapsed ? '72px' : '230px';

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
        <button onClick={() => setMobileOpen(true)} className="text-[var(--text-muted)] hover:text-[var(--text-color)] p-1">
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
          ${mobileOpen ? "fixed inset-y-0 left-0 z-50 h-screen w-[230px]" : "hidden lg:flex"}`}
        style={{ width: sidebarW, backgroundColor: SB, borderRight: `1px solid ${BORDER}` }}
      >
        {/* Toggle Button for Desktop - Floating on the right edge */}
        {/* <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden lg:flex absolute -right-3 top-6 items-center justify-center w-6 h-6 rounded-full transition-colors z-[60]"
          style={{ backgroundColor: SB, border: `1px solid ${BORDER}`, color: 'var(--text-muted)', boxShadow: 'var(--shadow-sm)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-color)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button> */}

        {/* Logo */}
        <div className={`py-5 flex items-center flex-shrink-0 relative ${collapsed ? 'justify-center mx-auto' : 'justify-between px-4'}`}
          style={{ borderBottom: `1px solid ${BORDER}`, height: '73px', width: '100%' }}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center relative">
              <Image src="/prima-logo.svg" alt="PRIMA" width={36} height={36} className="object-contain" />
            </div>
            {!collapsed && (
              <span className="font-bold text-[var(--text-color)] text-base tracking-widest whitespace-nowrap">PRIMA</span>
            )}
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1">
              <button onClick={() => setMobileOpen(false)} className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-color)]">
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-5 space-y-1 overflow-y-auto overflow-x-hidden">
          {/* Section label */}
          {!collapsed && (
            <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
              Navigation
            </p>
          )}
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isCeo = item.id === 'create-ceo';
            const isCompanies = item.id === 'manage-companies';
            const isUsers = item.id === 'manage-users';
            const accent = isCeo ? '#f59e0b' : isCompanies ? '#3b82f6' : isUsers ? '#22c55e' : 'var(--primary-color)';
            const accentBg = isCeo ? 'rgba(245,158,11,0.12)' : isCompanies ? 'rgba(59,130,246,0.12)' : isUsers ? 'rgba(34,197,94,0.12)' : 'var(--primary-subtle)';

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.name : undefined}
                className={`flex items-center rounded-lg transition-all duration-150 group relative ${collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'}`}
                style={{
                  backgroundColor: isActive ? (isCeo || isCompanies || isUsers ? accentBg : ACTIVE_BG) : 'transparent',
                  color: isActive ? accent : INACTIVE_COLOR,
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
                    (e.currentTarget as HTMLElement).style.color = INACTIVE_COLOR;
                  }
                }}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                    style={{ backgroundColor: accent }} />
                )}
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                )}

                {/* Special badges for new items */}
                {!collapsed && !isActive && isCeo && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>New</span>
                )}
              </Link>
            );
          })}

          {/* Divider before theme */}
          <div style={{ height: '1px', backgroundColor: BORDER, margin: '12px 4px' }} />

          {/* Theme Toggle inline button */}
          {!collapsed ? (
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 transition-all duration-150"
              style={{ color: INACTIVE_COLOR }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-subtle)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-color)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = INACTIVE_COLOR;
              }}
            >
              <div className="w-8 h-4 rounded-full relative flex-shrink-0 transition-colors duration-300"
                style={{ backgroundColor: isDark ? '#7c3aed' : '#e2e6f0', border: '1px solid var(--card-border)' }}>
                <div className="w-3 h-3 rounded-full absolute top-0.5 transition-all duration-300 flex items-center justify-center"
                  style={{
                    left: isDark ? '16px' : '2px',
                    backgroundColor: isDark ? '#e8eaf6' : '#ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                </div>
              </div>
              <span className="text-sm font-medium whitespace-nowrap">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
              <div className="ml-auto">
                {isDark ? <Moon size={14} style={{ color: '#a78bfa' }} /> : <Sun size={14} style={{ color: '#f59e0b' }} />}
              </div>
            </button>
          ) : (
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-full py-3 rounded-lg transition-all duration-150"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ color: INACTIVE_COLOR }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-subtle)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-color)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = INACTIVE_COLOR;
              }}
            >
              {isDark ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#7c3aed' }} />}
            </button>
          )}
        </nav>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: BORDER, margin: '0 12px' }} />

        {/* User + Logout */}
        <div className="p-3 flex-shrink-0">
          <div className={`flex items-center gap-3 p-2.5 rounded-xl mb-2 overflow-hidden ${collapsed ? 'justify-center' : ''}`}
            style={{ backgroundColor: 'var(--bg-subtle)', border: `1px solid ${BORDER}` }}>
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              {getUserInitials()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-color)] truncate">{user?.name || 'Loading...'}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary-color)' }}>
                  {getRoleDisplay()}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => authService.logout()}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${collapsed ? 'justify-center' : ''}`}
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block flex-shrink-0 transition-all duration-300" style={{ width: sidebarW }} />
    </>
  );
}
