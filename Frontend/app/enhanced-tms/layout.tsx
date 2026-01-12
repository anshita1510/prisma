'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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

  // For Enhanced TMS pages, render without the blue sidebar
  // The admin layout will handle the sidebar
  return (
    <div className="flex-1">
      {children}
    </div>
  );
}