'use client';

import React from 'react';
import Sidebar from '../_components/Sidebar_A';
import AdminCreateUserWrapper from '../_components/AdminCreateUserWrapper';
import UserList from '../_components/UserList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export default function CreateUserPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main content with proper offset for sidebar - 64px (16 * 4) on desktop */}
      <div className="lg:ml-16 min-h-screen pt-16 lg:pt-0">
        {/* Page Header */}
        <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Create and manage user accounts</p>
        </div>
        
        {/* User Management Content */}
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
      </div>
    </div>
  );
}
