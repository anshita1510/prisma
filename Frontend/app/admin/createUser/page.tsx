import React from 'react'
import Sidebar from '../_components/Sidebar_A'
import CreateUserForm from '../_components/CreateUserForm'
import UserList from '../_components/UserList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'

export default function CreateUserPage() {
  return (
    <div>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Create and manage user accounts</p>
          </div>
          <div className="p-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="create">Create New User</TabsTrigger>
                <TabsTrigger value="manage">Manage Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create">
                <CreateUserForm />
              </TabsContent>
              
              <TabsContent value="manage">
                <UserList />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
