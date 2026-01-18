'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Loader2, UserPlus, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { authService } from '@/app/services/authService';
import { userService, Company } from '@/app/services/user.service';
import CreateUserForm from '../../components/CreateUserForm';

export default function AdminCreateUserWrapper() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserCompany, setCurrentUserCompany] = useState<Company | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          setCurrentUser(parsedUser);
          const hasPermission = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(parsedUser.role);
          setIsAuthenticated(hasPermission);
          
          if (hasPermission && parsedUser.role !== 'SUPER_ADMIN') {
            // Load current user's company for Admin/Manager
            loadCurrentUserCompany();
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const loadCurrentUserCompany = async () => {
    try {
      const response = await userService.getCurrentUserCompany();
      setCurrentUserCompany(response.company);
    } catch (error: any) {
      console.error('Failed to load current user company:', error);
      // Don't show error for this, as it's not critical
    }
  };

  // Quick login for demo purposes
  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      const result = await authService.quickAdminLogin();
      if (result.success) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setMessage({ 
          type: 'success', 
          text: 'Successfully logged in as admin!' 
        });
        
        if (result.user.role !== 'SUPER_ADMIN') {
          loadCurrentUserCompany();
        }
      } else {
        // Try demo session as fallback
        const demoResult = authService.createDemoSession();
        setCurrentUser(demoResult.user);
        setIsAuthenticated(true);
        setMessage({ 
          type: 'success', 
          text: 'Demo admin session created!' 
        });
        
        if (demoResult.user.role !== 'SUPER_ADMIN') {
          loadCurrentUserCompany();
        }
      }
    } catch (error) {
      console.error('Quick login failed:', error);
      setMessage({ 
        type: 'error', 
        text: 'Quick login failed. Please try manual login.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (successMessage: string) => {
    setMessage({ 
      type: 'success', 
      text: successMessage
    });
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleError = (errorMessage: string) => {
    setMessage({ 
      type: 'error', 
      text: errorMessage
    });
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <CardTitle className="text-orange-800">Authentication Required</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              You need to be logged in as an admin to create users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-orange-700">
                Please log in with admin credentials to access the user creation form.
              </p>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleQuickLogin}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Quick Admin Login (Demo)
                    </>
                  )}
                </Button>
              </div>
              
              {message && (
                <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                  <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold">Create New User</CardTitle>
          </div>
          <CardDescription>
            {currentUser?.role === 'SUPER_ADMIN' 
              ? 'Add a new user to any company in the system.'
              : `Add a new user to ${currentUserCompany?.name || 'your company'}.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Success/Error Messages */}
          {message && (
            <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                  {message.text}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <CreateUserForm
            currentUserRole={currentUser?.role || 'ADMIN'}
            currentUserCompany={currentUserCompany || undefined}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </CardContent>
      </Card>
    </div>
  );
}