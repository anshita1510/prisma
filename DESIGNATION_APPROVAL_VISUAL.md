# Designation-Based Approval - Visual Guide

## Before vs After

### ❌ BEFORE (Role-Based Only)

```
┌─────────────────────────────────────────────────────────────┐
│                    MANAGER APPLIES FOR LEAVE                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                    ┌───────────────┐
                    │ Leave Created │
                    │ Status: PENDING│
                    └───────────────┘
                            │
                            ↓
              ┌─────────────────────────────┐
              │  Who can approve?           │
              │  ✅ ANY user with ROLE: ADMIN│
              └─────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   ┌─────────┐         ┌─────────┐        ┌─────────┐
   │ HR User │         │Director │        │ Manager │
   │Role:ADMIN│        │Role:ADMIN│       │Role:ADMIN│
   │Desig: HR│         │Desig:DIR│        │Desig:MGR│
   │✅ CAN    │         │✅ CAN    │        │✅ CAN    │
   │APPROVE  │         │APPROVE  │        │APPROVE  │
   └─────────┘         └─────────┘        └─────────┘
        ❌ PROBLEM: Anyone with ADMIN role can approve!
```

### ✅ AFTER (Designation-Based)

```
┌─────────────────────────────────────────────────────────────┐
│                    MANAGER APPLIES FOR LEAVE                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                    ┌───────────────┐
                    │ Leave Created │
                    │ Status: PENDING│
                    └───────────────┘
                            │
                            ↓
              ┌─────────────────────────────────┐
              │  Who can approve?               │
              │  ✅ ONLY Designation: HR        │
              └─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   ┌─────────┐         ┌─────────┐        ┌─────────┐
   │ HR User │         │Director │        │ Manager │
   │Role:ADMIN│        │Role:ADMIN│       │Role:ADMIN│
   │Desig: HR│         │Desig:DIR│        │Desig:MGR│
   │✅ CAN    │         │❌ CANNOT │        │❌ CANNOT │
   │APPROVE  │         │APPROVE  │        │APPROVE  │
   └─────────┘         └─────────┘        └─────────┘
        ✅ SOLUTION: Only HR designation can approve!
```

---

## Complete Approval Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DESIGNATION-BASED APPROVAL FLOW                  │
└─────────────────────────────────────────────────────────────────────┘

STEP 1: Manager Applies for Leave
┌──────────────────────────────────┐
│ Manager: anshita                 │
│ Role: ADMIN                      │
│ Designation: MANAGER             │
│                                  │
│ Applies for:                     │
│ • Type: Casual Leave             │
│ • Duration: 2 days               │
│ • Reason: Team building          │
└──────────────────────────────────┘
              │
              ↓
┌──────────────────────────────────┐
│ Backend Creates Leave            │
│ • Status: PENDING                │
│ • Applicant Designation: MANAGER │
└──────────────────────────────────┘
              │
              ↓
┌──────────────────────────────────┐
│ Send Notifications               │
│ • To: Users with Desig: HR       │
│ • To: CEO (SUPER_ADMIN)          │
└──────────────────────────────────┘

─────────────────────────────────────────────────────────────

STEP 2: HR User Logs In
┌──────────────────────────────────┐
│ HR User: John                    │
│ Role: ADMIN                      │
│ Designation: HR ✅               │
└──────────────────────────────────┘
              │
              ↓
┌──────────────────────────────────┐
│ Backend Filters Leaves           │
│ • Check: Approver Desig = HR ✅  │
│ • Show: Manager leaves ✅        │
│ • Show: Employee leaves ✅       │
└──────────────────────────────────┘
              │
              ↓
┌──────────────────────────────────┐
│ HR Sees Pending Leaves           │
│ ┌──────────────────────────────┐ │
│ │ anshita (MANAGER)            │ │
│ │ Casual Leave • 2 days        │ │
│ │ [Approve] [Reject]           │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘

─────────────────────────────────────────────────────────────

