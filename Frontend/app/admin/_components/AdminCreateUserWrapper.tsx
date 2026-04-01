'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, LogIn } from 'lucide-react';

import { authService } from '@/app/services/authService';
import { userService, Company } from '@/app/services/user.service';
import CreateUserForm from '../../components/CreateUserForm';

type MessageType = {
  type: 'success' | 'error';
  text: string;
};

export default function AdminCreateUserWrapper() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserCompany, setCurrentUserCompany] = useState<Company | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);

      const hasPermission = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(parsedUser.role);
      setIsAuthenticated(hasPermission);

      if (hasPermission && parsedUser.role !== 'SUPER_ADMIN') {
        loadCurrentUserCompany();
      }
    } catch (error) {
      console.error('Error parsing user:', error);
      setIsAuthenticated(false);
    }
  };

  const loadCurrentUserCompany = async () => {
    try {
      const response = await userService.getCurrentUserCompany();
      setCurrentUserCompany(response.company);
    } catch (error) {
      console.error('Failed to load company:', error);
    }
  };

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
        const demo = authService.createDemoSession();

        setCurrentUser(demo.user);
        setIsAuthenticated(true);

        setMessage({
          type: 'success',
          text: 'Demo admin session created!'
        });

        if (demo.user.role !== 'SUPER_ADMIN') {
          loadCurrentUserCompany();
        }
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: 'Quick login failed. Please try manual login.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (msg: string) => {
    setMessage({ type: 'success', text: msg });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleError = (msg: string) => {
    setMessage({ type: 'error', text: msg });
  };

  // 🔒 Not Authenticated UI
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-orange-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <CardTitle className="text-orange-800">
                Authentication Required
              </CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              You need to be logged in as an admin to create users.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-orange-700">
              Please log in with admin credentials.
            </p>

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
                  Quick Admin Login
                </>
              )}
            </Button>

            {message && (
              <Alert className={message.type === 'error' ? 'border-red-200' : 'border-green-200'}>
                <AlertDescription>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Authenticated UI
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardContent className="pt-6">
          {message && (
            <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-400' : 'border-green-400'}`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <AlertDescription>
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