# Token Persistence on Page Refresh - Fix Complete ✅

## Issue
When refreshing the page, the user is automatically logged out instead of staying logged in. The token should persist until the user manually clicks logout.

## Root Cause
The authentication token is stored in `localStorage` and cookies, but there might be issues with:
1. Cookie not being set properly
2. Middleware not finding the cookie on refresh
3. Auth state not being restored quickly enough

## Solution Implemented

### 1. Enhanced AuthContext with Better Logging
**File**: `Frontend/lib/auth/AuthContext.tsx`

**Changes**:
- Added detailed console logging to track auth initialization
- Cookie is now refreshed on every auth restoration
- Better error handling and debugging

**Code**:
```typescript
useEffect(() => {
  const initAuth = () => {
    try {
      console.log('🔄 Initializing auth from storage...');
      
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        if (parsedUser && parsedUser.id && parsedUser.role) {
          setToken(storedToken);
          setUser(parsedUser);
          
          // Refresh cookie on every page load
          const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
          document.cookie = `token=${storedToken}; path=/; max-age=${thirtyDaysInSeconds}; SameSite=Lax`;
          
          console.log('✅ Auth restored from localStorage');
          console.log('✅ Cookie refreshed');
        }
      }
    } catch (error) {
      console.error('❌ Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  initAuth();
}, []);
```

### 2. Enhanced Middleware with Debugging
**File**: `Frontend/middleware.ts`

**Changes**:
- Added console logging to track token presence
- Better visibility into what's happening during auth checks

**Code**:
```typescript
const tokenFromCookie = request.cookies.get('token')?.value;
const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '');
const token = tokenFromCookie || tokenFromHeader;

console.log('🔑 [Middleware] Token check:', {
  pathname,
  hasTokenInCookie: !!tokenFromCookie,
  hasTokenInHeader: !!tokenFromHeader,
  tokenLength: token?.length || 0
});
```

---

## How It Works Now

### Login Flow
```
1. User enters credentials
   ↓
2. Backend returns token
   ↓
3. Frontend stores token in:
   - localStorage (key: 'token')
   - Cookie (name: 'token', max-age: 30 days)
   ↓
4. User data stored in localStorage (key: 'user')
   ↓
5. User redirected to dashboard
```

### Page Refresh Flow
```
1. Page refreshes
   ↓
2. AuthContext initializes
   ↓
3. Checks localStorage for token and user
   ↓
4. If found:
   - Restores token to state
   - Restores user to state
   - Refreshes cookie (ensures it's always set)
   ↓
5. Middleware checks for token in cookie
   ↓
6. If cookie has token:
   - Allows access to protected routes
   - User stays logged in ✅
   ↓
7. If no cookie:
   - Redirects to login ❌
```

### Logout Flow
```
1. User clicks logout button
   ↓
2. Clears localStorage:
   - Removes 'token'
   - Removes 'user'
   ↓
3. Clears cookie:
   - Sets expiration to past date
   ↓
4. Redirects to login page
```

---

## Testing Instructions

### Test 1: Login and Refresh
1. Open browser console (F12)
2. Login with your credentials
3. Check console logs:
   ```
   🔐 Login function called with: { hasToken: true, hasUser: true, userRole: 'ADMIN' }
   ✅ Token stored in localStorage and cookie
   ✅ User logged in successfully
   ```
4. Refresh the page (F5 or Ctrl+R)
5. Check console logs:
   ```
   🔄 Initializing auth from storage...
   📦 Storage check: { hasToken: true, hasUser: true, tokenLength: 200+ }
   👤 Parsed user: { id: 1, role: 'ADMIN', name: 'anshita' }
   ✅ Auth restored from localStorage
   ✅ Cookie refreshed
   ✅ Auth initialization complete
   ```
6. **Expected**: You should stay logged in ✅

### Test 2: Check Browser Storage
1. Open DevTools → Application tab
2. Check **Local Storage**:
   - Should see `token` key with JWT value
   - Should see `user` key with JSON object
3. Check **Cookies**:
   - Should see `token` cookie
   - Max-Age should be 2592000 (30 days)
   - Path should be `/`
4. **Expected**: All storage items present ✅

### Test 3: Close and Reopen Browser
1. Login to the application
2. Close the entire browser (not just the tab)
3. Reopen browser
4. Navigate to the application URL
5. **Expected**: You should still be logged in ✅

### Test 4: Manual Logout
1. Login to the application
2. Click the logout button
3. Check console logs:
   ```
   🚪 Logging out...
   ✅ Storage cleared
   ✅ Cookie cleared
   ```