STEP 3: HR Approves Leave
┌──────────────────────────────────┐
│ HR Clicks "Approve"              │
└──────────────────────────────────┘
              │
              ↓
┌──────────────────────────────────┐
│ Backend Checks Permission        │
│ • Approver Desig: HR ✅          │
│ • Applicant Desig: MANAGER ✅    │
│ • Can Approve: TRUE ✅           │
└──────────────────────────────────┘
              │
              ↓
┌──────────────────────────────────┐
│ Leave Approved                   │
│ • Status: APPROVED               │
│ • Approved By: John (HR)         │
│ • Notification sent to anshita   │
└──────────────────────────────────┘

─────────────────────────────────────────────────────────────

STEP 4: Non-HR Admin Tries (FAILS)
┌──────────────────────────────────┐
│ Director: Sarah                  │
│ Role: ADMIN                      │
│ Designation: DIRECTOR ❌         │
└──────────────────────────────────┘
              │
              ↓
┌──────────────────────────────────┐
│ Backend Filters Leaves           │
│ • Check: Approver Desig = DIR ❌ │
│ • Show: Manager leaves ❌        │
│ • Show: Employee leaves ✅       │
└──────────────────────────────────┘
              │
              ↓
┌──────────────────────────────────┐
│ Director Sees Pending Leaves     │
│ ┌──────────────────────────────┐ │
│ │ No Manager leaves visible    │ │
│ │ Only Employee leaves shown   │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
              │
              │ (If tries via API)
              ↓
┌──────────────────────────────────┐
│ Backend Rejects Approval         │
│ • Approver Desig: DIRECTOR ❌    │
│ • Applicant Desig: MANAGER ✅    │
│ • Can Approve: FALSE ❌          │
│ • Error: "Only HR (by            │
│   designation) can approve       │
│   manager leave requests"        │
└──────────────────────────────────┘
```

---

## Approval Permission Matrix

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WHO CAN APPROVE WHAT?                            │
└─────────────────────────────────────────────────────────────────────┘

Approver Designation: MANAGER
┌──────────────────────────────────┐
│ Can Approve:                     │
│ ✅ Employee Leaves               │
│ ❌ Manager Leaves                │
│ ❌ HR Leaves                     │
│ ❌ CEO Leaves                    │
└──────────────────────────────────┘

Approver Designation: HR
┌──────────────────────────────────┐
│ Can Approve:                     │
│ ✅ Employee Leaves               │
│ ✅ Manager Leaves ← KEY CHANGE  │
│ ❌ HR Leaves                     │
│ ❌ CEO Leaves                    │
└──────────────────────────────────┘

Approver Role: SUPER_ADMIN (CEO)
┌──────────────────────────────────┐
│ Can Approve:                     │
│ ✅ Employee Leaves               │
│ ✅ Manager Leaves                │
│ ✅ HR Leaves                     │
│ ✅ CEO Leaves (other CEOs)       │
└──────────────────────────────────┘
```

---

## Database Check Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND APPROVAL CHECK                           │
└─────────────────────────────────────────────────────────────────────┘

1. Receive Approval Request
   ┌──────────────────────────────────┐
   │ PUT /api/leaves/:id/status       │
   │ Body: { status: "APPROVED" }     │
   │ Headers: { Authorization: token }│
   └──────────────────────────────────┘
                │
                ↓
2. Get Approver Info
   ┌──────────────────────────────────┐
   │ SELECT designation               │
   │ FROM Employee                    │
   │ WHERE id = approverId            │
   │                                  │
   │ Result: designation = "HR"       │
   └──────────────────────────────────┘
                │
                ↓
3. Get Leave Info
   ┌──────────────────────────────────┐
   │ SELECT * FROM Leave              │
   │ WHERE id = leaveId               │
   │ INCLUDE employee.designation     │
   │                                  │
   │ Result: applicant = "MANAGER"    │
   └──────────────────────────────────┘
                │
                ↓
