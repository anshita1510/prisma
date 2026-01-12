'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/app/services/authService';
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Calendar,
  Users,
  Inbox,
  Bell,
  Settings,
  LogOut,
  Target,
  ChevronDown,
  User
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  designation: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/enhanced-tms/dashboard'
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderOpen,
    href: '/enhanced-tms/projects'
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    href: '/enhanced-tms/tasks'
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: Calendar,
    href: '/enhanced-tms/calendar'
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
    href: '/enhanced-tms/team'
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: Inbox,
    href: '/enhanced-tms/inbox',
    badge: 3
  }
];

export default function EnhancedTMSSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== '/enhanced-tms/dashboard' && pathname.startsWith(href));
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'MANAGER':
        return 'Manager';
      case 'EMPLOYEE':
        return 'Employee';
      default:
        return role;
    }
  };

  if (!user) {
    return (
      <div className="w-64 bg-slate-900 text-white h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-sm text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight">Enhanced TMS</span>
            <p className="text-xs text-slate-400 mt-0.5">Task Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const isItemActive = isActive(item.href);
            
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                  isItemActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:transform hover:scale-[1.01]'
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      isItemActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                
                {item.badge && (
                  <span className={`text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium ${
                    isItemActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">
            System
          </h3>
          <nav className="space-y-1">
            <div
              className="flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
              onClick={() => handleNavigation('/enhanced-tms/notifications')}
            >
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span className="font-medium text-sm">Notifications</span>
            </div>

            <div
              className="flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
              onClick={() => handleNavigation('/enhanced-tms/settings')}
            >
              <Settings className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span className="font-medium text-sm">Settings</span>
            </div>
          </nav>
        </div>
      </div>

      {/* User Profile - Pinned to Bottom */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="relative">
          <div
            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-all duration-200 group"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400">{getRoleDisplayName(user.role)}</p>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                showUserMenu ? 'rotate-180' : ''
              }`} 
            />
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700/50 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-700/50">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
                <p className="text-xs text-slate-500 mt-1">{user.designation}</p>
              </div>
              
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleNavigation('/enhanced-tms/profile');
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleNavigation('/enhanced-tms/settings');
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                
                <div className="border-t border-slate-700/50 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}