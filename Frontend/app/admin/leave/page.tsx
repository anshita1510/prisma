'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLeavePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new leave management page
    router.replace('/admin/leave-management');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to Leave Management...</p>
      </div>
    </div>
  );
}
