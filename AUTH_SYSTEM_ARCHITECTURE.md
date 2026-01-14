# 🏗️ Authentication System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        TIKR AUTH SYSTEM                         │
│                     (3-Layer Protection)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         LAYER 1: EDGE                           │
│                    (Next.js Middleware)                         │
├─────────────────────────────────────────────────────────────────┤
│  • Runs before page loads                                       │
│  • Checks for token existence                                   │
│  • Basic token validation                                       │
│  • Role-based routing                                           │
│  • Blocks unauthenticated requests                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      LAYER 2: FRONTEND                          │
│                  (React Components & Hooks)                     │
├─────────────────────────────────────────────────────────────────┤
│  • AuthContext - Global state                                   │
│  • AuthGuard - Component protection                             │
│  • ProtectedRoute - Route wrappers                              │
│  • useAuthGuard - Custom hook                                   │
│  • Axios Interceptor - API calls                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      LAYER 3: BACKEND                           │
│                    (Express Middleware)                         │
├─────────────────────────────────────────────────────────────────┤
│  • JWT verification                                             │
│  • Token expiration check                                       │
│  • User status validation                                       │
│  • Role-based authorization                                     │
│  • Database validation                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   Root Layout        │
│   (app/layout.tsx)   │
│                      │
│  ┌────────────────┐  │
│  │ AuthProvider   │  │  ← Wraps entire app
│  │                │  │
│  │  • user        │  │
│  │  • token       │  │
│  │  • login()     │  │
│  │  • logout()    │  │
│  │  • checkAuth() │  │
│  └────────────────┘  │
└──────────────────────┘
          ↓
