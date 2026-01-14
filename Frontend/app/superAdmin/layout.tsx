"use client";

import { SuperAdminRoute } from '@/lib/auth/ProtectedRoute';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperAdminRoute>
      {children}
    </SuperAdminRoute>
  );
}
