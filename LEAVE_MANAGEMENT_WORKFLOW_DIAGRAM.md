# Leave Management System - Workflow Diagrams

## 1. Employee Leave Application Flow

```
┌─────────────┐
│  Employee   │
│  Applies    │
│  for Leave  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  System Validates:              │
│  • Start date not in past       │
│  • End date after start date    │
│  • No overlapping leaves        │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Leave Created                  │
│  Status: PENDING                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Notifications Sent To:         │
│  ✓ HR (All in company)          │
│  ✓ Manager (In department)      │
│  ✓ CEO (Super Admin)            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Approvers Review Request       │
└──────┬──────────────────────────┘
       │
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
   ┌────────┐   ┌────────┐   ┌────────┐
   │   HR   │   │Manager │   │  CEO   │
   │Approves│   │Approves│   │Approves│
   └───┬────┘   └───┬────┘   └───┬────┘
       │            │            │
       └────────────┴────────────┘
                    │
                    ▼
       ┌────────────────────────┐
       │  Leave Status Updated  │
       │  Approver Recorded     │
       └────────┬───────────────┘
                │
                ▼
       ┌────────────────────────┐
       │  Notification Sent     │
       │  to Employee           │
       └────────────────────────┘
```

## 2. Manager Leave Application Flow

```
┌─────────────┐
│   Manager   │
│   Applies   │
│  for Leave  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  System Validates               │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Leave Created                  │
│  Status: PENDING                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Notifications Sent To:         │
│  ✓ HR (All in company)          │
│  ✓ CEO (Super Admin)            │
│  ✗ NOT to other Managers        │
└──────┬──────────────────────────┘
       │
       ├─────────────┬─────────────┐
       ▼             ▼             
   ┌────────┐   ┌────────┐   
   │   HR   │   │  CEO   │   
   │Approves│   │Approves│   
   └───┬────┘   └───┬────┘   
       │            │        
       └────────────┘        
                │
                ▼
   ┌────────────────────────┐
   │  Leave Status Updated  │
   │  HR/CEO Recorded       │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │  Notification Sent     │
   │  to Manager            │
   └────────────────────────┘
```

## 3. HR Leave Application Flow

```
┌─────────────┐
│     HR      │
│   Applies   │
│  for Leave  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  System Validates               │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Leave Created                  │
│  Status: PENDING                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Notification Sent To:          │
│  ✓ CEO (Super Admin) ONLY       │
│  ✗ NOT to HR or Managers        │
└──────┬──────────────────────────┘
       │
       ▼
   ┌────────┐
   │  CEO   │
   │Approves│
   └───┬────┘
       │
       ▼
┌────────────────────────┐
│  Leave Status Updated  │
│  CEO Recorded          │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Notification Sent     │
│  to HR                 │
└────────────────────────┘
```

## 4. Approval Permission Matrix

```
┌──────────────────────────────────────────────────────────┐
│                 WHO CAN APPROVE WHOM?                    │
├──────────────┬───────────────────────────────────────────┤
│  Applicant   │           Can Be Approved By              │
├──────────────┼───────────────────────────────────────────┤
│  Employee    │  ✓ HR (Admin)                             │
│              │  ✓ Manager                                │
│              │  ✓ CEO (Super Admin)                      │
├──────────────┼───────────────────────────────────────────┤
│  Manager     │  ✓ HR (Admin)                             │
│              │  ✓ CEO (Super Admin)                      │
│              │  ✗ Other Managers                         │
├──────────────┼───────────────────────────────────────────┤
│  HR (Admin)  │  ✓ CEO (Super Admin) ONLY                 │
│              │  ✗ HR cannot approve HR                   │
│              │  ✗ Managers cannot approve HR             │
├──────────────┼───────────────────────────────────────────┤
│  CEO         │  ✗ No one (highest authority)             │
│              │  (Would need board approval in real world)│
└──────────────┴───────────────────────────────────────────┘
```

## 5. Notification Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│              NOTIFICATION DISTRIBUTION                  │
└─────────────────────────────────────────────────────────┘

Employee Applies:
┌──────────┐
│ Employee │──┐
└──────────┘  │
              ├──► HR (All)
              ├──► Manager (Department)
              └──► CEO (All)

Manager Applies:
┌──────────┐
│ Manager  │──┐
└──────────┘  │
              ├──► HR (All)
              └──► CEO (All)

HR Applies:
┌──────────┐
│    HR    │──┐
└──────────┘  │
              └──► CEO (All)

