# Role-Based Team Management - Quick Start Guide

## Prerequisites
- Backend running on port 5004
- Frontend running on port 3000 or 3001
- Database with test users

---

## Test Scenario 1: Admin Managing Users

### Step 1: Login as Admin
```
URL: http://localhost:3000/login
Email: admin@tikr.com
Password: Admin@123
```

### Step 2: Navigate to Team Page
```
URL: http://localhost:3000/enhanced-tms/team
```

### Step 3: Click "Manage Users" Button
- Button appears in top right
- Navigates to `/admin/manage-users`

### Step 4: View Users
- See all users in table format
- Columns: Name, Email, Role, Status, Designation, Phone
- User statistics at top (Total, Admins, Managers, Employees)

### Step 5: Filter Users
- Filter by role: Admin, Manager, Employee
- Search by name, email, or designation
- See filtered results update in real-time

### Expected Results
✅ All users displayed in table
✅ Role badges with correct colors
✅ Status badges showing ACTIVE/PENDING/INACTIVE
✅ Avatar with initials
✅ Statistics update based on filters

---

## Test Scenario 2: Manager Adding Team Member

### Step 1: Login as Manager
```
URL: http://localhost:3000/login
Email: manager@example.com (or any manager account)
Password: (manager password)
```

### Step 2: Navigate to Team Page
```
URL: http://localhost:3000/enhanced-tms/team
```

### Step 3: Verify Manager View
- Page title shows "My Team"
- See "Add Team Member" button
- See only assigned team members (if any)
- No "Manage Users" button

### Step 4: Click "Add Team Member"
- Modal opens with title "Add Team Member"
- Search field for employees
- List of unassigned employees appears

### Step 5: Search for Employee
- Type employee name, email, or designation
- See filtered results
- Click on employee to select

### Step 6: Confirm Assignment
- Selected employee shown in blue box
- Invitation message preview displayed
- Manager name included in message
- Click "Send Invitation"

### Step 7: Verify Success
- Success message appears: "Employee assigned successfully! Invitation sent."
- Modal closes after 1.5 seconds
- New team member appears in grid immediately
- Team statistics update (Total Members increases)
- No page refresh needed

### Expected Results
✅ Modal opens with unassigned employees
✅ Search filters employees correctly
✅ Selected employee shown with preview
✅ Invitation message includes manager name
✅ New member appears immediately in grid
✅ Team stats update
✅ Modal closes automatically

---

## Test Scenario 3: Employee View (No Permissions)

### Step 1: Login as Employee
```
URL: http://localhost:3000/login
Email: employee@example.com
Password: (employee password)
```

### Step 2: Navigate to Team Page
```
URL: http://localhost:3000/enhanced-tms/team
```

### Step 3: Verify Employee View
- Page title shows "Enhanced Team"
- No "Add Team Member" button
- No "Manage Users" button
- See all company employees (if not manager)

### Expected Results
✅ No add/manage buttons visible
✅ Can view team members
✅ Cannot perform admin/manager actions

---

## Test Scenario 4: Error Handling

### Test 4.1: Try to Assign Already Assigned Employee
1. Manager tries to assign employee already assigned to another manager
2. Expected: Error message "Employee is already assigned to another manager"

### Test 4.2: Try to Access Manager Endpoints as Employee
1. Employee tries to call `/api/employees/team/members`
2. Expected: 403 Forbidden error

### Test 4.3: Try to Access Admin Endpoints as Manager
1. Manager tries to call `/api/employees/users/all`
2. Expected: 403 Forbidden error

### Test 4.4: Search with No Results
1. Manager searches for non-existent employee
2. Expected: "No employees match your search" message

### Test 4.5: No Unassigned Employees
1. All employees already assigned
2. Expected: "No unassigned employees available" message

---

## Test Scenario 5: Real-Time Updates

### Step 1: Open Team Page in Two Tabs
- Tab 1: Manager logged in
- Tab 2: Same manager logged in

### Step 2: Add Team Member in Tab 1
- Click "Add Team Member"
- Select and assign employee
- See new member appear

