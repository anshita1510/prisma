# ✅ Testing Checklist - Login Redirect Fix

## Before Testing

- [ ] Backend server is running (`cd Backend && npm run dev`)
- [ ] Frontend server is running (`cd Frontend && npm run dev`)
- [ ] Browser cache cleared OR using incognito mode
- [ ] Using `http://localhost:3000` (not 127.0.0.1)

## Test 1: Admin Login ✅

- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter admin credentials
- [ ] Click "Sign in"
- [ ] **Expected:** Redirects to `/admin` dashboard
- [ ] **Expected:** No infinite redirects
- [ ] **Expected:** Can see admin content

### Verify Storage:
- [ ] Open DevTools (F12) → Application → Cookies
- [ ] **Expected:** See `token` cookie with JWT value
- [ ] Open DevTools → Application → Local Storage
- [ ] **Expected:** See `token` and `user` entries

## Test 2: Manager Login ✅

- [ ] Logout (if logged in)
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter manager credentials
- [ ] Click "Sign in"
- [ ] **Expected:** Redirects to `/manager` dashboard
- [ ] **Expected:** Can see manager content

## Test 3: Employee Login ✅

- [ ] Logout (if logged in)
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter employee credentials
- [ ] Click "Sign in"
- [ ] **Expected:** Redirects to `/user` dashboard
- [ ] **Expected:** Can see employee content

## Test 4: Direct URL Access (Protected Routes) ✅

### Without Login:
- [ ] Clear storage (logout)
- [ ] Try to access `http://localhost:3000/admin`
- [ ] **Expected:** Redirects to `/login`
- [ ] Try to access `http://localhost:3000/manager`
- [ ] **Expected:** Redirects to `/login`

### With Wrong Role:
- [ ] Login as Employee
- [ ] Try to access `http://localhost:3000/admin`
- [ ] **Expected:** Shows "Access Denied" page OR redirects to `/user`
- [ ] Try to access `http://localhost:3000/manager`
- [ ] **Expected:** Shows "Access Denied" page OR redirects to `/user`

## Test 5: Token Expiration ✅

- [ ] Login successfully
- [ ] Wait for token to expire (or manually expire it)
- [ ] Try to access any protected page
- [ ] **Expected:** Redirects to `/login?session=expired`
- [ ] **Expected:** See "Session expired" message

## Test 6: Logout ✅

- [ ] Login successfully
- [ ] Click logout button
- [ ] **Expected:** Redirects to `/login`
- [ ] Check DevTools → Application → Cookies
- [ ] **Expected:** `token` cookie is removed
- [ ] Check DevTools → Application → Local Storage
- [ ] **Expected:** `token` and `user` are removed

## Test 7: API Calls ✅

- [ ] Login successfully
- [ ] Open DevTools → Network tab
- [ ] Navigate to a page that makes API calls
- [ ] Check API request headers
- [ ] **Expected:** See `Authorization: Bearer <token>` header
- [ ] **Expected:** API calls succeed (200 status)

## Test 8: Browser Refresh ✅

- [ ] Login successfully
- [ ] Navigate to dashboard
- [ ] Press F5 (refresh page)
- [ ] **Expected:** Stays on dashboard (doesn't redirect to login)
- [ ] **Expected:** User data still visible

## Test 9: Multiple Tabs ✅

- [ ] Login in Tab 1
- [ ] Open Tab 2 with same site
- [ ] Navigate to protected page in Tab 2
- [ ] **Expected:** Can access protected page (token shared)
- [ ] Logout in Tab 1
- [ ] Try to access protected page in Tab 2
- [ ] **Expected:** Redirects to login

## Test 10: Interactive Test Page ✅

- [ ] Open `test-login-redirect.html` in browser
- [ ] Click "Test Login" with admin credentials
- [ ] **Expected:** Shows success message
- [ ] Click "Check Storage"
- [ ] **Expected:** Shows token in both localStorage and cookie
- [ ] Click "Parse Token"
- [ ] **Expected:** Shows token payload with role and expiration

## Browser Compatibility ✅

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)

## Mobile Testing ✅ (Optional)

- [ ] Test on mobile device or mobile emulator
- [ ] Login works
- [ ] Navigation works
- [ ] Logout works

## Performance Check ✅

- [ ] Login response time < 2 seconds
- [ ] Dashboard loads < 3 seconds
- [ ] No console errors
- [ ] No network errors

## Security Check ✅

- [ ] Token not visible in URL
- [ ] Token in Authorization header (not query params)
- [ ] Expired tokens rejected
- [ ] Invalid tokens rejected
- [ ] Wrong roles denied access

## Common Issues & Solutions

### Issue: Infinite redirect loop
**Solution:**
1. Clear all browser data
2. Restart dev servers
3. Use incognito mode

### Issue: Cookie not set
**Solution:**
1. Use `http://localhost:3000` not `127.0.0.1:3000`
2. Check browser cookie settings
3. Verify SameSite policy

### Issue: "Session expired" immediately
**Solution:**
1. Check JWT_SECRET matches in backend
2. Verify token expiration time
3. Check system clock is correct

### Issue: Access denied for correct role
**Solution:**
1. Check role name matches exactly (case-sensitive)
2. Verify token payload has correct role
3. Check middleware role configuration

## Final Verification

Run all tests and check:
- [ ] All tests pass ✅
- [ ] No console errors ✅
- [ ] No network errors ✅
- [ ] User experience is smooth ✅
- [ ] Documentation is clear ✅

## Sign Off

- [ ] Tested by: ________________
- [ ] Date: ________________
- [ ] All tests passed: YES / NO
- [ ] Issues found: ________________
- [ ] Ready for production: YES / NO

---

**Testing Guide Version:** 1.0.0
**Last Updated:** January 14, 2026
**Status:** Ready for Testing ✅
