'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/app/services/authService';
import { enhancedProjectService } from '@/app/services/enhancedProjectService';
import { enhancedTaskService } from '@/app/services/enhancedTaskService';

export default function AccessTestPage() {
  const [user, setUser] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    setUser(currentUser);
  }, []);

  const runAccessTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Check authentication
      results.isAuthenticated = authService.isAuthenticated();
      results.userInfo = authService.getStoredUser();

      // Test 2: Test project API access
      try {
        const projectsResponse = await enhancedProjectService.getProjects();
        results.projectsAPI = {
          success: projectsResponse.success,
          data: projectsResponse.data,
          error: null
        };
      } catch (error: any) {
        results.projectsAPI = {
          success: false,
          data: null,
          error: error.message
        };
      }

      // Test 3: Test project stats API
      try {
        const statsResponse = await enhancedProjectService.getProjectStats();
        results.projectStatsAPI = {
          success: statsResponse.success,
          data: statsResponse.data,
          error: null
        };
      } catch (error: any) {
        results.projectStatsAPI = {
          success: false,
          data: null,
          error: error.message
        };
      }

      // Test 4: Test task API access
      try {
        const tasksResponse = await enhancedTaskService.getMyTasks();
        results.tasksAPI = {
          success: tasksResponse.success,
          data: tasksResponse.data,
          error: null
        };
      } catch (error: any) {
        results.tasksAPI = {
          success: false,
          data: null,
          error: error.message
        };
      }

      // Test 5: Test task stats API
      try {
        const taskStatsResponse = await enhancedTaskService.getTaskStats();
        results.taskStatsAPI = {
          success: taskStatsResponse.success,
          data: taskStatsResponse.data,
          error: null
        };
      } catch (error: any) {
        results.taskStatsAPI = {
          success: false,
          data: null,
          error: error.message
        };
      }

    } catch (error: any) {
      results.generalError = error.message;
    }

    setTestResults(results);
    setLoading(false);
  };

  const createDemoSession = () => {
    authService.createDemoSession();
    setUser(authService.getStoredUser());
  };

  const loginRealAdmin = async () => {
    setLoading(true);
    try {
      const result = await authService.quickAdminLogin();
      if (result.success) {
        setUser(authService.getStoredUser());
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (error: any) {
      alert('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Access Control Test Page</h1>
          <p className="text-gray-600">
            This page helps diagnose access control issues for admin + manager users.
          </p>
        </div>

        {/* User Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current User Information</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Name:</span>
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Role:</span>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Designation:</span>
                  <Badge variant={user.designation === 'MANAGER' ? 'default' : 'secondary'}>
                    {user.designation}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Token:</span>
                  <span className="text-xs text-gray-500">
                    {localStorage.getItem('token') ? 'Present' : 'Missing'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">No user session found</p>
                <div className="space-y-2">
                  <Button onClick={createDemoSession} variant="outline">
                    Create Demo Session (Fake Token)
                  </Button>
                  <Button onClick={loginRealAdmin}>
                    Login Real Admin (admin@tikr.com)
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Access Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={runAccessTests} 
                disabled={loading || !user}
                className="w-full"
              >
                {loading ? 'Running Tests...' : 'Run Access Control Tests'}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 text-center">
                  Please create a demo session first
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Authentication Test */}
                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Authentication Status</h4>
                  <Badge variant={testResults.isAuthenticated ? 'default' : 'destructive'}>
                    {testResults.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </Badge>
                </div>

                {/* Projects API Test */}
                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Projects API Access</h4>
                  <Badge variant={testResults.projectsAPI?.success ? 'default' : 'destructive'}>
                    {testResults.projectsAPI?.success ? 'Success' : 'Failed'}
                  </Badge>
                  {testResults.projectsAPI?.error && (
                    <p className="text-sm text-red-600 mt-2">
                      Error: {testResults.projectsAPI.error}
                    </p>
                  )}
                  {testResults.projectsAPI?.data && (
                    <p className="text-sm text-green-600 mt-2">
                      Data received: {JSON.stringify(testResults.projectsAPI.data, null, 2).substring(0, 200)}...
                    </p>
                  )}
                </div>

                {/* Project Stats API Test */}
                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Project Stats API Access</h4>
                  <Badge variant={testResults.projectStatsAPI?.success ? 'default' : 'destructive'}>
                    {testResults.projectStatsAPI?.success ? 'Success' : 'Failed'}
                  </Badge>
                  {testResults.projectStatsAPI?.error && (
                    <p className="text-sm text-red-600 mt-2">
                      Error: {testResults.projectStatsAPI.error}
                    </p>
                  )}
                  {testResults.projectStatsAPI?.data && (
                    <p className="text-sm text-green-600 mt-2">
                      Stats: {JSON.stringify(testResults.projectStatsAPI.data)}
                    </p>
                  )}
                </div>

                {/* Tasks API Test */}
                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Tasks API Access</h4>
                  <Badge variant={testResults.tasksAPI?.success ? 'default' : 'destructive'}>
                    {testResults.tasksAPI?.success ? 'Success' : 'Failed'}
                  </Badge>
                  {testResults.tasksAPI?.error && (
                    <p className="text-sm text-red-600 mt-2">
                      Error: {testResults.tasksAPI.error}
                    </p>
                  )}
                </div>

                {/* Task Stats API Test */}
                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Task Stats API Access</h4>
                  <Badge variant={testResults.taskStatsAPI?.success ? 'default' : 'destructive'}>
                    {testResults.taskStatsAPI?.success ? 'Success' : 'Failed'}
                  </Badge>
                  {testResults.taskStatsAPI?.error && (
                    <p className="text-sm text-red-600 mt-2">
                      Error: {testResults.taskStatsAPI.error}
                    </p>
                  )}
                </div>

                {/* Raw Results */}
                <div className="border rounded p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Raw Test Results</h4>
                  <pre className="text-xs overflow-auto max-h-64">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/enhanced-tms/dashboard'}>
                Enhanced TMS
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin/project'}>
                Admin Projects
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin/tasks'}>
                Admin Tasks
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/welcome/project'}>
                Welcome Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}