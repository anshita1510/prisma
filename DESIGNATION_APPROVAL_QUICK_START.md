# 🚀 Designation-Based Leave Approval - Quick Start Guide

## ✅ What Was Fixed

Your leave approval system now works based on **DESIGNATION** (job title) instead of role. This means:

- **HR (designation)** can now approve **MANAGER (designation)** leaves ✅
- **Manager (designation)** can approve junior employee leaves ✅
- **CEO** can approve all leaves including HR and Director ✅

## 🎯 How It Works Now

### Approval Rules

| Applicant Designation | Who Can Approve |
|----------------------|-----------------|
| INTERN, SOFTWARE_ENGINEER, SENIOR_ENGINEER, TECH_LEAD | MANAGER or HR |
| MANAGER | HR or DIRECTOR |
| HR | DIRECTOR or CEO |
| DIRECTOR | CEO only |

## 🧪 Quick Test

### Test HR Approving Manager Leave

1. **Login as Manager:**
   ```
   Email: (your manager user email)
   Password: (your password)
   ```
   - Go to Leave Management
   - Click "Apply for Leave"
   - Fill in the form and submit

2. **Login as HR:**
   ```
   Email: singladeepak519@gmail.com
   Password: password123
   ```
   - Go to Leave Management
   - You should see the Manager's leave request
   - Click "Approve" button
   - ✅ Success! The leave is approved

## 📋 What Changed

### Backend
- `leave-approval.service.ts` - Now checks designation instead of role
- Uses `employee.designation` field from database
- Filters approvable leaves by designation hierarchy

### Frontend
- Admin Leave Management - Now calls `getApprovableLeaves()` API
- Manager Leave Management - Now calls `getApprovableLeaves()` API
- Shows only leaves the user can approve based on their designation

## 🔍 Verify It's Working

### Check 1: HR Can See Manager Leaves
```bash
# Login as HR and check the leave management page
# You should see pending leaves from Manager designation users
```

### Check 2: Manager Cannot See HR Leaves
```bash
# Login as Manager and check the leave management page
# You should NOT see any HR designation leaves
# You should only see junior employee leaves
```

### Check 3: Backend API
```bash
# Test the API directly
curl -X GET http://localhost:5004/api/leaves/approvable \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐛 Troubleshooting

### Problem: HR Still Cannot Approve Manager Leaves

**Check 1: User Designations**
```sql
-- Run this in your database
SELECT u.email, e.name, e.designation, u.role
FROM "Employee" e
JOIN "User" u ON e."userId" = u.id
WHERE u.email IN ('singladeepak519@gmail.com', 'manager@example.com');
```

**Expected Output:**
- HR user should have `designation = 'HR'`
- Manager user should have `designation = 'MANAGER'`

**Fix if Wrong:**
```sql
-- Update HR designation
UPDATE "Employee" 
SET designation = 'HR' 
WHERE "userId" = (SELECT id FROM "User" WHERE email = 'singladeepak519@gmail.com');

-- Update Manager designation
UPDATE "Employee" 
SET designation = 'MANAGER' 
WHERE "userId" = (SELECT id FROM "User" WHERE email = 'manager@example.com');
```

### Problem: Backend Not Running

**Check:**
```bash
curl http://localhost:5004/api/test
```

**If it fails:**
```bash
cd Backend
npm run dev
```

### Problem: Frontend Not Showing Leaves

**Check Browser Console:**
- Open Developer Tools (F12)
- Look for errors in Console tab
- Check Network tab for failed API calls

**Common Issues:**
- Token expired - Log out and log in again
- Backend not running - Start backend server
- Wrong API URL - Check `NEXT_PUBLIC_API_URL` in `.env`

## 📊 Expected Behavior

### As HR User
- ✅ Can see and approve MANAGER leaves
- ✅ Can see and approve junior employee leaves (INTERN, SOFTWARE_ENGINEER, etc.)
- ❌ Cannot see DIRECTOR leaves
- ❌ Cannot approve own leaves

### As Manager User
- ✅ Can see and approve junior employee leaves
- ❌ Cannot see MANAGER leaves
- ❌ Cannot see HR leaves
- ❌ Cannot approve own leaves

### As CEO (SUPER_ADMIN)
- ✅ Can see and approve ALL leaves
- ✅ Can approve HR leaves
- ✅ Can approve DIRECTOR leaves
- ❌ Cannot approve own leaves

## 🎉 Success Indicators

You'll know it's working when:

1. **HR logs in** → Sees Manager leaves in the list
2. **HR clicks Approve** → Leave status changes to APPROVED
3. **Manager logs in** → Does NOT see HR leaves
4. **Backend logs show** → "Designation-based approval check" messages

## 📝 Files Modified

### Backend
- `Backend/src/modules/services/leave-approval.service.ts` ✅
- `Backend/src/modules/controller/leave/leave.controller.ts` (already correct)

### Frontend
- `Frontend/app/admin/leave-management/page.tsx` ✅
- `Frontend/app/manager/leave-management/page.tsx` ✅
- `Frontend/app/services/leave.service.ts` (already has the method)

## 🔗 Related Documentation

- Full documentation: `DESIGNATION_BASED_APPROVAL_SYSTEM_COMPLETE.md`
- Test script: `test-designation-approval.js`
- Previous fixes: `DESIGNATION_BASED_APPROVAL_COMPLETE.md`

## ⚡ Quick Commands

```bash
# Start backend
cd Backend && npm run dev

# Start frontend
cd Frontend && npm run dev

# Run test script
node test-designation-approval.js

# Check backend logs
cd Backend && tail -f logs/app.log
```

## 💡 Tips

1. **Always check designations first** - Most issues are due to incorrect designation values in the database
2. **Use browser DevTools** - Check Network tab to see API responses
3. **Check backend logs** - Look for "Designation-based approval check" messages
4. **Test with different users** - Create test accounts with different designations

---

**Status:** ✅ READY TO USE

**Need Help?** Check the full documentation in `DESIGNATION_BASED_APPROVAL_SYSTEM_COMPLETE.md`
