"use client";

import React, { useState, FormEvent, JSX, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Code, 
  Download, 
  Play, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Book,
  Zap,
  Server,
  Key,
  Mail,
  ArrowRight,
  Lock,
  Smartphone,
  User,
  Eye,
  EyeOff
} from "lucide-react";

// --- Types ---
interface LoginResponse {
  token: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "EMPLOYEE";
  userId: string;
}

interface ApiEndpoint {
  method: string;
  url: string;
  description: string;
  requiresAuth: boolean;
  body?: any;
  headers?: any;
}

type AuthProvider = "LOCAL" | "GOOGLE" | "MICROSOFT" | "MOBILE" | "NEW_USER";
type LoginStep = "email" | "password" | "oauth" | "signup";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Email-first flow states
  const [currentStep, setCurrentStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authProvider, setAuthProvider] = useState<AuthProvider | null>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // API documentation states
  const [showPostmanDialog, setShowPostmanDialog] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string>("");

  // Handle logout on page load if logout parameter is present
  useEffect(() => {
    const logout = searchParams.get("logout");
    if (logout === "true") {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("Logged out - cleared localStorage");
    }
  }, [searchParams]);

  // API Endpoints for Postman Collection
  const apiEndpoints: ApiEndpoint[] = [
    {
      method: "POST",
      url: "/api/users/check-user",
      description: "Check user authentication provider",
      requiresAuth: false,
      body: {
        email: "user@example.com"
      }
    },
    {
      method: "POST",
      url: "/api/users/login",
      description: "User login authentication (LOCAL users)",
      requiresAuth: false,
      body: {
        email: "user@example.com",
        password: "password123"
      }
    },
    {
      method: "POST",
      url: "/api/users/google-login",
      description: "Google OAuth login",
      requiresAuth: false,
      body: {
        googleToken: "google_oauth_token",
        email: "user@example.com"
      }
    },
    {
      method: "POST",
      url: "/api/users/microsoft-login",
      description: "Microsoft OAuth login",
      requiresAuth: false,
      body: {
        microsoftToken: "microsoft_oauth_token",
        email: "user@example.com"
      }
    },
    {
      method: "POST",
      url: "/api/users/superAdmin",
      description: "Create super admin user",
      requiresAuth: false,
      body: {
        firstName: "Super",
        lastName: "Admin",
        email: "admin@example.com",
        phone: "+1234567890",
        designation: "Super Administrator"
      }
    },
    {
      method: "POST",
      url: "/api/users/register",
      description: "Invite new employee (Admin only)",
      requiresAuth: true,
      headers: {
        "Authorization": "Bearer {{token}}"
      },
      body: {
        email: "employee@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        designation: "Developer",
        role: "EMPLOYEE",
        employeeCode: "EMP001"
      }
    },
    {
      method: "GET",
      url: "/api/users/me",
      description: "Get current user profile",
      requiresAuth: true,
      headers: {
        "Authorization": "Bearer {{token}}"
      }
    }
  ];

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/check-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to check user");

      const provider = data.provider as AuthProvider;
      setAuthProvider(provider);

      switch (provider) {
        case "LOCAL":
          setCurrentStep("password");
          break;
        case "GOOGLE":
          setCurrentStep("oauth");
          handleGoogleLogin();
          break;
        case "MICROSOFT":
          setCurrentStep("oauth");
          handleMicrosoftLogin();
          break;
        case "NEW_USER":
          setCurrentStep("signup");
          break;
        default:
          setError("Unknown authentication provider");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      // Extract token and user from response (backend returns {user, token})
      const { token, user } = data;

      if (!token || !user) {
        throw new Error("Invalid response format");
      }

      // Store session data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Set auth_token cookie for middleware (same as OAuth) with 30-day expiration
      const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
      document.cookie = `auth_token=${token}; path=/; max-age=${thirtyDaysInSeconds}; SameSite=Lax`;

      // Route based on role
      const routes: Record<string, string> = {
        SUPER_ADMIN: "/superAdmin",
        ADMIN: "/admin",
        MANAGER: "/manager",
        EMPLOYEE: "/user",
      };

      const targetRoute = routes[user.role as keyof typeof routes];
      
      // Use window.location for hard navigation to bypass middleware issues
      window.location.href = targetRoute || "/dashboard";

    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (emailFromInput?: string) => {
    setLoading(true);
    setError("");

    try {
      // Use backend Passport.js OAuth endpoint
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';
      
      // Redirect to backend's Google OAuth route (Passport.js handles everything)
      window.location.href = `${backendUrl}/api/auth/google`;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
      setCurrentStep("email");
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async (emailFromInput?: string) => {
    setLoading(true);
    setError("");

    try {
      // Use backend Passport.js OAuth endpoint (if implemented)
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';
      
      // Redirect to backend's Microsoft OAuth route
      window.location.href = `${backendUrl}/api/auth/microsoft`;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Microsoft login failed");
      setCurrentStep("email");
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setPassword("");
    setError("");
    setAuthProvider(null);
  };

  const handleDirectProviderLogin = async (provider: "GOOGLE" | "MICROSOFT" | "MOBILE") => {
    // If user has entered email, check their auth provider first
    if (email.trim()) {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/check-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.toLowerCase().trim() }),
        });

        const data = await res.json();
        
        if (res.ok && data.provider) {
          // Check if the user's auth provider matches the selected provider
          if (data.provider === "LOCAL") {
            setError(`This email is registered with password login. Please use the "Continue" button or "Continue with Username" instead.`);
            setLoading(false);
            return;
          } else if (data.provider !== provider && data.provider !== "NEW_USER") {
            setError(`This email is registered with ${data.provider} login. Please use the correct login method.`);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        // If check fails, continue with OAuth anyway
        console.warn("Failed to check user provider:", err);
      } finally {
        setLoading(false);
      }
    }

    // Proceed with OAuth login
    setAuthProvider(provider);
    setCurrentStep("oauth");

    if (provider === "GOOGLE") {
      handleGoogleLogin(email.trim() || undefined);
    } else if (provider === "MICROSOFT") {
      handleMicrosoftLogin(email.trim() || undefined);
    } else if (provider === "MOBILE") {
      setError("Mobile login not implemented yet");
      setCurrentStep("email");
    }
  };

  // Postman integration functions (keeping the existing ones)
  const generatePostmanCollection = () => {
    const collection = {
      info: {
        name: "PRIMA API Collection - PRIMA Auth",
        description: "Complete API collection for PRIMA with PRIMA-style authentication",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      variable: [
        {
          key: "baseUrl",
          value: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
          type: "string"
        },
        {
          key: "token",
          value: "",
          type: "string"
        }
      ],
      item: apiEndpoints.map(endpoint => ({
        name: endpoint.description,
        request: {
          method: endpoint.method,
          header: [
            {
              key: "Content-Type",
              value: "application/json",
              type: "text"
            },
            ...(endpoint.headers ? Object.entries(endpoint.headers).map(([key, value]) => ({
              key,
              value: value as string,
              type: "text"
            })) : [])
          ],
          body: endpoint.body ? {
            mode: "raw",
            raw: JSON.stringify(endpoint.body, null, 2),
            options: {
              raw: {
                language: "json"
              }
            }
          } : undefined,
          url: {
            raw: "{{baseUrl}}" + endpoint.url,
            host: ["{{baseUrl}}"],
            path: endpoint.url.split('/').filter(p => p)
          }
        },
        response: []
      }))
    };

    return collection;
  };

  const downloadPostmanCollection = () => {
    const collection = generatePostmanCollection();
    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PRIMA-PRIMA-auth-collection.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const testEndpoint = async (endpoint: ApiEndpoint) => {
    setTestLoading(true);
    try {
      const headers: any = {
        'Content-Type': 'application/json'
      };

      if (endpoint.requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint.url}`, {
        method: endpoint.method,
        headers,
        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
      });

      const data = await response.json();
      setTestResults({
        endpoint: endpoint.description,
        status: response.status,
        success: response.ok,
        data
      });
    } catch (error) {
      setTestResults({
        endpoint: endpoint.description,
        status: 'Error',
        success: false,
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setTestLoading(false);
    }
  };

  const copyToClipboard = (text: string, endpointUrl: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpointUrl);
    setTimeout(() => setCopiedEndpoint(""), 2000);
  };

  const generateCurlCommand = (endpoint: ApiEndpoint) => {
    let curl = `curl -X ${endpoint.method} "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint.url}"`;
    
    curl += ` -H "Content-Type: application/json"`;
    
    if (endpoint.requiresAuth) {
      curl += ` -H "Authorization: Bearer YOUR_TOKEN_HERE"`;
    }
    
    if (endpoint.body) {
      curl += ` -d '${JSON.stringify(endpoint.body)}'`;
    }
    
    return curl;
  };

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to PRIMA</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email to continue
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email or Username
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Enter your email address"
              disabled={loading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Checking...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDirectProviderLogin("GOOGLE")}
          disabled={loading}
          className="w-full py-3 border-gray-300 hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              G
            </div>
            Continue with Google
          </div>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleDirectProviderLogin("MICROSOFT")}
          disabled={loading}
          className="w-full py-3 border-gray-300 hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            Continue with Microsoft
          </div>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleDirectProviderLogin("MOBILE")}
          disabled={loading}
          className="w-full py-3 border-gray-300 hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-gray-600" />
            Continue with Mobile
          </div>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!email.trim()) {
              setError("Please enter your email first");
              return;
            }
            setCurrentStep("password");
          }}
          disabled={loading}
          className="w-full py-3 border-gray-300 hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-600" />
            Continue with Username
          </div>
        </Button>
      </div>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Enter your password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {email}
        </p>
      </div>

      <form onSubmit={handlePasswordLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Enter your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBackToEmail}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to email
          </button>
          <button
            type="button"
            onClick={() => router.push("/Forget_pass")}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          disabled={loading || !password.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );

  const renderOAuthStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Redirecting...</h2>
        <p className="mt-2 text-sm text-gray-600">
          Signing you in with {authProvider === "GOOGLE" ? "Google" : "Microsoft"}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>

      <div className="text-center">
        <button
          onClick={handleBackToEmail}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          ← Back to email
        </button>
      </div>
    </div>
  );

  const renderSignupStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          {email} is not registered yet
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          Account creation is currently handled by administrators. Please contact your system administrator to get access.
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={handleBackToEmail}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          ← Back to email
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* --- Left Half: The Form --- */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:flex-none lg:w-1/2 xl:w-[40%]">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-black tracking-tight text-blue-600">PRIMA.</h1>
              <Dialog open={showPostmanDialog} onOpenChange={setShowPostmanDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    API Docs
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Server className="w-5 h-5" />
                      PRIMA API Documentation - PRIMA Auth
                    </DialogTitle>
                    <DialogDescription>
                      Test endpoints, download Postman collection, and explore the PRIMA-style authentication API
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="endpoints" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
                      <TabsTrigger value="postman">Postman Collection</TabsTrigger>
                      <TabsTrigger value="testing">Live Testing</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="endpoints" className="space-y-4">
                      <div className="grid gap-4">
                        {apiEndpoints.map((endpoint, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                                    {endpoint.method}
                                  </Badge>
                                  <code className="text-sm">{endpoint.url}</code>
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                  {endpoint.requiresAuth && (
                                    <Badge variant="outline" className="text-xs">
                                      <Key className="w-3 h-3 mr-1" />
                                      Auth Required
                                    </Badge>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(generateCurlCommand(endpoint), endpoint.url)}
                                  >
                                    {copiedEndpoint === endpoint.url ? (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <CardDescription>{endpoint.description}</CardDescription>
                            </CardHeader>
                            {(endpoint.body || endpoint.headers) && (
                              <CardContent>
                                {endpoint.body && (
                                  <div className="mb-3">
                                    <h4 className="text-sm font-medium mb-2">Request Body:</h4>
                                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                                      {JSON.stringify(endpoint.body, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {endpoint.headers && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Headers:</h4>
                                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                                      {JSON.stringify(endpoint.headers, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="postman" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            Download Postman Collection
                          </CardTitle>
                          <CardDescription>
                            Get the complete API collection for Postman with PRIMA-style authentication
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Button onClick={downloadPostmanCollection} className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Collection JSON
                          </Button>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">PRIMA-style Authentication Flow:</h4>
                            <ol className="text-sm space-y-1 list-decimal list-inside">
                              <li>Call /check-user with email to determine auth provider</li>
                              <li>Based on response, use appropriate login method</li>
                              <li>For LOCAL users: use /login with email + password</li>
                              <li>For GOOGLE users: use /google-login with OAuth token</li>
                              <li>For MICROSOFT users: use /microsoft-login with OAuth token</li>
                              <li>Store JWT token for authenticated requests</li>
                            </ol>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Environment Variables:</h4>
                            <div className="space-y-2 text-sm">
                              <div><code>baseUrl</code>: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}</div>
                              <div><code>token</code>: Your JWT token (set after login)</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="testing" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Live API Testing
                          </CardTitle>
                          <CardDescription>
                            Test PRIMA-style authentication endpoints directly from the browser
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-2">
                            {apiEndpoints.slice(0, 5).map((endpoint, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                onClick={() => testEndpoint(endpoint)}
                                disabled={testLoading}
                                className="justify-start"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                {endpoint.method} {endpoint.url}
                              </Button>
                            ))}
                          </div>
                          
                          {testResults && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                  {testResults.success ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                  )}
                                  {testResults.endpoint} - Status: {testResults.status}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-40">
                                  {JSON.stringify(testResults.data, null, 2)}
                                </pre>
                              </CardContent>
                            </Card>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}

          {/* Render different steps based on current state */}
          {currentStep === "email" && renderEmailStep()}
          {currentStep === "password" && renderPasswordStep()}
          {currentStep === "oauth" && renderOAuthStep()}
          {currentStep === "signup" && renderSignupStep()}
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need API access? Check out our{" "}
              <button
                onClick={() => setShowPostmanDialog(true)}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                API documentation
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* --- Right Half: Visual/Interactive Panel --- */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070"
          alt="Office Background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-800/60 to-transparent backdrop-blur-[2px] flex flex-col justify-end p-20 text-white">
          <blockquote className="space-y-2">
            <p className="text-3xl font-medium">
              "PRIMA's smart authentication system makes login seamless across all platforms."
            </p>
            <footer className="text-lg opacity-80">— The Development Team</footer>
          </blockquote>
          
          <div className="mt-8 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-2">PRIMA-Style Authentication</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Email-first login flow</li>
              <li>• Smart provider detection</li>
              <li>• Google & Microsoft OAuth integration</li>
              <li>• Seamless user experience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}