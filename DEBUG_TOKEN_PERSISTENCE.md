# 🔍 Debug Token Persistence Issue

## Problem
Token is being cleared on page refresh despite being stored in localStorage.

## Debugging Steps

### Step 1: Check Browser Console

Open your browser console (F12) and look for these logs when you refresh:

```
🔄 Initializing auth from storage...
📦 Storage check: { hasToken: true/false, hasUser: true/false }
👤 Parsed user: { id: ..., role: ..., name: ... }
✅ Auth restored from localStorage
```

### Step 2: Check localStorage Before Refresh

```javascript
// Run in console BEFORE refresh
console.log('Token before refresh:', localStorage.getItem('token'));
console.log('User before refresh:', localStorage.getItem('user'));
```

### Step 3: Check localStorage After Refresh

```javascript
// Run in console AFTER refresh
console.log('Token after refresh:', localStorage.getItem('token'));
console.log('User after refresh:', localStorage.getItem('user'));
```

### Step 4: Check for 401 Errors

Look in Network tab for any API calls returning 401 status. These will trigger token clearing.

## Common Causes

### 1. Axios Interceptor Clearing Token on 401

**File**: `Frontend/lib/axios.ts` or `Frontend/lib/axios-interceptor.ts`

```typescript
// This code clears token on 401 errors
if (status === 401) {
  localStorage.removeItem('token');  // ❌ This might be the issue
  localStorage.removeItem('user');
}
```

**Solution**: Make sure no API calls are being made on page load that return 401.

### 2. Multiple Axios Instances

You have TWO axios files:
- `Frontend/lib/axios.ts`
- `Frontend/lib/axios-interceptor.ts`

Both have interceptors that clear tokens on 401. This might cause conflicts.

### 3. API Call on Page Load

Check if any component is making an API call on mount that fails with 401.

## Quick Fix

### Option 1: Add Logging to Axios Interceptor

Add this to `Frontend/lib/axios.ts`:

```typescript
if (status === 401) {
  console.log('🚨 401 Error - About to clear token');
  console.log('🚨 URL:', error.config?.url);
  console.log('🚨 Current path:', window.location.pathname);
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
```

### Option 2: Prevent Token Clearing on Login Page

```typescript
if (status === 401) {
  // Don't clear token if we're already on login page
  if (!window.location.pathname.includes('/login')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
```

### Option 3: Disable Axios Interceptor Temporarily

Comment out the token clearing in axios interceptor to test:

```typescript
if (status === 401) {
  // localStorage.removeItem('token');  // ❌ Commented out for testing
  // localStorage.removeItem('user');
  console.log('401 error but NOT clearing token for debugging');
}
```

## Test Script

Run this in your browser console to monitor token changes:

```javascript
// Monitor localStorage changes
const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;

localStorage.setItem = function(key, value) {
  if (key === 'token') {
    console.log('✅ Token SET:', value.substring(0, 20) + '...');
    console.trace('Set from:');
  }
  return originalSetItem.apply(this, arguments);
};

localStorage.removeItem = function(key) {
  if (key === 'token') {
    console.log('❌ Token REMOVED');
    console.trace('Removed from:');
  }
  return originalRemoveItem.apply(this, arguments);
};

console.log('🔍 Token monitoring enabled');
```

## Expected Behavior

### On Login
```
1. User enters credentials
2. Backend returns token
3. Token stored in localStorage ✅
4. Token stored in cookie ✅
5. Console shows: "✅ Token stored in localStorage and cookie"
```

### On Page Refresh
```
1. Page reloads
2. AuthContext initializes
3. Reads token from localStorage ✅
4. Console shows: "✅ Auth restored from localStorage"
5. Token should still be there ✅
```

### What's Happening (Bug)
```
1. Page reloads
2. AuthContext initializes
3. Reads token from localStorage ✅
4. Some API call returns 401 ❌
5. Axios interceptor clears token ❌
6. Token vanishes ❌
```

## Solution

The issue is likely that:
1. An API call is being made on page load
2. That API call returns 401 (unauthorized)
3. The axios interceptor catches the 401 and clears the token

### Fix: Prevent API Calls Before Auth Check

Make sure no API calls are made until AuthContext has initialized:

```typescript
// In your components
const { isLoading, isAuthenticated } = useAuth();

if (isLoading) {
  return <div>Loading...</div>;
}

if (!isAuthenticated) {
  return <div>Not authenticated</div>;
}

// Only make API calls after auth is confirmed
useEffect(() => {
  if (isAuthenticated) {
    fetchData();  // ✅ Safe to call now
  }
}, [isAuthenticated]);
```

## Next Steps

1. Add the monitoring script to your console
2. Login to your app
3. Refresh the page
4. Check console for "Token REMOVED" message
5. Look at the stack trace to see what's clearing it
6. Fix that code

