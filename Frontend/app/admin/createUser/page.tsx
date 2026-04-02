'use client';

import React from 'react';
import Sidebar from '../_components/Sidebar_A';
import AdminCreateUserWrapper from '../_components/AdminCreateUserWrapper';
import UserList from '../_components/UserList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export default function CreateUserPage() {
  return (
    <div className="flex min-h-screen page-bg">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-[57px] lg:pt-0 main-content-with-sidebar">
        <div className="px-6 py-6 sticky top-0 z-10 page-header">
          <h1 className="text-3xl font-bold gradient-text pb-1">User Management</h1>
          <p className="text-sm mt-1 text-muted-foreground">Create and manage user accounts in the system</p>
        </div>
        <div className="p-4 sm:p-6 max-w-6xl mx-auto animate-fade-in-up content-area">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 mx-auto bg-card border border-border">
              <TabsTrigger value="create">Create New User</TabsTrigger>
              <TabsTrigger value="manage">Manage Users</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="mt-0">
              <AdminCreateUserWrapper />
            </TabsContent>
            <TabsContent value="manage" className="mt-0">
              <UserList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
