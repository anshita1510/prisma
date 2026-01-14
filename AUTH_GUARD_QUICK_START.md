# 🚀 Auth Guard Quick Start Guide

## Get Started in 5 Minutes

---

## ✅ Your Auth Guard is Already Implemented!

Everything is set up and working. This guide shows you how to use it.

---

## 🎯 Common Tasks

### 1. Protect a New Page

```typescript
// app/new-page/page.tsx
"use client";

import { useAuthGuard } from '@/lib/auth/useAuthGuard';

export default function NewPage() {
  const { isAuthorized, isLoading } = useAuthGuard({
    allowedRoles: ['ADMIN', 'MANAGER']
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthorized) return null;
  
  return <div>Protected Content</div>;
}
```

### 2. Check User Role in Component

```typescript
import { useAuth } from '@/lib/auth/AuthContext';

function MyComponent() {
  const { user, hasRole } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      
      {hasRole(['ADMIN']) && (
        <button>Admin Only Button</button>
      )}
      
      {hasRole(['ADMIN', 'MANAGER']) && (
        <button>Admin or Manager Button</button>
      )}
    </div>
  );
}
```

### 3. Make Protected API Call

```typescript
import axiosInstance from '@/lib/axios-interceptor';

async function fetchData() {
  try {
    // Token automatically added by interceptor
    const response = await axiosInstance.get('/api/users');
    return response.data;
  } catch (error) {
    // Automatically handles 401/403 errors
    console.error('API error:', error);
  }
}
```

### 4. Protect Backend Endpoint

```typescript
// Backend route
import { authenticate, requireRole } from '@/middlewares/auth.middleware';
import { Role } from '@prisma/client';

router.post('/api/admin-action',
  authenticate,              // Verify JWT token
  requireRole(Role.ADMIN),   // Check role
  controller.adminAction     // Execute
);
```

### 5. Logout User

```typescript
import { useAuth } from '@/lib/auth/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

---

## 📋 Role Hierarchy

```
SUPER_ADMIN  →  Full system access
    ↓
ADMIN        →  Company-wide management
    ↓
MANAGER      →  Team & project management
    ↓
