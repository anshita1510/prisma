# Quick Test Guide - Token Persistence

## 🚀 Quick Test (2 minutes)

### Method 1: Using Test File
```bash
# Open the test file in your browser
open test-token-persistence.html
# or
firefox test-token-persistence.html
# or
google-chrome test-token-persistence.html
```

1. Click **"Simulate Login"** button
2. Click **"Refresh Page"** button (or press F5)
3. ✅ Token should still be there after refresh

### Method 2: Using Your App
```bash
# Start your app
cd Frontend
npm run dev
```

1. Go to `http://localhost:3000/login`
2. Login with your credentials
3. Press **F5** to refresh
4. ✅ You should remain logged in (no redirect to login)

## 🔍 Verify in Browser DevTools

### Check localStorage:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Local Storage** → `http://localhost:3000`
4. Look for:
   - ✅ `token` key with JWT value
   - ✅ `user` key with JSON user data

### Check Cookies:
1. In DevTools **Application** tab
2. Click **Cookies** → `http://localhost:3000`
3. Look for:
   - ✅ `token` cookie
   - ✅ Expires: ~30 days from now

### Browser Console Test:
```javascript
// Paste in console (F12 → Console tab)
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
console.log('Cookie:', document.cookie);
```

## ✅ Expected Results

| Action | Expected Behavior |
|--------|------------------|
| Login | Token stored in localStorage + cookie |
| Refresh Page (F5) | Token persists, stay logged in |
| Close & Reopen Tab | Token persists, stay logged in |
| Navigate between pages | Token persists, stay logged in |
| Click Logout | Token cleared, redirect to login |

## ❌ If Token Disappears

1. **Check browser console** for errors
2. **Disable browser extensions** (test in incognito)
3. **Check cookie settings** (allow cookies)
4. **Clear cache** and try again
5. **Check backend logs** for token validation errors

## 🎯 One-Line Test

```bash
# Login → Refresh → Still logged in? ✅
```

## 📊 Success Indicators

- ✅ No redirect to login after refresh
- ✅ User data still visible in UI
- ✅ Token present in localStorage
- ✅ Cookie present with 30-day expiry
- ✅ No console errors

## 🐛 Debug Commands

```javascript
// Check if token exists
!!localStorage.getItem('token')  // Should be true

// Check token age
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token issued:', new Date(payload.iat * 1000));
console.log('Token expires:', new Date(payload.exp * 1000));

// Check cookie
document.cookie.split(';').find(c => c.includes('token'))
```

## 🎉 Done!

If token persists after refresh, the fix is working! 🎊
