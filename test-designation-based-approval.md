# Test: Designation-Based Approval System

## Quick Test Guide

### Prerequisites
1. Backend server running on port 5004
2. Frontend server running on port 3000
3. Database with test users

---

## Test Setup

### Required Test Users

#### User 1: Manager (Applicant)
- **Name**: anshita
- **Role**: ADMIN
- **Designation**: MANAGER
- **Purpose**: Apply for leave

#### User 2: HR (Approver)
- **Name**: HR User
- **Role**: ADMIN
- **Designation**: HR
- **Purpose**: Approve Manager's leave

#### User 3: Non-HR Admin (Should NOT be able to approve)
- **Name**: Director User
- **Role**: ADMIN
- **Designation**: DIRECTOR
- **Purpose**: Verify cannot approve Manager's leave

---

## Test Scenarios

### Test 1: Manager Applies for Leave ✅

**Steps**:
1. Login as anshita (Designation: MANAGER)
2. Navigate to `/manager/leave-management`
3. Click "Apply for Leave" button
4. Fill form:
   - Leave Type: Casual Leave
   - Start Date: Tomorrow
   - End Date: Day after tomorrow
   - Reason: "Team building event"
5. Click Submit

**Expected Result**:
- ✅ Modal closes
- ✅ Success message: "Leave application submitted successfully!"
- ✅ Leave created with status: PENDING
- ✅ Notifications sent to HR and CEO

**Verify in Backend Logs**:
```
✅ Leave created for employee: anshita
✅ Applicant designation: MANAGER
✅ Notifications sent to: HR, CEO
```

---

### Test 2: HR Sees Manager's Leave ✅

**Steps**:
1. Login as HR User (Designation: HR)
2. Navigate to `/admin/leave-management`
3. Check "Pending" tab

**Expected Result**:
- ✅ anshita's leave appears in pending list
- ✅ Shows: "Casual Leave • 2 days"
- ✅ Shows: "Employee: anshita (MANAGER)"
- ✅ Approve and Reject buttons visible

**Verify**:
```
✅ Leave visible in HR's pending list
✅ Employee designation shown: MANAGER
✅ Action buttons enabled
```

---

### Test 3: HR Approves Manager's Leave ✅

**Steps**:
1. Still logged in as HR User
2. Click "Approve" button on anshita's leave
3. Wait for response

**Expected Result**:
- ✅ Success message: "Leave application approved successfully!"
- ✅ Leave status changes to: APPROVED
- ✅ Leave moves to "Approved" tab
- ✅ Notification sent to anshita
- ✅ "Approved by: HR User" shown

**Verify in Backend Logs**:
```
✅ Approver designation: HR
✅ Applicant designation: MANAGER
✅ Approval check: PASSED
✅ Leave status updated: APPROVED
✅ Notification sent to applicant
```

---

### Test 4: Non-HR Admin Cannot See Manager's Leave ❌

**Steps**:
1. Login as Director User (Designation: DIRECTOR, Role: ADMIN)
2. Navigate to `/admin/leave-management`
3. Check "Pending" tab

**Expected Result**:
- ✅ Manager's leave NOT visible in pending list
- ✅ Only Employee leaves visible (if any)
- ✅ Message: "No pending leave applications"

**Verify**:
```
✅ Manager leaves filtered out
✅ Only Employee leaves shown
✅ Designation-based filtering working
```

---

### Test 5: Non-HR Admin Tries to Approve via API ❌

**Steps**:
1. Get Director User's auth token
2. Get Manager's leave ID
3. Try to approve via API:

```bash
curl -X PUT http://localhost:5004/api/leaves/{leaveId}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {director_token}" \
  -d '{"status":"APPROVED"}'
```

**Expected Result**:
- ❌ Status: 403 Forbidden
- ❌ Error: "Only HR (by designation) can approve manager leave requests"
- ❌ Leave status remains: PENDING

