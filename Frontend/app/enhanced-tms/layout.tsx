'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthGuard } from '@/lib/auth/AuthGuard';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { name: 'Projects', href: '/enhanced-tms/projects', icon: 'FolderOpen' },
  { name: 'Tasks', href: '/enhanced-tms/tasks', icon: 'CheckSquare' },
  { name: 'Calendar', href: '/enhanced-tms/calendar', icon: 'Calendar' },
  { name: 'Team', href: '/enhanced-tms/team', icon: 'Users' },
];

export default function EnhancedTMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect dashboard to admin dashboard
    if (pathname === '/enhanced-tms/dashboard') {
      router.push('/admin');
      return;
    }
  }, [pathname, router]);

  // Protected layout - only SUPER_ADMIN, ADMIN, and MANAGER can access
  return (
    <AuthGuard allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']} requireAuth={true}>
      <div className="flex-1">
        {children}
      </div>
    </AuthGuard>
  );
}