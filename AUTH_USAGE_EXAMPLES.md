# Authentication Guard Usage Examples

Complete examples showing how to use the authentication system in various scenarios.

## 📱 Frontend Examples

### Example 1: Simple Protected Page

```tsx
// app/admin/dashboard/page.tsx
'use client';

export default function AdminDashboard() {
  // This page is automatically protected by app/admin/layout.tsx
  // Only SUPER_ADMIN and ADMIN can access
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome to the admin panel!</p>
    </div>
  );
}
```

### Example 2: Page with Role-Based UI

```tsx
// app/user/dashboard/page.tsx
'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.firstName || user?.name}!
      </h1>
      
      {/* Show to all authenticated users */}
      <Card>
        <h2>My Tasks</h2>
        <TaskList userId={user?.id} />
      </Card>
      
      {/* Show only to managers and above */}
      {hasRole(['ADMIN', 'MANAGER', 'SUPER_ADMIN']) && (
        <Card>
          <h2>Team Overview</h2>
          <TeamStats />
        </Card>
      )}
      
      {/* Show only to admins */}
      {hasRole(['ADMIN', 'SUPER_ADMIN']) && (
        <Card>
          <h2>System Settings</h2>
          <SystemSettings />
        </Card>
      )}
    </div>
  );
}
```

### Example 3: Custom Protected Component

```tsx
// components/AdminOnlyButton.tsx
'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';

interface AdminOnlyButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function AdminOnlyButton({ onClick, children }: AdminOnlyButtonProps) {
  const { hasRole } = useAuth();
  
  // Don't render if user doesn't have permission
  if (!hasRole(['ADMIN', 'SUPER_ADMIN'])) {
    return null;
  }
  
  return (
    <Button onClick={onClick} variant="destructive">
      {children}
    </Button>
  );
}

// Usage
<AdminOnlyButton onClick={handleDelete}>
  Delete User
</AdminOnlyButton>
```

### Example 4: Protected Modal/Dialog

```tsx
// components/CreateUserModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axios-interceptor';

export function CreateUserModal() {
  const { hasRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'EMPLOYEE'
  });
  
  // Only show to admins
  if (!hasRole(['ADMIN', 'SUPER_ADMIN'])) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Token automatically added by axios interceptor
      const response = await axiosInstance.post('/api/users/register', formData);
      
      if (response.data.success) {
        alert('User created successfully!');
        setOpen(false);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Create New User
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            {/* More form fields... */}
            <Button type="submit">Create User</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Example 5: API Call with Error Handling

```tsx
// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios-interceptor';
import { handleAuthError } from '@/lib/auth/authUtils';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Token automatically added by interceptor
      const response = await axiosInstance.get('/api/users');
      
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err: any) {
      // Handle auth errors (token expired, etc.)
      handleAuthError(err);
      
      // Handle other errors
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 6: Custom Auth Hook Usage

```tsx
// app/projects/page.tsx
'use client';

import { useAuthGuard } from '@/lib/auth/useAuthGuard';
import { ProjectList } from '@/components/ProjectList';

export default function ProjectsPage() {
  const { isAuthorized, isLoading, user, hasPermission } = useAuthGuard({
    allowedRoles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    redirectTo: '/login'
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    return null; // Will redirect automatically
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        
        {/* Show create button only to managers and admins */}
        {hasPermission(['ADMIN', 'MANAGER']) && (
          <button className="btn-primary">Create Project</button>
        )}
      </div>
      
      <ProjectList 
        canEdit={hasPermission(['ADMIN', 'MANAGER'])}
        canDelete={hasPermission(['ADMIN'])}
      />
    </div>
  );
}
```

### Example 7: Logout Functionality

```tsx
// components/UserMenu.tsx
'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout(); // Clears token and redirects to login
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            {user?.firstName?.[0] || user?.name?.[0] || 'U'}
          </div>
          <span>{user?.firstName || user?.name}</span>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## 🔧 Backend Examples

### Example 1: Basic Protected Route

```typescript
// Backend/src/modules/users/users.routes.ts
import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { getUserProfile } from './users.controller';

const router = Router();

// Protected route - requires authentication
router.get('/me', authenticateToken, getUserProfile);

export default router;
```

### Example 2: Role-Based Protected Route

```typescript
// Backend/src/modules/admin/admin.routes.ts
import { Router } from 'express';
import { authenticateToken, authorize } from '../../middlewares/auth.middleware';
import { getAllUsers, deleteUser } from './admin.controller';

const router = Router();

// Only admins can access
router.get('/users', 
  authenticateToken, 
  authorize('ADMIN', 'SUPER_ADMIN'),
  getAllUsers
);

// Only super admins can delete users
router.delete('/users/:id',
  authenticateToken,
  authorize('SUPER_ADMIN'),
  deleteUser
);

export default router;
```

### Example 3: Controller with User Context

```typescript
// Backend/src/modules/projects/projects.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMyProjects = async (req: Request, res: Response) => {
  try {
    // User info available from auth middleware
    const userId = req.user.id;
    const companyId = req.user.companyId;
    const userRole = req.user.role;
    
    // Fetch projects based on role
    let projects;
    
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      // Admins see all company projects
      projects = await prisma.project.findMany({
        where: { companyId }
      });
    } else if (userRole === 'MANAGER') {
      // Managers see their department projects
      projects = await prisma.project.findMany({
        where: {
          companyId,
          departmentId: req.user.departmentId
        }
      });
    } else {
      // Employees see only their assigned projects
      projects = await prisma.project.findMany({
        where: {
          companyId,
          members: {
            some: { userId }
          }
        }
      });
    }
    
    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
};
```

### Example 4: Multiple Middleware Chain

```typescript
// Backend/src/modules/tasks/tasks.routes.ts
import { Router } from 'express';
import { authenticateToken, authorize, requireActiveUser } from '../../middlewares/auth.middleware';
import { createTask, updateTask, deleteTask } from './tasks.controller';

