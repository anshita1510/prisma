# Apply Leave Modal - Visual Flow Diagram

## 🎨 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                     LEAVE MANAGEMENT DASHBOARD                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Summary                                    [Jan 2024 - Dec 2024 ▼]│
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Pending leave requests              [+ Request Leave] ←────┐  │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  📅 Hurray! No pending leave requests                        │ │
│  │     Request leave on the right                               │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ℹ️ If your leave balances don't look updated yet, don't worry!    │
│                                                                     │
│  My Leave Stats                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                          │
│  │ Weekly   │ │ Consumed │ │ Monthly  │                          │
│  │ Pattern  │ │ Types    │ │ Stats    │                          │
│  └──────────┘ └──────────┘ └──────────┘                          │
│                                                                     │
│  Leave Balances                                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                            │
│  │ 12   │ │ 12   │ │ 15   │ │  0   │                            │
│  │Casual│ │ Sick │ │Earned│ │Unpaid│                            │
│  └──────┘ └──────┘ └──────┘ └──────┘                            │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ User clicks "Request Leave"
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLY LEAVE MODAL                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Apply for Leave                                                   │
│                                                                     │
│  Leave Type                                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Casual Leave                                              ▼ │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Start Date                                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 📅 01/20/2024                                                │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  End Date                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 📅 01/22/2024                                                │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Reason (Optional)                                                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Family function                                              │  │
│  │                                                              │  │
│  │                                                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│                                    [Cancel]  [Submit]              │
└─────────────────────────────────────────────────────────────────────┘
                                         │
                                         │ User clicks Submit
                                         ↓
                              ┌──────────────────┐
                              │  Form Validation │
                              └──────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ↓                    ↓                    ↓
              ✅ Valid              ❌ Invalid           ❌ Network Error
                    │                    │                    │
                    ↓                    ↓                    ↓
         ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
         │ API Call         │  │ Show Error       │  │ Show Error       │
         │ POST /api/leaves │  │ "End date must   │  │ "Failed to apply │
         └──────────────────┘  │ be >= start date"│  │ for leave"       │
                    │           └──────────────────┘  └──────────────────┘
                    ↓                    │                    │
         ┌──────────────────┐           │                    │
         │ Backend Process  │           │                    │
         │ - Create leave   │           │                    │
         │ - Send notifs    │           │                    │
         │ - Return success │           │                    │
         └──────────────────┘           │                    │
                    │                    │                    │
                    ↓                    ↓                    ↓
         ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
         │ ✅ Success       │  │ Modal stays open │  │ Modal stays open │
         │ - Close modal    │  │ User can fix     │  │ User can retry   │
         │ - Refresh data   │  │ and resubmit     │  │ or cancel        │
         │ - Show in list   │  └──────────────────┘  └──────────────────┘
         └──────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     UPDATED DASHBOARD                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Pending leave requests              [+ Request Leave]         │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  👤 John Doe                              [Approve] [Reject] │ │
│  │     Casual Leave • 3 days                                    │ │
│  │     Jan 20, 2024 to Jan 22, 2024                            │ │
│  │     Reason: Family function                                  │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔔 Notification Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────┘

Employee Applies for Leave
         │
         ↓
┌────────────────────┐
│ Backend Creates    │
│ Leave Record       │
│ Status: PENDING    │
└────────────────────┘
         │
         ├──────────────────────────────────────────────┐
         │                                              │
         ↓                                              ↓
┌────────────────────┐                        ┌────────────────────┐
│ Send Notification  │                        │ Send Notification  │
│ to HR (ADMIN)      │                        │ to Manager         │
│                    │                        │                    │
│ 📧 "John Doe has   │                        │ 📧 "John Doe has   │
│ applied for leave" │                        │ applied for leave" │
└────────────────────┘                        └────────────────────┘
         │                                              │
         └──────────────────┬───────────────────────────┘
                            ↓
                   ┌────────────────────┐
                   │ Send Notification  │
                   │ to CEO             │
                   │                    │
                   │ 📧 "John Doe has   │
                   │ applied for leave" │
                   └────────────────────┘
                            │
                            ↓
                   ┌────────────────────┐
                   │ Approver Reviews   │
                   │ and Decides        │
                   └────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ↓                  ↓                  ↓
    ✅ APPROVED        ❌ REJECTED        ⏳ PENDING
         │                  │                  │
         ↓                  ↓                  ↓
┌────────────────────┐ ┌────────────────────┐ │
│ Send Notification  │ │ Send Notification  │ │
│ to Employee        │ │ to Employee        │ │
│                    │ │                    │ │
│ 📧 "Your leave has │ │ 📧 "Your leave has │ │
│ been APPROVED"     │ │ been REJECTED"     │ │
└────────────────────┘ └────────────────────┘ │
                                              │
                                              ↓
                                    Awaiting approval