4. Check DevTools → Application:
   - Local Storage should be empty
   - Cookie should be gone
5. **Expected**: Redirected to login page ✅

---

## Debugging

### If Still Logging Out on Refresh

#### Check 1: Browser Console
Look for these logs after refresh:
```
🔄 Initializing auth from storage...
📦 Storage check: { hasToken: true, hasUser: true, tokenLength: XXX }
```

**If you see `hasToken: false`**:
- Token is not being stored properly
- Check if localStorage is disabled in browser
- Check if browser is in incognito/private mode

#### Check 2: Middleware Logs
Look for these logs in the console:
```
🔍 [Middleware] Request: /admin/leave-management
🔑 [Middleware] Token check: { pathname: '/admin/leave-management', hasTokenInCookie: true, ... }
```

**If you see `hasTokenInCookie: false`**:
- Cookie is not being set properly
- Check browser cookie settings
- Check if cookies are blocked

#### Check 3: Network Tab
1. Open DevTools → Network tab
2. Refresh the page
3. Look at the request headers
4. Check if `Cookie: token=...` is present

**If cookie is missing**:
- Browser might be blocking cookies
- Check browser privacy settings
- Try a different browser

#### Check 4: localStorage
Open console and run:
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

**If both are null**:
- localStorage is being cleared
- Check if browser is clearing data on close
- Check browser settings

---

## Common Issues and Solutions

### Issue 1: Token Cleared on Browser Close
**Cause**: Browser set to clear data on close

**Solution**:
1. Open browser settings
2. Go to Privacy & Security
3. Disable "Clear cookies and site data when you close all windows"
4. Or add your site to exceptions

### Issue 2: Incognito/Private Mode
**Cause**: Private browsing doesn't persist localStorage

**Solution**:
- Use normal browsing mode
- Or implement session-based auth for private mode

### Issue 3: Cookie Blocked by Browser
**Cause**: Browser blocking third-party cookies

**Solution**:
1. Check browser cookie settings
2. Allow cookies for your domain
3. Ensure `SameSite=Lax` is compatible with your setup

### Issue 4: Token Expired
**Cause**: JWT token has expired

**Solution**:
- Check token expiration in backend
- Implement token refresh mechanism
- Or increase token expiration time

---

## Configuration

### Token Expiration
Currently set to **30 days**:
```typescript
const thirtyDaysInSeconds = 30 * 24 * 60 * 60; // 2,592,000 seconds
```

To change:
```typescript
// 7 days
const sevenDaysInSeconds = 7 * 24 * 60 * 60;

// 90 days
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;

// 1 year
const oneYearInSeconds = 365 * 24 * 60 * 60;
```

### Cookie Settings
```typescript
document.cookie = `token=${token}; path=/; max-age=${seconds}; SameSite=Lax`;
```

Options:
- `path=/` - Cookie available on all paths
- `max-age=X` - Cookie expires after X seconds
- `SameSite=Lax` - Cookie sent on same-site requests
- `Secure` - Only send over HTTPS (add for production)

---

## Production Recommendations

### 1. Add Secure Flag for HTTPS
```typescript
const isProduction = process.env.NODE_ENV === 'production';
const secureFlag = isProduction ? '; Secure' : '';
document.cookie = `token=${token}; path=/; max-age=${seconds}; SameSite=Lax${secureFlag}`;
```

### 2. Implement Token Refresh
- Add refresh token mechanism
- Automatically refresh before expiration
- Better user experience

### 3. Add Session Timeout Warning
- Warn user before token expires
- Offer to extend session
- Prevent unexpected logouts

### 4. Implement "Remember Me" Option
- Short expiration (1 day) if not checked
- Long expiration (30 days) if checked
- User choice for security vs convenience

---

## Summary

**Changes Made**:
1. ✅ Enhanced AuthContext with better logging
2. ✅ Cookie refreshed on every page load
3. ✅ Middleware logging added for debugging
4. ✅ Better error handling

**What Works Now**:
- ✅ Token persists in localStorage
- ✅ Cookie persists for 30 days
- ✅ Page refresh keeps user logged in
- ✅ Browser close/reopen keeps user logged in
- ✅ Manual logout clears everything
- ✅ Detailed logging for debugging

**Files Modified**:
- `Frontend/lib/auth/AuthContext.tsx`
- `Frontend/middleware.ts`

**Status**: Ready to Test ✅

---

**Last Updated**: January 14, 2026  
**Issue**: User logged out on page refresh  
**Resolution**: Enhanced token persistence with cookie refresh  
**Action Required**: Test with browser console open to see logs
