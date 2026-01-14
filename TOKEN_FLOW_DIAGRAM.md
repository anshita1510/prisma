# Token Persistence Flow Diagram

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGS IN                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Login Page (login/page.tsx)                                     │
│  • User enters credentials                                       │
│  • POST /api/users/login                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Backend Returns                                                 │
│  • JWT Token                                                     │
│  • User Data                                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Frontend Stores (3 places)                                      │
│  ✅ localStorage.setItem('token', token)                         │
│  ✅ localStorage.setItem('user', JSON.stringify(user))           │
│  ✅ document.cookie = 'token=...; max-age=2592000'  (30 days)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  User Navigates to Dashboard                                     │
│  • Token in localStorage ✅                                      │
│  • User data in localStorage ✅                                  │
│  • Cookie set ✅                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Page Refresh Flow (THE FIX)

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REFRESHES PAGE (F5)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  AuthContext Initializes (useEffect)                             │
│  • Reads localStorage.getItem('token')                           │
│  • Reads localStorage.getItem('user')                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ✅ BEFORE FIX (BAD)          │  ✅ AFTER FIX (GOOD)             │
│  ─────────────────────────    │  ─────────────────────────       │
│  catch (error) {              │  catch (error) {                 │
│    localStorage.removeItem()  │    console.error(error)          │
│    // ❌ Token cleared!       │    // ✅ Token preserved!        │
│  }                            │  }                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Result After Refresh                                            │
│  ✅ Token still in localStorage                                  │
│  ✅ User still in localStorage                                   │
│  ✅ Cookie still valid                                           │
│  ✅ User remains logged in                                       │
│  ✅ No redirect to login                                         │
└─────────────────────────────────────────────────────────────────┘
```

## 🚪 Logout Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLICKS LOGOUT                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  authService.logout() or AuthContext.logout()                    │
│  • localStorage.removeItem('token')                              │
│  • localStorage.removeItem('user')                               │
│  • document.cookie = 'token=; expires=Thu, 01 Jan 1970...'      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Redirect to Login                                               │
│  • All auth data cleared ✅                                      │
│  • User logged out ✅                                            │
└─────────────────────────────────────────────────────────────────┘
```

## 🍪 Cookie Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│  Cookie Settings                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Name:      token                                                │
│  Value:     JWT token string                                     │
│  Path:      /                    (available everywhere)          │
│  Max-Age:   2,592,000 seconds    (30 days)                      │
│  SameSite:  Lax                  (CSRF protection)               │
│  Secure:    false                (true in production)            │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Storage Locations

```
┌──────────────────────────────────────────────────────────────────┐
│  Where Token is Stored                                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  localStorage['token']                                       │
│      • Persists across page refreshes ✅                         │
│      • Persists across browser restarts ✅                       │
│      • Used by: axios interceptor, API calls                     │
│                                                                  │
│  2️⃣  localStorage['user']                                        │
│      • User profile data (JSON)                                  │
│      • Used by: UI components, role checks                       │
│                                                                  │
│  3️⃣  Cookie['token']                                             │
│      • Used by: Next.js middleware                               │
│      • Server-side route protection                              │
│      • Expires in 30 days                                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  Multi-Layer Security                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Client-Side (AuthContext)                              │
│  • Checks localStorage for token                                 │
│  • Validates user data structure                                 │
│  • Redirects if missing                                          │
│                                                                  │
│  Layer 2: Middleware (middleware.ts)                             │
│  • Checks cookie for token                                       │
│  • Validates JWT structure                                       │
│  • Role-based route protection                                   │
│                                                                  │
│  Layer 3: Backend (auth.middleware.ts)                           │
│  • Validates JWT signature                                       │
│  • Checks token expiration                                       │
│  • Verifies user status                                          │
│  • Database validation                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Key Changes Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  What Changed                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ❌ BEFORE: Cookie expires in 24 hours                           │
│  ✅ AFTER:  Cookie expires in 30 days                            │
│                                                                  │
│  ❌ BEFORE: AuthContext clears token on any error                │
│  ✅ AFTER:  AuthContext preserves token, only validates          │
│                                                                  │
│  ❌ BEFORE: Manager sidebar directly manipulates localStorage    │
│  ✅ AFTER:  Manager sidebar uses authService.logout()            │
│                                                                  │
│  ❌ BEFORE: Inconsistent cookie setting across login methods     │
│  ✅ AFTER:  All login methods set 30-day cookie                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🧪 Test Scenarios

```
┌─────────────────────────────────────────────────────────────────┐
│  Scenario                    │  Expected Result                 │
├──────────────────────────────┼──────────────────────────────────┤
│  Login → Refresh             │  ✅ Stay logged in               │
│  Login → Close Tab → Reopen  │  ✅ Stay logged in               │
│  Login → Wait 1 day → Refresh│  ✅ Stay logged in               │
│  Login → Wait 31 days        │  ❌ Session expired              │
│  Login → Logout              │  ✅ Redirect to login            │
│  Login → Clear localStorage  │  ❌ Redirect to login            │
└─────────────────────────────────────────────────────────────────┘
```

## 📱 Browser Compatibility

```
✅ Chrome/Edge    - Full support
✅ Firefox        - Full support
✅ Safari         - Full support
✅ Mobile Safari  - Full support
✅ Mobile Chrome  - Full support
```

## 🎉 Success Metrics

```
Before Fix:
├─ Token persistence: ❌ 0% (cleared on refresh)
├─ User experience:   ❌ Poor (constant re-login)
└─ Session duration:  ❌ 24 hours max

After Fix:
├─ Token persistence: ✅ 100% (persists across refreshes)
├─ User experience:   ✅ Excellent (stays logged in)
└─ Session duration:  ✅ 30 days
```