EMPLOYEE     →  Limited access
```

---

## 🔑 Available Hooks & Utils

### useAuth Hook

```typescript
const {
  user,              // Current user object
  token,             // JWT token
  isAuthenticated,   // Boolean
  isLoading,         // Boolean
  login,             // Function(token, user)
  logout,            // Function()
  checkAuth,         // Function() → Promise<boolean>
  hasRole            // Function(roles[]) → boolean
} = useAuth();
```

### useAuthGuard Hook

```typescript
const {
  isAuthorized,      // Boolean
  isLoading,         // Boolean
  user,              // Current user
  hasPermission      // Function(roles[]) → boolean
} = useAuthGuard({
  allowedRoles: ['ADMIN'],
  redirectTo: '/login',
  requireAuth: true
});
```

### Auth Utils

```typescript
import {
  getCurrentUser,    // Get user from localStorage
  getAuthToken,      // Get token from localStorage
  isAuthenticated,   // Check if authenticated
  hasRole,           // Check user role
  isSuperAdmin,      // Check if super admin
  isAdmin,           // Check if admin or higher
  isManager,         // Check if manager or higher
  getDefaultRoute,   // Get dashboard route for role
  clearAuth,         // Clear all auth data
  setAuth            // Set token and user
} from '@/lib/auth/authUtils';
```

---

## 🛡️ Protected Routes

| Route | Allowed Roles |
|-------|---------------|
| `/superAdmin/*` | SUPER_ADMIN |
| `/admin/*` | SUPER_ADMIN, ADMIN |
| `/manager/*` | SUPER_ADMIN, ADMIN, MANAGER |
| `/user/*` | All authenticated |
| `/enhanced-tms/*` | All authenticated |

---

## 🔒 Backend Middleware

### Authenticate Only

```typescript
router.get('/api/profile',
  authenticate,
  controller.getProfile
);
```

### Authenticate + Single Role

```typescript
router.post('/api/admin-action',
  authenticate,
  requireRole(Role.ADMIN),
  controller.adminAction
);
```

### Authenticate + Multiple Roles

```typescript
router.post('/api/manager-action',
  authenticate,
  requireAnyRole(Role.ADMIN, Role.MANAGER),
  controller.managerAction
);
```

---

## 🧪 Testing

### Test Login

```bash
curl -X POST http://localhost:5004/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tikr.com","password":"Admin@123"}'
```

### Test Protected Endpoint

```bash
curl http://localhost:5004/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Run Complete Test Suite

```bash
node test-auth-guard-complete.js
```

---

## 🚨 Common Issues & Solutions

### Issue: "Unauthorized" on API calls

**Solution:** Check if token is being sent
```typescript
// Check localStorage
console.log(localStorage.getItem('token'));

// Check if axios interceptor is imported
import axiosInstance from '@/lib/axios-interceptor';
```

### Issue: Redirect loop

**Solution:** Check if route is in public routes list
```typescript
// middleware.ts
const publicRoutes = ['/login', '/Forget_pass', '/set-password'];
```

### Issue: "Session expired" message

**Solution:** Token has expired (30 days). User needs to login again.

### Issue: Can't access admin page as admin

**Solution:** Check user role in localStorage
```typescript
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.role); // Should be 'ADMIN'
```

---

## 📱 Frontend Components

### ProtectedRoute Components

```typescript
import {
  SuperAdminRoute,
  AdminRoute,
  ManagerRoute,
  EmployeeRoute
} from '@/lib/auth/ProtectedRoute';

// Use in layouts
<AdminRoute>
  {children}
</AdminRoute>
```

### AuthGuard Component

```typescript
import { AuthGuard } from '@/lib/auth/AuthGuard';

<AuthGuard 
  allowedRoles={['ADMIN', 'MANAGER']}
  requireAuth={true}
>
  {children}
</AuthGuard>
```

---

## 🎨 Loading States

### Show loading while checking auth

```typescript
function MyPage() {
  const { isLoading, isAuthorized } = useAuthGuard({
    allowedRoles: ['ADMIN']
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthorized) return null;
  
  return <div>Content</div>;
}
```

---

## 🔐 Security Best Practices

✅ **Never store sensitive data in localStorage**
✅ **Always use HTTPS in production**
✅ **Set appropriate token expiration**
✅ **Validate on both frontend and backend**
✅ **Use role-based access control**
✅ **Handle token expiration gracefully**
✅ **Clear auth data on logout**
✅ **Validate user is active**

---

## 📚 File Locations

```
Frontend/
├── middleware.ts                    # Edge middleware
├── lib/auth/
│   ├── AuthContext.tsx             # Auth state
│   ├── AuthGuard.tsx               # Component guard
│   ├── ProtectedRoute.tsx          # Role wrappers
│   ├── useAuthGuard.ts             # Custom hook
│   └── authUtils.ts                # Utilities
└── lib/axios-interceptor.ts        # API interceptor

Backend/
└── src/
    ├── middlewares/
    │   ├── auth.middleware.ts      # JWT verification
    │   └── role.middleware.ts      # Role checking
    └── config/
        └── permissions.config.ts   # Permissions
```

---

## 🎯 Quick Checklist

Before deploying, verify:

- [ ] JWT_SECRET is set in backend .env
- [ ] NEXT_PUBLIC_API_URL is set in frontend .env
- [ ] All protected routes have guards
- [ ] All API endpoints have auth middleware
- [ ] Token expiration is configured
- [ ] Error messages don't expose sensitive info
- [ ] CORS is properly configured
- [ ] HTTPS is enabled in production

---

## 🆘 Need Help?

### Check Documentation
- `AUTH_GUARD_COMPLETE_IMPLEMENTATION.md` - Full details
- `AUTH_GUARD_VISUAL_GUIDE.md` - Visual diagrams
- `AUTH_GUARD_QUICK_START.md` - This file

### Test Your Setup
```bash
node test-auth-guard-complete.js
```

### Debug Mode
```typescript
// Enable in AuthContext
console.log('Auth state:', { user, token, isAuthenticated });
```

---

## 🎉 You're All Set!

Your Auth Guard is fully implemented and ready to use. Just follow the patterns above to protect new pages and endpoints.

**Happy coding! 🚀**
