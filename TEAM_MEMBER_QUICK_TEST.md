# Add Team Member - Quick Test Guide

## Prerequisites
- Backend running on port 5004
- Frontend running on port 3000 or 3001
- Admin user logged in

## Step-by-Step Test

### 1. Login
```
URL: http://localhost:3000/login
Email: admin@tikr.com
Password: Admin@123
```

### 2. Navigate to Team Page
```
URL: http://localhost:3000/enhanced-tms/team
```

You should see:
- Page title: "Enhanced Team"
- Team stats cards (Total Members, Active Now, Tasks Completed, Active Tasks)
- Existing team members displayed as cards
- "Add Team Member" button in top right

### 3. Click "Add Team Member" Button
A modal should open with form fields:
- Name (required)
- Email (required)
- Phone (optional)
- Designation (required)
- Role (dropdown: Employee, Manager, Admin)
- Status (dropdown: Active, Away, Busy, Offline)
- Location (optional)

### 4. Fill in Form
```
Name: Test Employee
Email: test-employee-001@example.com
Phone: 9876543210
Designation: SOFTWARE_ENGINEER
Role: EMPLOYEE
Status: ACTIVE
Location: New York
```

### 5. Click "Add Team Member"
Expected behavior:
- Button shows "Creating..." while loading
- Success message appears: "Team member created successfully!"
- Modal closes after 1.5 seconds
- New team member appears in the grid at the top
- Team stats update (Total Members increases by 1)

### 6. Verify in Browser Console
Open DevTools (F12) and check Console tab:
```
✅ Team member added: Test Employee
📤 Creating employee: {...}
✅ Employee created: {...}
```

### 7. Verify in Database
```sql
-- Check User was created
SELECT * FROM "User" WHERE email = 'test-employee-001@example.com';

-- Check Employee was created
SELECT * FROM "Employee" WHERE name = 'Test Employee';

-- Check they're linked
SELECT e.*, u.email FROM "Employee" e 
JOIN "User" u ON e."userId" = u.id 
WHERE e.name = 'Test Employee';
```

## Expected Results

### Frontend
- ✅ New member card appears in grid
- ✅ Card shows: name, avatar initials, designation, status badge
- ✅ Card shows: email, phone, location
- ✅ Card shows: active tasks (0), completed tasks (0)
- ✅ Status dot shows correct color (green for ACTIVE)
- ✅ No console errors

### Backend
- ✅ POST /api/employees returns 201 Created
- ✅ Response includes: id, name, email, designation, role, status, employeeCode
- ✅ Employee code auto-generated (EMP0001, EMP0002, etc.)
- ✅ User record created with temporary password
- ✅ Employee record created and linked to User

### Database
- ✅ User record exists with email, firstName, lastName, role, status
- ✅ Employee record exists with userId, name, designation, employeeCode
- ✅ Both records have same companyId
- ✅ Employee has departmentId (default: 1)

## Error Scenarios to Test

### 1. Missing Required Fields
**Test**: Submit form without Name
**Expected**: Error message "Name is required"

### 2. Invalid Email
**Test**: Enter "invalid-email" in Email field
**Expected**: Error message "Please enter a valid email address"

### 3. Duplicate Email
**Test**: Use email of existing employee
**Expected**: Error message "Email already exists"

### 4. Unauthorized User
**Test**: Login as non-admin user and try to add member
**Expected**: Error message "Access denied. Insufficient permissions."

### 5. No Token
**Test**: Clear localStorage and try to add member
**Expected**: Error message "No token provided" or "Invalid or expired token"

## Performance Checks

- [ ] Page loads team members within 2 seconds
- [ ] Modal opens instantly
- [ ] Form submission completes within 3 seconds
- [ ] New member appears in grid immediately
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] No console warnings or errors

## Accessibility Checks

- [ ] Form labels are associated with inputs
- [ ] Required fields marked with asterisk (*)
- [ ] Error messages are clear and helpful
- [ ] Modal can be closed with Escape key
- [ ] Tab navigation works through form fields
- [ ] Status colors are not the only indicator (text labels present)

## Browser Compatibility

Test in:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Mobile Responsiveness

- [ ] Modal is readable on mobile
- [ ] Form fields are touch-friendly
- [ ] Team grid adapts to screen size
- [ ] Buttons are clickable on mobile

---

## Troubleshooting

### Issue: 404 Error on /api/employees
**Solution**: 
1. Check backend is running: `curl http://localhost:5004/api/employees`
2. Restart backend: Stop and run `npm run dev` in Backend folder
3. Check routes are registered in server.ts

### Issue: 401 Unauthorized
**Solution**:
1. Check token in localStorage: `localStorage.getItem('token')`
2. Login again to get fresh token
3. Check token is valid: Decode JWT at jwt.io

### Issue: 403 Forbidden
**Solution**:
1. Check user role: `JSON.parse(localStorage.getItem('user')).role`
2. Must be ADMIN or SUPER_ADMIN
3. Login with admin account

### Issue: Email already exists
**Solution**:
1. Use unique email address
2. Check database for existing email: `SELECT * FROM "User" WHERE email = '...';`
3. Delete test records if needed

### Issue: Modal doesn't close
**Solution**:
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify API response is successful (status 201)

### Issue: New member doesn't appear
**Solution**:
1. Check API response includes all required fields
2. Check frontend is calling onSuccess callback
3. Check state update is working: Add console.log in handleAddMemberSuccess
4. Refresh page to verify data was saved

---

## Success Criteria

✅ All tests pass
✅ No console errors
✅ New member appears immediately
✅ Database records created correctly
✅ Error handling works for all scenarios
✅ Mobile responsive
✅ Accessible

**Status**: Ready for production testing