**Verify in Backend Logs**:
```
❌ Approver designation: DIRECTOR
✅ Applicant designation: MANAGER
❌ Approval check: FAILED
❌ Error returned: "Only HR (by designation) can approve manager leave requests"
```

---

### Test 6: Manager Approves Employee Leave ✅

**Steps**:
1. Create Employee leave (any employee)
2. Login as anshita (Designation: MANAGER)
3. Navigate to `/manager/leave-management`
4. Click "Approve" on Employee's leave

**Expected Result**:
- ✅ Success message: "Leave application approved successfully!"
- ✅ Employee leave approved
- ✅ Manager can still approve Employee leaves

**Verify**:
```
✅ Manager designation can approve Employee leaves
✅ No restriction on Employee leave approvals
```

---

## Verification Checklist

### Backend Verification
- [ ] `Designation` enum imported in leave-approval.service.ts
- [ ] `canApproveLeave()` checks approver's designation
- [ ] Manager leaves require Designation: HR
- [ ] `getApprovableLeaves()` filters by designation
- [ ] Error messages mention "by designation"

### Database Verification
```sql
-- Check user designations
SELECT e.name, e.designation, u.role 
FROM Employee e 
JOIN User u ON e.userId = u.id;

-- Check leave approvals
SELECT l.id, l.status, e.name as applicant, e.designation
FROM Leave l
JOIN Employee e ON l.employeeId = e.id
WHERE e.designation = 'MANAGER';
```

### API Verification
- [ ] GET /api/leaves/approvable filters by designation
- [ ] PUT /api/leaves/:id/status checks designation
- [ ] Error responses include designation info
- [ ] Notifications sent to correct designations

### Frontend Verification
- [ ] HR sees Manager leaves in pending list
- [ ] Non-HR admins don't see Manager leaves
- [ ] Approve/Reject buttons work for HR
- [ ] Success/Error messages display correctly

---

## Expected Behavior Summary

| Approver Designation | Can Approve Employee Leaves | Can Approve Manager Leaves | Can Approve HR Leaves |
|---------------------|----------------------------|---------------------------|----------------------|
| **MANAGER** | ✅ Yes | ❌ No | ❌ No |
| **HR** | ✅ Yes | ✅ Yes | ❌ No |
| **DIRECTOR** (SUPER_ADMIN) | ✅ Yes | ❌ No | ✅ Yes |

---

## Troubleshooting

### Issue: HR Cannot See Manager Leaves
**Check**:
1. HR user's designation is exactly "HR" (not "Hr" or "hr")
2. Backend server restarted after code changes
3. Database has correct designation values

### Issue: Non-HR Can Still Approve Manager Leaves
**Check**:
1. Code changes deployed to backend
2. Backend server restarted
3. Using correct API endpoint
4. Checking designation, not just role

### Issue: Error "Approver not found"
**Check**:
1. Approver exists in Employee table
2. Approver has valid designation
3. Database connection working

---

## Quick Test Commands

### Restart Backend Server
```bash
cd Backend
npm run dev
```

### Check Backend Logs
```bash
# Watch for approval attempts
tail -f Backend/logs/app.log | grep "approve"
```

### Test API Directly
```bash
# Get approvable leaves (should filter by designation)
curl -X GET http://localhost:5004/api/leaves/approvable \
  -H "Authorization: Bearer {token}"

# Try to approve (should check designation)
curl -X PUT http://localhost:5004/api/leaves/{id}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"status":"APPROVED"}'
```

---

## Success Criteria

✅ **All tests pass**:
1. Manager can apply for leave
2. HR can see and approve Manager leaves
3. Non-HR admins cannot see Manager leaves
4. Non-HR admins cannot approve Manager leaves via API
5. Error messages are clear and mention designation
6. Manager can still approve Employee leaves
7. Notifications sent to correct designations

---

**Test Status**: Ready to Execute  
**Estimated Time**: 15 minutes  
**Required**: Backend restart after code changes
