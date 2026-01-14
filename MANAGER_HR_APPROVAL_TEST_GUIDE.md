# Manager & HR Mutual Approval - Testing Guide

## ⚠️ Important: You Need TWO Different Users

The error "You cannot approve your own leave request" occurs because you're trying to approve your own leave. The system correctly prevents self-approval.

## 🎯 Correct Test Setup

You need **two separate user accounts**:

### User 1: HR Designation
- Email: hr@example.com (or any HR user)
- Designation: HR
- Role: ADMIN or MANAGER

### User 2: Manager Designation  
- Email: manager@example.com (or any Manager user)
- Designation: MANAGER
- Role: ADMIN or MANAGER

## 📋 Current Issue Analysis

From the backend logs:
```
approverId: 30 (designation: MANAGER)
leaveEmployeeId: 30 (applicant: "HR HR")
```

**Problem:** You're logged in as employee ID 30 and trying to approve leave ID 8, which was also created by employee ID 30 (yourself).

**Solution:** Use two different user accounts.

## 🧪 Correct Test Steps

### Test 1: Manager Approves HR Leave

1. **Login as HR User (User 1):**
   ```
   Email: hr@example.com
   Password: [your password]
   ```
   - Go to Leave Management
   - Click "Apply for Leave"
   - Fill in the form and submit
   - **Note the leave ID or remember the dates**
   - Logout

2. **Login as Manager User (User 2):**
   ```
   Email: manager@example.com
   Password: [your password]
   ```
   - Go to Leave Management
   - You should see the HR user's leave request
   - Click "Approve"
   - ✅ Success! Manager approved HR's leave

### Test 2: HR Approves Manager Leave

1. **Login as Manager User (User 2):**
   ```
   Email: manager@example.com
   Password: [your password]
   ```
   - Go to Leave Management
   - Click "Apply for Leave"
   - Fill in the form and submit
   - Logout

2. **Login as HR User (User 1):**
   ```
   Email: hr@example.com
   Password: [your password]
   ```
   - Go to Leave Management
   - You should see the Manager user's leave request
   - Click "Approve"
   - ✅ Success! HR approved Manager's leave

## 🔍 How to Check User Designations

Run this SQL query to see all users and their designations:

```sql
SELECT 
  u.id as user_id,
  u.email,
  u.role,
  e.id as employee_id,
  e.name,
  e.designation
FROM "User" u
JOIN "Employee" e ON e."userId" = u.id
ORDER BY e.designation;
```

## 🛠️ Create Test Users (If Needed)

If you don't have separate HR and Manager users, you need to create them:

### Option 1: Update Existing User's Designation

```sql
-- Change user to HR designation
UPDATE "Employee" 
SET designation = 'HR' 
WHERE id = [employee_id];

-- Change user to MANAGER designation
UPDATE "Employee" 
SET designation = 'MANAGER' 
WHERE id = [employee_id];
```

### Option 2: Create New Test Users

Use your user registration/creation endpoint to create:
1. One user with HR designation
2. One user with MANAGER designation

## ❌ Common Mistakes

### Mistake 1: Using Same User
```
❌ Login as User A → Apply leave → Approve own leave
✅ Login as User A → Apply leave → Logout → Login as User B → Approve User A's leave
```

### Mistake 2: Wrong Designation
```
❌ Both users have same designation (both MANAGER or both HR)
✅ One user has MANAGER designation, other has HR designation
```

### Mistake 3: Approving Already Processed Leave
```
❌ Trying to approve a leave that's already APPROVED or REJECTED
✅ Only approve leaves with PENDING status
```

## 🎯 Expected Behavior

### When Manager Approves HR Leave:
```
✅ Manager (designation) can see HR's pending leave
✅ Manager can click "Approve" button
✅ Leave status changes to APPROVED
✅ HR receives notification
```

### When HR Approves Manager Leave:
```
✅ HR (designation) can see Manager's pending leave
✅ HR can click "Approve" button
✅ Leave status changes to APPROVED
✅ Manager receives notification
```

## 🔍 Debug Information

If you're still getting the error, check:

1. **Are you using two different users?**
   - Check the employee IDs in the backend logs
   - `approverId` should be different from `leaveEmployeeId`

2. **Do the users have correct designations?**
   - One should have designation: MANAGER
   - One should have designation: HR

3. **Is the leave status PENDING?**
   - Only pending leaves can be approved
   - Check leave status in database

## 📊 Backend Logs to Look For

**Successful Approval:**
```
🔍 Checking approval permission: { approverId: 30, approverRole: 'ADMIN', leaveId: 9 }
📋 Designation-based approval check: {
  applicant: { id: 25, name: 'HR User', designation: 'HR' },
  approver: { id: 30, name: 'Manager User', designation: 'MANAGER' }
}
✅ Approval successful
```

**Self-Approval (Blocked):**
```
🔍 Checking approval permission: { approverId: 30, approverRole: 'ADMIN', leaveId: 8 }
🔴 Cannot approve own leave: {
  leaveEmployeeId: 30,
  approverId: 30
}
```

## 💡 Quick Fix

If you only have one user account:

1. **Create a second test user** with different designation
2. **Or update an existing user's designation** to test
3. **Use two different browser sessions** (or incognito mode) to login as both users

---

**Remember:** The system is working correctly by preventing self-approval. You just need to use two different user accounts for testing!
