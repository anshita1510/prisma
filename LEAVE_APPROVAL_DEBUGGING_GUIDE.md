# Leave Approval Error Debugging Guide

## Error Message
```
Error: You cannot approve your own leave request
```

## What This Means
You're trying to approve/reject a leave that belongs to YOU, not someone else's leave.

---

## How to Verify

### Step 1: Check Which Leave You're Trying to Approve

Look at the leave details in the UI:
- **Employee Name**: Who applied for this leave?
- **Your Name**: Who are you logged in as?

**If Employee Name = Your Name → You CANNOT approve it (this is the error)**

---

## Example Scenario

### ❌ WRONG: Trying to Approve Your Own Leave
```
Logged in as: anshita (Manager)
Leave Details:
  - Employee: anshita
  - Type: Casual Leave
  - Duration: 2 days
  
Action: Click "Approve" or "Reject"
Result: ❌ Error: "You cannot approve your own leave request"
```

### ✅ CORRECT: Approving Someone Else's Leave
```
Logged in as: anshita (Manager)
Leave Details:
  - Employee: anil devi (USER)
  - Type: Unpaid Leave
  - Duration: 8 days
  
Action: Click "Approve" or "Reject"
Result: ✅ Success: Leave approved/rejected
```

---

## Common Causes

### 1. Viewing "All" Tab Instead of "Pending" Tab
**Problem**: The "All" tab shows ALL leaves, including your own approved/rejected leaves

**Solution**: 
- Click on "Pending" tab
- Only approve leaves from other employees
- Your own leaves should not appear in the pending list

### 2. Trying to Modify Already Approved Leave
**Problem**: The leave was already approved and you're trying to change it

**Solution**:
- Check leave status
- If status = APPROVED or REJECTED, you cannot change it
- Only PENDING leaves can be approved/rejected

### 3. Multiple Users with Same Name
**Problem**: Two employees have similar names

**Solution**:
- Check employee code
- Check department
- Verify it's not your own leave

---

## How to Fix

### Option 1: Approve Someone Else's Leave
1. Go to "Pending" tab
2. Find a leave where Employee ≠ Your Name
3. Click "Approve" or "Reject"
4. Should work successfully

### Option 2: Have Someone Else Approve Your Leave
1. Your leave needs to be approved by:
   - If you're Employee → Manager or HR
   - If you're Manager → HR only
   - If you're HR → CEO only
2. Ask the appropriate person to log in and approve

---

## Backend Logs

With the new logging added, check backend console for:

```
🔍 Checking approval permission: {
  approverId: 1,
  approverRole: 'ADMIN',
  leaveId: 5
}
```

If you see:
```
🔴 Cannot approve own leave: {
  leaveEmployeeId: 1,
  approverId: 1,
  leaveApplicant: 'anshita',
  leaveId: 5
}
```

This confirms you're trying to approve your own leave (both IDs are 1).

---

## Quick Test

### Test 1: Check Your Employee ID
```sql
SELECT id, name, designation 
FROM Employee 
WHERE name LIKE '%anshita%';
```

Result example:
```
id: 1
name: anshita
designation: MANAGER
```

### Test 2: Check Leave Ownership
```sql
SELECT l.id, l.employeeId, e.name as employee_name, l.status
FROM Leave l
JOIN Employee e ON l.employeeId = e.id
WHERE l.status = 'PENDING';
```

Result example:
```
id: 5, employeeId: 1, employee_name: anshita, status: PENDING
id: 6, employeeId: 2, employee_name: anil devi, status: PENDING
```

If you're trying to approve leave ID 5 and your employee ID is 1:
- ❌ This is YOUR leave, you cannot approve it

If you're trying to approve leave ID 6 and your employee ID is 1:
- ✅ This is anil devi's leave, you CAN approve it

---

## Solution Summary

**The error is correct behavior!** You should NOT be able to approve your own leave.

**To resolve**:
1. Only approve leaves from OTHER employees
2. Have someone else approve YOUR leaves
3. Check the "Pending" tab for leaves you can approve
4. Verify employee name before clicking approve

---

## Expected Behavior

| Your Role | Your Designation | Can Approve |
|-----------|-----------------|-------------|
| ADMIN | MANAGER | Employee leaves only (not your own) |
| ADMIN | HR | Employee + Manager leaves (not your own) |
| SUPER_ADMIN | CEO | All leaves (not your own) |

**Key Rule**: You can NEVER approve your own leave, regardless of role or designation.

---

## Next Steps

1. **Restart backend server** to see the new debug logs
2. **Try to approve a leave** from the UI
3. **Check backend console** for the debug logs
4. **Verify** the employee IDs match/don't match
5. **Report back** with the log output if still having issues

---

**Last Updated**: January 14, 2026  
**Issue**: Cannot approve own leave (expected behavior)  
**Solution**: Only approve other employees' leaves