```

---

## 🎭 Role-Based Access

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ROLE-BASED LEAVE APPLICATION                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   EMPLOYEE   │
│   (USER)     │
└──────────────┘
      │
      │ Applies for leave
      ↓
┌──────────────────────────────────┐
│ Notifications sent to:           │
│ • HR (ADMIN)                     │
│ • Manager (MANAGER)              │
│ • CEO (SUPER_ADMIN)              │
└──────────────────────────────────┘
      │
      │ Can be approved by:
      ↓
┌──────────────────────────────────┐
│ • HR (ADMIN)                     │
│ • Manager (MANAGER)              │
└──────────────────────────────────┘

─────────────────────────────────────

┌──────────────┐
│   MANAGER    │
│  (MANAGER)   │
└──────────────┘
      │
      │ Applies for leave
      ↓
┌──────────────────────────────────┐
│ Notifications sent to:           │
│ • HR (ADMIN)                     │
│ • CEO (SUPER_ADMIN)              │
└──────────────────────────────────┘
      │
      │ Can ONLY be approved by:
      ↓
┌──────────────────────────────────┐
│ • HR (ADMIN)                     │
└──────────────────────────────────┘

─────────────────────────────────────

┌──────────────┐
│      HR      │
│   (ADMIN)    │
└──────────────┘
      │
      │ Applies for leave
      ↓
┌──────────────────────────────────┐
│ Notifications sent to:           │
│ • CEO (SUPER_ADMIN)              │
└──────────────────────────────────┘
      │
      │ Can ONLY be approved by:
      ↓
┌──────────────────────────────────┐
│ • CEO (SUPER_ADMIN)              │
└──────────────────────────────────┘

─────────────────────────────────────

┌──────────────┐
│     CEO      │
│(SUPER_ADMIN) │
└──────────────┘
      │
      │ Applies for leave
      ↓
┌──────────────────────────────────┐
│ Notifications sent to:           │
│ • Other CEOs (SUPER_ADMIN)       │
└──────────────────────────────────┘
      │
      │ Can ONLY be approved by:
      ↓
┌──────────────────────────────────┐
│ • Another CEO (SUPER_ADMIN)      │
└──────────────────────────────────┘
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPONENT STATE FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

Initial State:
┌────────────────────────────────────┐
│ showApplyModal: false              │
│ formData: {                        │
│   type: 'CASUAL',                  │
│   startDate: '',                   │
│   endDate: '',                     │
│   reason: ''                       │
│ }                                  │
│ submitting: false                  │
│ error: ''                          │
└────────────────────────────────────┘
              │
              │ User clicks "Request Leave"
              ↓
┌────────────────────────────────────┐
│ showApplyModal: true ←─────────────┼─── Modal opens
│ formData: { ... }                  │
│ submitting: false                  │
│ error: ''                          │
└────────────────────────────────────┘
              │
              │ User fills form
              ↓
┌────────────────────────────────────┐
│ showApplyModal: true               │
│ formData: {                        │
│   type: 'CASUAL',                  │
│   startDate: '2024-01-20',         │
│   endDate: '2024-01-22',           │
│   reason: 'Family function'        │
│ }                                  │
│ submitting: false                  │
│ error: ''                          │
└────────────────────────────────────┘
              │
              │ User clicks Submit
              ↓
┌────────────────────────────────────┐
│ showApplyModal: true               │
│ formData: { ... }                  │
│ submitting: true ←─────────────────┼─── Button disabled
│ error: ''                          │
└────────────────────────────────────┘
              │
              │ API call completes
              ↓
        ┌─────┴─────┐
        ↓           ↓
    Success      Error
        │           │
        ↓           ↓
┌──────────────┐ ┌──────────────────────────┐
│ Modal closes │ │ showApplyModal: true     │
│ Data refresh │ │ formData: { ... }        │
│              │ │ submitting: false        │
│              │ │ error: 'Error message' ←─┼─── Error shown
│              │ └──────────────────────────┘
└──────────────┘
```

---

## 📱 Responsive Design

```
Desktop View (> 1024px):
┌─────────────────────────────────────────────────────────────────────┐
│  [Sidebar]  │  Dashboard Content                                    │
│             │  ┌─────────────────────────────────────────────────┐  │
│  • Home     │  │ Pending Requests    [+ Request Leave]          │  │
│  • Leave    │  └─────────────────────────────────────────────────┘  │
│  • Team     │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  • Reports  │  │Stats │ │Stats │ │Stats │ │Stats │               │
│             │  └──────┘ └──────┘ └──────┘ └──────┘               │
└─────────────────────────────────────────────────────────────────────┘

Tablet View (768px - 1024px):
┌─────────────────────────────────────────────────────────────────────┐
│  [☰]  Dashboard                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Pending Requests              [+ Request Leave]             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌──────┐ ┌──────┐                                                 │
│  │Stats │ │Stats │                                                 │
│  └──────┘ └──────┘                                                 │
│  ┌──────┐ ┌──────┐                                                 │
│  │Stats │ │Stats │                                                 │
│  └──────┘ └──────┘                                                 │
└─────────────────────────────────────────────────────────────────────┘

Mobile View (< 768px):
┌──────────────────────────────┐
│  [☰]  Dashboard              │
│  ┌──────────────────────────┐│
│  │ Pending Requests         ││
│  │ [+ Request Leave]        ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ Stats                    ││
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │ Stats                    ││
│  └──────────────────────────┘│
└──────────────────────────────┘
```

---

## 🎨 Color Scheme

```
Primary Colors:
┌────────────────────────────────────┐
│ Purple (Primary)    #9333EA        │ ← Buttons, accents
│ Purple Hover        #7E22CE        │ ← Button hover state
│ Purple Light        #F3E8FF        │ ← Backgrounds
└────────────────────────────────────┘

Status Colors:
┌────────────────────────────────────┐
│ Green (Success)     #10B981        │ ← Approved status
│ Red (Error)         #EF4444        │ ← Rejected status
│ Yellow (Warning)    #F59E0B        │ ← Pending status
│ Blue (Info)         #3B82F6        │ ← Info messages
└────────────────────────────────────┘

Neutral Colors:
┌────────────────────────────────────┐
│ Gray 900            #111827        │ ← Text primary
│ Gray 600            #4B5563        │ ← Text secondary
│ Gray 300            #D1D5DB        │ ← Borders
│ Gray 50             #F9FAFB        │ ← Backgrounds
│ White               #FFFFFF        │ ← Cards, modals
└────────────────────────────────────┘
```

---

**Visual Flow Diagram Complete** ✅  
**Last Updated**: January 14, 2026