### Step 3: Verify Tab 2
- Refresh Tab 2
- New member should appear
- (Real-time sync can be added later)

### Expected Results
✅ New member persists in database
✅ Appears on page refresh
✅ Team statistics correct

---

## Database Verification

### Check Employee Assignment
```sql
-- View manager's team members
SELECT e.id, e.name, e.managerId, m.name as manager_name
FROM "Employee" e
LEFT JOIN "Employee" m ON e."managerId" = m.id
WHERE e."managerId" IS NOT NULL;

-- View unassigned employees
SELECT id, name, "managerId"
FROM "Employee"
WHERE "managerId" IS NULL;

-- View specific manager's team
SELECT e.id, e.name, e."managerId"
FROM "Employee" e
WHERE e."managerId" = (SELECT id FROM "Employee" WHERE "userId" = 7);
```

---

## API Testing with cURL

### Get All Users (Admin)
```bash
curl -X GET http://localhost:5004/api/employees/users/all \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### Get Manager's Team Members
```bash
curl -X GET http://localhost:5004/api/employees/team/members \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### Get Unassigned Employees
```bash
curl -X GET http://localhost:5004/api/employees/team/unassigned \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### Assign Employee to Manager
```bash
curl -X POST http://localhost:5004/api/employees/team/assign/3 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

---

## Browser Console Debugging

### Check User Role
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User role:', user.role);
console.log('User ID:', user.id);
console.log('Company ID:', user.companyId);
```

### Check Token
```javascript
const token = localStorage.getItem('token');
console.log('Token:', token);
```

### Monitor API Calls
- Open DevTools (F12)
- Go to Network tab
- Perform actions
- Check request/response for each API call

---

## Troubleshooting

### Issue: "Manage Users" button not visible
**Solution**: Verify user role is ADMIN or SUPER_ADMIN
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.role); // Should be ADMIN or SUPER_ADMIN
```

### Issue: "Add Team Member" button not visible
**Solution**: Verify user role is MANAGER
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.role); // Should be MANAGER
```

### Issue: 404 on /api/employees/team/members
**Solution**: 
1. Restart backend: `npm run dev` in Backend folder
2. Verify user is authenticated
3. Check token is valid

### Issue: No unassigned employees showing
**Solution**: 
1. Create new employees without manager assignment
2. Or remove manager assignment from existing employees
3. Check database: `SELECT * FROM "Employee" WHERE "managerId" IS NULL;`

### Issue: New member doesn't appear after assignment
**Solution**:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify API response includes employee data
4. Check onSuccess callback is being called

### Issue: Invitation message doesn't show manager name
**Solution**:
1. Check localStorage user data: `JSON.parse(localStorage.getItem('user'))`
2. Verify firstName is present
3. Check modal component receives manager name

---

## Performance Testing

### Load Testing
- Add 100+ employees
- Verify search still responsive
- Check pagination (if implemented)

### Memory Testing
- Open DevTools Memory tab
- Perform multiple add/remove operations
- Check for memory leaks

### Network Testing
- Throttle network (DevTools)
- Verify UI handles slow responses
- Check loading states

---

## Accessibility Testing

- [ ] Tab navigation works
- [ ] Keyboard shortcuts work
- [ ] Screen reader compatible
- [ ] Color not only indicator
- [ ] Focus visible
- [ ] Error messages clear

---

## Browser Compatibility

Test in:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## Success Criteria

✅ Admin can view all users
✅ Admin can filter users by role
✅ Manager can view only their team
✅ Manager can add team members
✅ New member appears immediately
✅ Invitation message includes manager name
✅ Employee cannot access manager/admin features
✅ All error scenarios handled
✅ No console errors
✅ Real-time UI updates work

---

## Next Steps

1. **Testing** - Follow all test scenarios above
2. **Deployment** - Deploy to staging environment
3. **User Training** - Train admins and managers
4. **Monitoring** - Monitor for errors and performance
5. **Enhancements** - Add pagination, bulk operations, etc.

---

## Support

For issues or questions:
1. Check troubleshooting section
2. Review console logs
3. Check network requests
4. Verify database state
5. Contact development team

**Status**: ✅ READY FOR TESTING