const router = Router();

// Create task - managers and admins only, must be active
router.post('/',
  authenticateToken,
  requireActiveUser,
  authorize('ADMIN', 'MANAGER'),
  createTask
);

// Update task - managers and admins only
router.put('/:id',
  authenticateToken,
  authorize('ADMIN', 'MANAGER'),
  updateTask
);

// Delete task - admins only
router.delete('/:id',
  authenticateToken,
  authorize('ADMIN', 'SUPER_ADMIN'),
  deleteTask
);

export default router;
```

### Example 5: Custom Authorization Logic

```typescript
// Backend/src/modules/projects/projects.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Get project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        createdBy: true,
        members: true
      }
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Custom authorization logic
    const canEdit = 
      userRole === 'SUPER_ADMIN' ||
      userRole === 'ADMIN' ||
      (userRole === 'MANAGER' && project.createdById === userId) ||
      project.members.some(m => m.userId === userId && m.role === 'OWNER');
    
    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this project',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: req.body
    });
    
    res.json({
      success: true,
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
};
```

### Example 6: Error Handling with Codes

```typescript
// Backend/src/modules/users/users.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: true,
        company: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
        code: 'USER_INACTIVE'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        employee: user.employee,
        company: user.company
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      code: 'SERVER_ERROR'
    });
  }
};
```

## 🧪 Testing Examples

### Example 1: Test Protected Endpoint

```javascript
// test-protected-endpoint.js
const axios = require('axios');

async function testProtectedEndpoint() {
  const API_URL = 'http://localhost:3001';
  
  try {
    // 1. Login first
    const loginResponse = await axios.post(`${API_URL}/api/users/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // 2. Access protected endpoint
    const profileResponse = await axios.get(`${API_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Protected endpoint accessed');
    console.log('User:', profileResponse.data.user);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testProtectedEndpoint();
```

### Example 2: Test Role-Based Access

```javascript
// test-role-access.js
const axios = require('axios');

async function testRoleAccess() {
  const API_URL = 'http://localhost:3001';
  
  try {
    // Login as employee
    const employeeLogin = await axios.post(`${API_URL}/api/users/login`, {
      email: 'employee@example.com',
      password: 'password123'
    });
    
    const employeeToken = employeeLogin.data.token;
    
    // Try to access admin endpoint
    try {
      await axios.get(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${employeeToken}`
        }
      });
      
      console.log('❌ SECURITY ISSUE: Employee accessed admin endpoint!');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Employee correctly denied access to admin endpoint');
        console.log('Error code:', error.response.data.code);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRoleAccess();
```

## 📝 Summary

These examples demonstrate:

- ✅ Protecting pages with layouts
- ✅ Role-based UI rendering
- ✅ Protected components and modals
- ✅ API calls with automatic token handling
- ✅ Custom authorization logic
- ✅ Error handling with auth errors
- ✅ Backend route protection
- ✅ Role-based middleware
- ✅ User context in controllers
- ✅ Testing authentication

Use these patterns as templates for your own implementation!
