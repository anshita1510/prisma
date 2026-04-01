'use client';

import React from 'react';
import Sidebar from '../_components/Sidebar_A';
import AdminCreateUserWrapper from '../_components/AdminCreateUserWrapper';
import UserList from '../_components/UserList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export default function CreateUserPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
      <Sidebar />
      <main className="flex-1 min-w-0 pt-[57px] lg:pt-0">
        <div className="px-6 py-4 sticky top-0 z-10"
          style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>User Management</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Create and manage user accounts</p>
        </div>
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="create">Create New User</TabsTrigger>
              <TabsTrigger value="manage">Manage Users</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <AdminCreateUserWrapper />
            </TabsContent>
            <TabsContent value="manage">
              <UserList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
