# ✅ Error Explanation: "You cannot approve your own leave request"

## 🎯 What's Happening

The error is **CORRECT BEHAVIOR** - the system is preventing you from approving your own leave request.

## 📊 From Backend Logs

```
approverId: 30 (designation: MANAGER)
leaveEmployeeId: 30 (applicant: "HR HR")
```

**Analysis:**
- You're logged in as employee ID **30**
- You're trying to approve leave ID 8
- Leave ID 8 was created by employee ID **30** (yourself)
- System correctly blocks this as self-approval

## ✅ This is NOT a Bug

The system is working correctly! Self-approval prevention is a security feature to ensure:
- No one can approve their own leave
- Proper approval workflow is maintained
- Audit trail is accurate

## 🔧 How to Fix

You need **TWO DIFFERENT USERS** to test:

### Quick Solution

1. **Find or create a user with HR designation:**
   - Check your database for users with designation = 'HR'
   - Or create a new user with HR designation

2. **Find or create a user with MANAGER designation:**
   - Check your database for users with designation = 'MANAGER'
   - Or create a new user with MANAGER designation

3. **Test with both users:**
   - Login as User A (HR) → Apply for leave → Logout
   - Login as User B (Manager) → Approve User A's leave ✅

## 📋 Test Scenario

### ❌ WRONG (What you're doing now):
```
1. Login as Employee ID 30
2. Apply for leave (creates leave with employeeId: 30)
3. Try to approve same leave
4. ❌ Error: "You cannot approve your own leave request"
```

### ✅ CORRECT (What you should do):
```
1. Login as Employee ID 25 (HR designation)
2. Apply for leave (creates leave with employeeId: 25)
3. Logout
4. Login as Employee ID 30 (MANAGER designation)
5. Approve Employee 25's leave
6. ✅ Success!
```

## 🔍 Check Your Users

Run this SQL query to see available users:

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
WHERE e.designation IN ('HR', 'MANAGER')
ORDER BY e.designation;
```

## 💡 Quick Test

If you have these users:
- `hr@example.com` (designation: HR)
- `manager@example.com` (designation: MANAGER)

Then:
1. Login as `hr@example.com` → Apply leave → Logout
2. Login as `manager@example.com` → Approve HR's leave ✅

## 🎯 Summary

**The Error Message:** "You cannot approve your own leave request"

**Why It Happens:** You're trying to approve a leave that you created yourself

**Solution:** Use two different user accounts - one to create the leave, another to approve it

**Status:** System is working correctly! Just need proper test setup.

---

See `MANAGER_HR_APPROVAL_TEST_GUIDE.md` for detailed testing instructions.
