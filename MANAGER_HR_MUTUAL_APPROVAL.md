# Manager and HR Mutual Leave Approval

## ✅ Changes Implemented

Updated the leave approval system so that **Manager and HR can approve each other's leaves**.

## 📋 New Approval Rules

### Manager Designation Leaves
**Can be approved by:**
- ✅ HR (designation)
- ✅ MANAGER (designation) - **NEW**
- ✅ DIRECTOR (designation)

### HR Designation Leaves
**Can be approved by:**
- ✅ MANAGER (designation) - **NEW**
- ✅ HR (designation) - **NEW**
- ✅ DIRECTOR (designation)
- ✅ CEO (SUPER_ADMIN role)

### Junior Employees (INTERN, SOFTWARE_ENGINEER, SENIOR_ENGINEER, TECH_LEAD)
**Can be approved by:**
- ✅ MANAGER (designation)
- ✅ HR (designation)

### Director Designation
**Can be approved by:**
- ✅ CEO (SUPER_ADMIN role) only

## 🔧 What Changed

### Backend File Modified
**File:** `Backend/src/modules/services/leave-approval.service.ts`

**Changes:**
1. **`canApproveLeave()` method:**
   - Manager leaves can now be approved by HR, MANAGER, or DIRECTOR
   - HR leaves can now be approved by MANAGER, HR, DIRECTOR, or CEO

2. **`getApprovableLeaves()` method:**
   - Managers can now see and approve: Junior employees, HR, and other Managers
   - HR can now see and approve: Junior employees, Managers, and other HR

## 🧪 How to Test

### Test 1: Manager Approves HR Leave

1. **Login as HR:**
   - Apply for a leave request

2. **Login as Manager:**
   - Go to Leave Management
   - You should see the HR's leave request
   - Click "Approve"
   - ✅ Success! Manager can approve HR leave

### Test 2: HR Approves Manager Leave

1. **Login as Manager:**
   - Apply for a leave request

2. **Login as HR:**
   - Go to Leave Management
   - You should see the Manager's leave request
   - Click "Approve"
   - ✅ Success! HR can approve Manager leave

### Test 3: Manager Approves Another Manager's Leave

1. **Login as Manager A:**
   - Apply for a leave request

2. **Login as Manager B:**
   - Go to Leave Management
   - You should see Manager A's leave request
   - Click "Approve"
   - ✅ Success! Manager can approve another Manager's leave

## 📊 Approval Matrix

| Applicant → | INTERN/SW_ENG | MANAGER | HR | DIRECTOR |
|-------------|---------------|---------|-----|----------|
| **Manager** | ✅ | ✅ | ✅ | ❌ |
| **HR** | ✅ | ✅ | ✅ | ❌ |
| **Director** | ❌ | ✅ | ✅ | ❌ |
| **CEO** | ✅ | ✅ | ✅ | ✅ |

## 🔍 Key Points

1. **Mutual Approval:** Manager and HR can approve each other's leaves
2. **Self-Approval Prevention:** Users still cannot approve their own leaves
3. **Designation-Based:** Approval is based on designation, not system role
4. **Pending Only:** Only leaves with "PENDING" status can be approved

## ⚡ Quick Commands

```bash
# Restart backend to apply changes
cd Backend
npm run dev

# Check if backend is running
curl http://localhost:5004/api/test
```

## 🐛 Troubleshooting

### Issue: Manager Cannot See HR Leaves

**Check:**
1. Verify user designations in database:
```sql
SELECT u.email, e.name, e.designation 
FROM "Employee" e 
JOIN "User" u ON e."userId" = u.id
WHERE e.designation IN ('MANAGER', 'HR');
```

2. Ensure backend is running and changes are applied
3. Check browser console for errors
4. Verify token is valid in localStorage

### Issue: HR Cannot See Manager Leaves

**Same troubleshooting steps as above**

## ✅ Status

**Implementation:** ✅ COMPLETE
**Testing:** Ready for testing
**Backend Status:** No TypeScript errors

---

**File Modified:** `Backend/src/modules/services/leave-approval.service.ts`
**Date:** January 14, 2026