┌──────────────────────────────────────────────────────────────┐
│                    Protected Layouts                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  /admin/*          /manager/*        /superAdmin/*          │
│  ┌──────────┐     ┌──────────┐      ┌──────────┐          │
│  │AdminRoute│     │ManagerRt │      │SuperAdmin│          │
│  │          │     │          │      │  Route   │          │
│  │ Allows:  │     │ Allows:  │      │          │          │
│  │ • ADMIN  │     │ • MANAGER│      │ Allows:  │          │
│  │ • S_ADMIN│     │ • ADMIN  │      │ • S_ADMIN│          │
│  └──────────┘     │ • S_ADMIN│      └──────────┘          │
│                   └──────────┘                             │
│                                                              │
│  /user/*                                                     │
│  ┌──────────┐                                               │
│  │EmployeeRt│                                               │
│  │          │                                               │
│  │ Allows:  │                                               │
│  │ • ALL    │                                               │
│  └──────────┘                                               │
└──────────────────────────────────────────────────────────────┘
          ↓
┌──────────────────────────────────────────────────────────────┐
│                      Page Components                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Can use:                                                    │
│  • useAuth() hook                                            │
│  • useAuthGuard() hook                                       │
│  • axiosInstance for API calls                               │
│  • authUtils for helpers                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Navigate to /admin
       ↓
┌─────────────────────┐
│  Next.js Middleware │
│  (middleware.ts)    │
└──────┬──────────────┘
       │
       │ 2. Check token in cookie/header
       │
       ├─── No Token ────────────────┐
       │                             ↓
       │                    ┌─────────────────┐
       │                    │ Redirect to     │
       │                    │ /login          │
       │                    └─────────────────┘
       │
       ├─── Has Token ───────────────┐
       ↓                             │
┌─────────────────────┐              │
│  Parse JWT Payload  │              │
│  (Basic check)      │              │
└──────┬──────────────┘              │
       │                             │
       │ 3. Check role               │
       │                             │
       ├─── Wrong Role ──────────────┤
       │                             ↓
       │                    ┌─────────────────┐
       │                    │ Redirect to     │
       │                    │ user dashboard  │
       │                    └─────────────────┘
       │
       ├─── Correct Role ────────────┐
       ↓                             │
┌─────────────────────┐              │
│  Allow Navigation   │              │
│  to Page            │              │
└──────┬──────────────┘              │
       │                             │
       │ 4. Page loads               │
       ↓                             │
┌─────────────────────┐              │
│  AuthGuard          │              │
│  Component          │              │
└──────┬──────────────┘              │
       │                             │
       │ 5. Verify with backend      │
       ↓                             │
┌─────────────────────┐              │
│  API: /users/me     │              │
│  with Bearer token  │              │
└──────┬──────────────┘              │
       │                             │
       │ 6. Backend validates        │
       ↓                             │
┌─────────────────────┐              │
│  Auth Middleware    │              │
│  (Backend)          │              │
└──────┬──────────────┘              │
       │                             │
       ├─── Invalid ─────────────────┤
       │                             ↓
       │                    ┌─────────────────┐
       │                    │ Logout + Redirect│
       │                    │ to /login       │
       │                    └─────────────────┘
       │
       ├─── Valid ───────────────────┐
       ↓                             │
┌─────────────────────┐              │
│  Return user data   │              │
└──────┬──────────────┘              │
       │                             │
       │ 7. Update AuthContext       │
       ↓                             │
┌─────────────────────┐              │
│  Render Page        │              │
│  Content            │              │
└─────────────────────┘              │
                                     │
                                     ↓
                            ┌─────────────────┐
                            │  User sees      │
                            │  protected page │
                            └─────────────────┘
```

## API Request Flow

```
┌─────────────────┐
│  Component      │
│  makes API call │
└────────┬────────┘
         │
         │ axiosInstance.get('/api/users')
         ↓
┌─────────────────────────┐
│  Axios Interceptor      │
│  (Request)              │
└────────┬────────────────┘
         │
         │ 1. Get token from localStorage
         │ 2. Add Authorization header
         ↓
┌─────────────────────────┐
│  HTTP Request           │
│  Authorization: Bearer  │
│  <token>                │
└────────┬────────────────┘
         │
         │ 3. Send to backend
         ↓
┌─────────────────────────┐
│  Backend Middleware     │
│  (authenticateToken)    │
└────────┬────────────────┘
         │
         │ 4. Verify JWT
         │ 5. Check expiration
         │ 6. Validate user
         │
         ├─── Valid ──────────────┐
         │                        ↓
         │               ┌─────────────────┐
         │               │ Process request │
         │               │ Return data     │
         │               └────────┬────────┘
         │                        │
         │                        ↓
         │               ┌─────────────────┐
         │               │ Response 200    │
         │               │ { success, data}│
         │               └────────┬────────┘
         │                        │
         ├─── Invalid ────────────┤
         ↓                        │
┌─────────────────────────┐      │
│  Response 401           │      │
│  { code: TOKEN_EXPIRED }│      │
└────────┬────────────────┘      │
         │                        │
         │ 6. Return to frontend  │
         ↓                        ↓
┌─────────────────────────────────┐
│  Axios Interceptor              │
│  (Response)                     │
└────────┬────────────────────────┘
         │
         │ 7. Check status code
         │
         ├─── 401 ────────────────┐
         │                        ↓
         │               ┌─────────────────┐
         │               │ Clear localStorage│
         │               │ Redirect to login│
         │               └─────────────────┘
         │
         ├─── 200 ────────────────┐
         ↓                        ↓
┌─────────────────────────────────┐
│  Return data to component       │
└─────────────────────────────────┘
```

## Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      ROLE HIERARCHY                         │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │ SUPER_ADMIN  │
                    │              │
                    │ • Full access│
                    │ • All routes │
                    │ • All APIs   │
                    └──────┬───────┘
                           │
                           │ Inherits all permissions
                           ↓
                    ┌──────────────┐
                    │    ADMIN     │
                    │              │
                    │ • Company    │
                    │   management │
                    │ • User mgmt  │
                    │ • Settings   │
                    └──────┬───────┘
                           │
                           │ Inherits permissions
                           ↓
                    ┌──────────────┐
                    │   MANAGER    │
                    │              │
                    │ • Team mgmt  │
                    │ • Projects   │
                    │ • Reports    │
                    └──────┬───────┘
                           │
                           │ Inherits permissions
                           ↓
                    ┌──────────────┐
                    │   EMPLOYEE   │
                    │              │
                    │ • Own data   │
                    │ • Tasks      │
                    │ • Attendance │
                    └──────────────┘
```

## Access Control Matrix

```
┌────────────────────────────────────────────────────────────────┐
│                    ACCESS CONTROL MATRIX                       │
├────────────────┬──────────┬───────┬─────────┬──────────────────┤
│   Resource     │ S_ADMIN  │ ADMIN │ MANAGER │    EMPLOYEE      │
├────────────────┼──────────┼───────┼─────────┼──────────────────┤
│ System Config  │    ✅    │   ❌  │    ❌   │       ❌         │
│ All Companies  │    ✅    │   ❌  │    ❌   │       ❌         │
│ Company Users  │    ✅    │   ✅  │    ❌   │       ❌         │
│ Create Users   │    ✅    │   ✅  │    ❌   │       ❌         │
│ Delete Users   │    ✅    │   ✅  │    ❌   │       ❌         │
│ All Projects   │    ✅    │   ✅  │    ❌   │       ❌         │
│ Create Project │    ✅    │   ✅  │    ✅   │       ❌         │
│ Team Projects  │    ✅    │   ✅  │    ✅   │       ❌         │
│ Assign Tasks   │    ✅    │   ✅  │    ✅   │       ❌         │
│ View Reports   │    ✅    │   ✅  │    ✅   │       ❌         │
│ Own Tasks      │    ✅    │   ✅  │    ✅   │       ✅         │
│ Own Attendance │    ✅    │   ✅  │    ✅   │       ✅         │
│ Own Profile    │    ✅    │   ✅  │    ✅   │       ✅         │
└────────────────┴──────────┴───────┴─────────┴──────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
└─────────────────────────────────────────────────────────────┘

Layer 1: Edge Protection (Next.js Middleware)
┌─────────────────────────────────────────────────────────────┐
│ • Runs on Vercel Edge Network                               │
│ • Fastest response time                                     │
│ • Basic token check                                         │
│ • Prevents unnecessary page loads                           │
│ • Role-based routing                                        │
└─────────────────────────────────────────────────────────────┘

Layer 2: Client-Side Protection (React Components)
┌─────────────────────────────────────────────────────────────┐
│ • AuthGuard component                                       │
│ • Token verification with backend                           │
│ • Role-based UI rendering                                   │
│ • Automatic token refresh                                   │
│ • User experience optimization                              │
└─────────────────────────────────────────────────────────────┘

Layer 3: API Protection (Express Middleware)
┌─────────────────────────────────────────────────────────────┐
│ • JWT signature verification                                │
│ • Token expiration check                                    │
│ • User status validation                                    │
│ • Database-level checks                                     │
│ • Role-based authorization                                  │
│ • Final security layer                                      │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                           │
└─────────────────────────────────────────────────────────────┘

Backend Error
     ↓
┌─────────────────┐
│ Error Code      │
│ • TOKEN_EXPIRED │
│ • INVALID_TOKEN │
│ • USER_INACTIVE │
│ • NO_TOKEN      │
│ • etc.          │
└────────┬────────┘
         │
         │ HTTP Response
         ↓
┌─────────────────────┐
│ Axios Interceptor   │
│ (Response Handler)  │
└────────┬────────────┘
         │
         │ Check error code
         │
         ├─── TOKEN_EXPIRED ──────┐
         │                        ↓
         │               ┌─────────────────┐
         │               │ Clear storage   │
         │               │ Redirect login  │
         │               │ Show message    │
         │               └─────────────────┘
         │
         ├─── USER_INACTIVE ──────┐
         │                        ↓
         │               ┌─────────────────┐
         │               │ Clear storage   │
         │               │ Show error      │
         │               │ Contact admin   │
         │               └─────────────────┘
         │
         └─── Other errors ───────┐
                                  ↓
                         ┌─────────────────┐
                         │ Show error msg  │
                         │ Log to console  │
                         └─────────────────┘
```

## Token Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                          │
└─────────────────────────────────────────────────────────────┘

1. Login
   ↓
┌─────────────────┐
│ User enters     │
│ credentials     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Backend creates │
│ JWT token       │
│ • id            │
│ • email         │
│ • role          │
│ • exp (24h)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Store in        │
│ localStorage    │
│ • token         │
│ • user          │
└────────┬────────┘
         │
         ↓
2. Usage (0-24 hours)
   ↓
┌─────────────────┐
│ Every API call  │
│ includes token  │
│ in header       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Backend verifies│
│ token on each   │
│ request         │
└────────┬────────┘
         │
         ↓
3. Expiration (after 24h)
   ↓
┌─────────────────┐
│ Token expires   │
│ Backend rejects │
│ with 401        │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Frontend detects│
│ expired token   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Clear storage   │
│ Redirect login  │
│ Show message    │
└─────────────────┘
         │
         ↓
4. Re-login
   (Cycle repeats)
```

## Summary

This architecture provides:

✅ **3-Layer Protection** - Edge, Frontend, Backend
✅ **Role-Based Access** - 4 role levels with hierarchy
✅ **Token Management** - Automatic handling and expiration
✅ **Error Handling** - Graceful error recovery
✅ **User Experience** - Smooth flows and clear feedback
✅ **Security** - Enterprise-grade protection
✅ **Scalability** - Easy to extend and maintain

---

**Architecture Version:** 1.0.0
**Last Updated:** January 14, 2026