4. Check Permission
   ┌──────────────────────────────────┐
   │ IF applicant.designation =       │
   │    "MANAGER"                     │
   │ THEN                             │
   │   IF approver.designation =      │
   │      "HR"                        │
   │   THEN ✅ ALLOW                  │
   │   ELSE ❌ DENY                   │
   └──────────────────────────────────┘
                │
                ↓
5. Update Leave or Return Error
   ┌──────────────────────────────────┐
   │ ✅ Success:                      │
   │    UPDATE Leave                  │
   │    SET status = "APPROVED"       │
   │    Send notification             │
   │                                  │
   │ ❌ Error:                        │
   │    Return 403 Forbidden          │
   │    Message: "Only HR..."         │
   └──────────────────────────────────┘
```

---

## UI Impact

### Manager's View (`/manager/leave-management`)
```
┌─────────────────────────────────────────────────────────────┐
│ Leave Management                    [+ Apply for Leave]     │
│ Review and manage team leave applications                   │
├─────────────────────────────────────────────────────────────┤
│ [All (5)] [Pending (2)] [Approved (2)] [Rejected (1)]      │
├─────────────────────────────────────────────────────────────┤
│ Team Leave Applications                                     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ John Doe (EMPLOYEE)                                     │ │
│ │ Casual Leave • 2 days                                   │ │
│ │ [Approve] [Reject]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ❌ Manager's own leave NOT visible here                    │
│ ❌ Other Manager's leaves NOT visible here                 │
└─────────────────────────────────────────────────────────────┘
```

### HR's View (`/admin/leave-management`)
```
┌─────────────────────────────────────────────────────────────┐
│ Leave Management                    [+ Apply for Leave]     │
│ Review and manage employee leave applications               │
├─────────────────────────────────────────────────────────────┤
│ [All (8)] [Pending (3)] [Approved (4)] [Rejected (1)]      │
├─────────────────────────────────────────────────────────────┤
│ Leave Applications                                          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ anshita (MANAGER) ← KEY: HR sees Manager leaves         │ │
│ │ Casual Leave • 2 days                                   │ │
│ │ [Approve] [Reject]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ John Doe (EMPLOYEE)                                     │ │
│ │ Sick Leave • 1 day                                      │ │
│ │ [Approve] [Reject]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ✅ HR sees BOTH Employee and Manager leaves                │
└─────────────────────────────────────────────────────────────┘
```

### Director's View (Non-HR Admin)
```
┌─────────────────────────────────────────────────────────────┐
│ Leave Management                    [+ Apply for Leave]     │
│ Review and manage employee leave applications               │
├─────────────────────────────────────────────────────────────┤
│ [All (3)] [Pending (1)] [Approved (2)] [Rejected (0)]      │
├─────────────────────────────────────────────────────────────┤
│ Leave Applications                                          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ John Doe (EMPLOYEE)                                     │ │
│ │ Sick Leave • 1 day                                      │ │
│ │ [Approve] [Reject]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ❌ Manager leaves NOT visible (filtered out)               │
│ ✅ Only Employee leaves visible                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Takeaways

### ✅ What Changed
1. **Approval Check**: Now checks `designation` field, not just `role`
2. **Leave Filtering**: HR designation sees Manager leaves, others don't
3. **Error Messages**: Mention "by designation" for clarity
4. **Database Queries**: Fetch and check designation in approval logic

### ✅ What Stayed the Same
1. **API Endpoints**: No changes to endpoint URLs
2. **Database Schema**: No migration required
3. **Frontend UI**: No UI changes needed
4. **User Experience**: Seamless for HR users

### ✅ Benefits
1. **Security**: Only HR can approve Manager leaves
2. **Hierarchy**: Reflects organizational structure
3. **Flexibility**: Can have multiple ADMINs with different permissions
4. **Audit**: Clear designation-based approval trail

---

**Visual Guide Complete** ✅  
**Last Updated**: January 14, 2026
