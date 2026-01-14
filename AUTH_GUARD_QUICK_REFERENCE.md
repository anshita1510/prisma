# Auth Guard Quick Reference

## 🚀 Quick Start

### Protect a Frontend Page

```tsx
// Option 1: Use existing layout (automatic)
// Pages under /admin, /manager, /superAdmin, /user are auto-protected

// Option 2: Wrap with ProtectedRoute
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
      <YourContent />
    </ProtectedRoute>
  );
}

// Option 3: Use hook
import { useAuthGuard } from '@/lib/auth/useAuthGuard';

export default function MyPage() {
  const { isAuthorized, isLoading } = useAuthGuard({
    allowedRoles: ['ADMIN']
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthorized) return null;
  
  return <YourContent />;
}
```

### Protect a Backend API

```typescript
import { authenticateToken, authorize } from './middlewares/auth.middleware';

// Require authentication
router.get('/api/data', authenticateToken, handler);

// Require specific roles
router.post('/api/admin', 
  authenticateToken, 
  authorize('ADMIN', 'SUPER_ADMIN'),
  handler
);
```

### Make Authenticated API Call

```typescript
import axiosInstance from '@/lib/axios-interceptor';

// Token automatically added
const response = await axiosInstance.get('/api/users/me');
```

### Check User Role in Component

```tsx
import { useAuth } from '@/lib/auth/AuthContext';

function MyComponent() {
  const { user, hasRole } = useAuth();
  
  return (
    <div>
      {hasRole(['ADMIN']) && <AdminButton />}
    </div>
  );
}
```

## 📋 Common Patterns

### Pattern 1: Admin-Only Page

```tsx
// app/admin/settings/page.tsx
export default function SettingsPage() {
  // Already protected by app/admin/layout.tsx
  return <Settings />;
}
```

### Pattern 2: Conditional Rendering by Role

```tsx
import { useAuth } from '@/lib/auth/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div>
      {user?.role === 'ADMIN' && <AdminPanel />}
      {user?.role === 'MANAGER' && <ManagerPanel />}
      {user?.role === 'EMPLOYEE' && <EmployeePanel />}
    </div>
  );
}
```

### Pattern 3: Protected API Endpoint

```typescript
router.post('/api/projects',
  authenticateToken,
  authorize('ADMIN', 'MANAGER'),
  async (req, res) => {
    const userId = req.user.id;
    const companyId = req.user.companyId;
    // Create project
  }
);
```

### Pattern 4: Multi-Role Access

```tsx
import { ManagerRoute } from '@/lib/auth/ProtectedRoute';

// Allows SUPER_ADMIN, ADMIN, and MANAGER
export default function TeamPage() {
  return (
    <ManagerRoute>
      <TeamManagement />
    </ManagerRoute>
  );
}
```

## 🎯 Role Shortcuts

```tsx
import { 
  SuperAdminRoute,  // SUPER_ADMIN only
  AdminRoute,       // SUPER_ADMIN, ADMIN
  ManagerRoute,     // SUPER_ADMIN, ADMIN, MANAGER
  EmployeeRoute     // All roles
} from '@/lib/auth/ProtectedRoute';
```

## 🔑 Auth Utilities

```typescript
import {
  getCurrentUser,
  getAuthToken,
  isAuthenticated,
  hasRole,
  isSuperAdmin,
  isAdmin,
  isManager,
  getDefaultRoute,
  clearAuth,
  setAuth,
  getAuthHeaders
} from '@/lib/auth/authUtils';

// Examples
const user = getCurrentUser();
const token = getAuthToken();
const isAuth = isAuthenticated();
const canAccess = hasRole(['ADMIN', 'MANAGER']);
const headers = getAuthHeaders();
```

## 🛡️ Backend Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `NO_TOKEN` | No auth token provided | Send token in header |
| `TOKEN_EXPIRED` | Token has expired | Re-login required |
| `INVALID_TOKEN` | Token is invalid | Re-login required |
| `USER_NOT_FOUND` | User doesn't exist | Re-login required |
| `USER_INACTIVE` | Account deactivated | Contact admin |
| `INSUFFICIENT_PERMISSIONS` | Wrong role | Access denied |

## 📍 Protected Routes

### Automatic Protection (via layouts)

- `/admin/*` → SUPER_ADMIN, ADMIN
- `/manager/*` → SUPER_ADMIN, ADMIN, MANAGER
- `/superAdmin/*` → SUPER_ADMIN only
- `/user/*` → All authenticated users

### Public Routes

- `/login`
- `/Forget_pass`
- `/set-password`
- `/otp_check`

## 🔄 Auth Flow Diagram

```
User Login
    ↓
Store Token + User
    ↓
Navigate to Protected Route
    ↓
Middleware Checks Token (Edge)
    ↓
AuthGuard Verifies with Backend
    ↓
Check Role Permissions
    ↓
Render Page or Deny Access
```

## 🧪 Testing Checklist

- [ ] Login as EMPLOYEE → Access `/user` ✅ `/admin` ❌
- [ ] Login as MANAGER → Access `/manager` ✅ `/admin` ❌
- [ ] Login as ADMIN → Access `/admin` ✅ `/superAdmin` ❌
- [ ] Login as SUPER_ADMIN → Access all routes ✅
- [ ] Expired token → Auto logout and redirect
- [ ] Direct URL access → Blocked if not authenticated
- [ ] API calls → Token automatically added
- [ ] Invalid token → Redirect to login

## 💡 Pro Tips

1. **Use layouts for route groups** - Easier than wrapping each page
2. **Use axios interceptor** - Automatic token handling
3. **Check roles in components** - For conditional UI
4. **Use error codes** - Better error handling
5. **Test with different roles** - Ensure proper access control

## 🆘 Quick Fixes

### Not redirecting to login?
Check middleware.ts is in root of Frontend folder.

### Token not being sent?
Use `axiosInstance` from `lib/axios-interceptor.ts`.

### Access denied for valid role?
Check role names match exactly (case-sensitive).

### Infinite loading?
Check AuthProvider wraps app in layout.tsx.

---

**Need more details?** See `AUTH_GUARD_IMPLEMENTATION.md`