Approval/Rejection:
┌──────────┐
│ Approver │──► Applicant (Individual)
└──────────┘
```

## 6. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Employee   │  │   Manager    │  │   HR/CEO     │ │
│  │     Page     │  │     Page     │  │     Page     │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                 │          │
│         └─────────────────┴─────────────────┘          │
│                           │                            │
│                  ┌────────▼────────┐                   │
│                  │  Leave Service  │                   │
│                  └────────┬────────┘                   │
└───────────────────────────┼─────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   API Layer    │
                    │  (Axios/Fetch) │
                    └───────┬────────┘
                            │
┌───────────────────────────┼─────────────────────────────┐
│                    BACKEND (Express)                    │
├───────────────────────────┼─────────────────────────────┤
│                  ┌────────▼────────┐                    │
│                  │  Auth Middleware│                    │
│                  └────────┬────────┘                    │
│                           │                             │
│                  ┌────────▼────────┐                    │
│                  │ Leave Controller│                    │
│                  └────────┬────────┘                    │
│                           │                             │
│         ┌─────────────────┼─────────────────┐           │
│         │                 │                 │           │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐    │
│  │  Approval   │  │Notification │  │   Leave     │    │
│  │   Service   │  │   Service   │  │  Validation │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                 │                 │           │
│         └─────────────────┴─────────────────┘           │
│                           │                             │
│                  ┌────────▼────────┐                    │
│                  │  Prisma Client  │                    │
│                  └────────┬────────┘                    │
└───────────────────────────┼─────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   PostgreSQL   │
                    │    Database    │
                    └────────────────┘
```

## 7. Database Relationships

```
┌──────────────┐
│     User     │
│              │
│ • id         │
│ • email      │
│ • role       │
└──────┬───────┘
       │ 1:1
       │
┌──────▼───────┐
│   Employee   │
│              │
│ • id         │
│ • userId     │
│ • companyId  │
│ • deptId     │
└──────┬───────┘
       │ 1:N
       │
┌──────▼───────┐         ┌──────────────┐
│    Leave     │────────►│  Department  │
│              │   N:1   │              │
│ • id         │         │ • id         │
│ • employeeId │         │ • name       │
│ • type       │         └──────────────┘
│ • status     │
│ • startDate  │
│ • endDate    │
│ • approvedBy │◄────┐
└──────────────┘     │
                     │ N:1
              ┌──────┴───────┐
              │   Employee   │
              │  (Approver)  │
              └──────────────┘

┌──────────────┐
│Notification  │
│              │
│ • id         │
│ • title      │
│ • message    │
│ • type       │
│ • refId      │
└──────┬───────┘
       │ 1:N
       │
┌──────▼───────────────┐
│NotificationRecipient │
│                      │
│ • id                 │
│ • notificationId     │
│ • recipientId        │
│ • isRead             │
│ • readAt             │
└──────────────────────┘
```

## 8. State Transitions

```
┌─────────────────────────────────────────────────────────┐
│                  LEAVE STATUS FLOW                      │
└─────────────────────────────────────────────────────────┘

                    ┌──────────┐
                    │  PENDING │ ◄─── Initial State
                    └─────┬────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
        ┌──────────┐            ┌──────────┐
        │ APPROVED │            │ REJECTED │
        └──────────┘            └──────────┘
         (Final)                 (Final)

Rules:
• Only PENDING leaves can be approved/rejected
• Once APPROVED or REJECTED, status is final
• Cannot revert to PENDING
• Cannot change from APPROVED to REJECTED or vice versa
```

## 9. Security Flow

```
┌─────────────────────────────────────────────────────────┐
│                   SECURITY CHECKS                       │
└─────────────────────────────────────────────────────────┘

Request Received
      │
      ▼
┌──────────────────┐
│ JWT Validation   │──► Invalid ──► 401 Unauthorized
└────────┬─────────┘
         │ Valid
         ▼
┌──────────────────┐
│ User Extraction  │──► Not Found ──► 401 Unauthorized
└────────┬─────────┘
         │ Found
         ▼
┌──────────────────┐
│ Role Check       │──► No Permission ──► 403 Forbidden
└────────┬─────────┘
         │ Authorized
         ▼
┌──────────────────┐
│ Business Logic   │
│ • Own leave?     │
│ • Status check   │
│ • Date validation│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Execute Action   │──► Success ──► 200/201 OK
└──────────────────┘
```

## 10. Real-Time Update Flow

```
┌─────────────────────────────────────────────────────────┐
│              REAL-TIME UI UPDATES                       │
└─────────────────────────────────────────────────────────┘

User Action (Apply/Approve/Reject)
      │
      ▼
┌──────────────────┐
│  API Call        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Backend Process │
│  • Update DB     │
│  • Send Notif    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Response        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Frontend Update │
│  • Update state  │
│  • Refresh list  │
│  • Show message  │
│  • Update badge  │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│  UI Reflects     │
│  New State       │
│  (No Refresh!)   │
└──────────────────┘
```

## Summary

This workflow system ensures:
- ✅ Clear approval hierarchy
- ✅ Role-based permissions
- ✅ Real-time notifications
- ✅ Audit trail
- ✅ Data validation
- ✅ Security at every level
- ✅ Smooth user experience
