# Project Creation Fix Guide

## Problem

Users are unable to create new projects. The request doesn't hit the create endpoint.

## Root Cause

The project creation endpoint requires specific user roles or designations:

**Required Roles:**
- `ADMIN`
- `MANAGER`

**Required Designations:**
- `MANAGER`
- `TECH_LEAD`

If your user doesn't have one of these roles or designations, the authorization check fails and returns a 403 Forbidden error.

## Solution

### Option 1: Check Your User's Role/Designation (Recommended)

Run the debug test script to check your user's permissions:

```bash
cd Backend
node test-project-creation-debug.js
```

This will show:
- Your user's current role
- Your user's current designation
- Whether you have permission to create projects
- What needs to be fixed if you don't have permission

### Option 2: Update User Role in Database

If your user doesn't have the required role, update it in the database:

```sql
-- Update user role to ADMIN
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';

-- Or update to MANAGER
UPDATE "User" SET role = 'MANAGER' WHERE email = 'your-email@example.com';
```

### Option 3: Update User Designation in Database

If your user doesn't have the required designation, update it:

```sql
-- Update user designation to MANAGER
UPDATE "Employee" SET designation = 'MANAGER' 
WHERE "userId" = (SELECT id FROM "User" WHERE email = 'your-email@example.com');

-- Or update to TECH_LEAD
UPDATE "Employee" SET designation = 'TECH_LEAD' 
WHERE "userId" = (SELECT id FROM "User" WHERE email = 'your-email@example.com');
```

## Verification Steps

1. **Run the debug script:**
   ```bash
   cd Backend
   node test-project-creation-debug.js
   ```

2. **Check the output:**
   - If it says "User has permission to create projects" ✅
   - If it says "User does NOT have permission" ❌

3. **If permission check fails:**
   - Update your user's role or designation using Option 2 or 3
   - Run the debug script again to verify

4. **Test in the UI:**
   - Go to the Projects page
   - Click "Create New Project"
   - Fill in the form
   - Click "Create Project"
   - Project should be created successfully

## API Endpoint Details

**Endpoint:** `POST /api/project-management`

**Required Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "departmentId": 2,
  "companyId": 2,
  "ownerId": 1,
  "memberIds": []
}
```

**Authorization Check:**
```
User must have:
- Role: ADMIN or MANAGER, OR
- Designation: MANAGER or TECH_LEAD
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": 1,
    "name": "Project Name",
    "status": "PLANNING",
    ...
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Insufficient permissions to create projects",
  "error": "PERMISSION_DENIED",
  "requiredPermissions": ["project:create"],
  "userRole": "EMPLOYEE",
  "userDesignation": "SOFTWARE_ENGINEER"
}
```

## Troubleshooting

### Issue: "Insufficient permissions to create projects"

**Cause:** User doesn't have required role or designation

**Solution:**
1. Run debug script to check current role/designation
2. Update user role or designation in database
3. Log out and log back in
4. Try creating project again

### Issue: "Authentication required"

**Cause:** Token is missing or invalid

**Solution:**
1. Make sure you're logged in
2. Check that token is in localStorage
3. Log out and log back in
4. Try again

### Issue: "Failed to load employees"

**Cause:** Backend endpoint not responding

**Solution:**
1. Check backend is running: `npm run dev` in Backend folder
2. Check API URL in environment variables
3. Check network tab in browser DevTools
4. Check backend logs for errors

### Issue: "No departments available"

**Cause:** No departments exist in the system

**Solution:**
1. Create departments first
2. Assign employees to departments
3. Try creating project again

## Quick Checklist

- [ ] Backend is running on port 5004
- [ ] Frontend is running on port 3000
- [ ] User is logged in
- [ ] User has ADMIN or MANAGER role, OR MANAGER or TECH_LEAD designation
- [ ] Departments exist in the system
- [ ] Employees are assigned to departments
- [ ] Token is valid and in localStorage
- [ ] API URL is correct in environment variables

## Testing Commands

### Test with curl

```bash
# Login
curl -X POST http://localhost:5004/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Create project (replace TOKEN with actual token)
curl -X POST http://localhost:5004/api/project-management \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Project",
    "description":"Test",
    "departmentId":2,
    "companyId":2,
    "ownerId":1,
    "memberIds":[]
  }'
```

### Test with Node.js

```bash
cd Backend
node test-project-creation-debug.js
```

## Next Steps

1. Run the debug script
2. Check your user's role and designation
3. Update if needed
4. Test project creation in the UI
5. If still failing, check browser console and network tab for errors

## Support

If you're still having issues:

1. Check browser console for error messages
2. Check network tab for API responses
3. Check backend logs for server errors
4. Run the debug script to verify permissions
5. Verify database has required data (departments, employees)

---

**Status**: Fix Guide Complete
**Last Updated**: 2024
