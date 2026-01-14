# Leave Management System - UI Guide

## 🎨 User Interface Overview

This guide provides a visual description of all UI components and their interactions.

## 1. Employee Leave Management Page

### URL: `/user/leave-management`

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Leave Management                    [🔔 3] [+ Apply Leave] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Total   │  │ Pending  │  │ Approved │  │ Rejected │  │
│  │    10    │  │    2     │  │    7     │  │    1     │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Leave Balance by Type                              │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │  Casual: 4  │  Sick: 3  │  Earned: 2  │  Unpaid: 1 │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Leave History                                       │  │
│  ├──────┬──────────┬─────────┬─────────┬──────────────┤  │
│  │ Type │ Duration │ Reason  │ Status  │ Approved By  │  │
│  ├──────┼──────────┼─────────┼─────────┼──────────────┤  │
│  │ 🏖️   │ 3 days   │ Vacation│ ✅ APPR │ John Doe     │  │
│  │ 🤒   │ 1 day    │ Sick    │ ⏳ PEND │ -            │  │
│  │ 🏖️   │ 2 days   │ Personal│ ❌ REJ  │ Jane Smith   │  │
│  └──────┴──────────┴─────────┴─────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### Statistics Cards
- **Total Leaves**: Shows total number of leaves applied
- **Pending**: Yellow card with pending count
- **Approved**: Green card with approved count
- **Rejected**: Red card with rejected count

#### Leave Balance Section
- Grid layout showing leave count by type
- Casual, Sick, Earned, Unpaid categories
- Large numbers for easy reading

#### Leave History Table
- Sortable columns
- Color-coded status badges
- Hover effects on rows
- Responsive design

#### Notification Bell
- Badge shows unread count
- Click to toggle notification panel
- Auto-marks as read when opened

#### Apply Leave Button
- Primary blue button
- Opens modal dialog
- Plus icon for clarity

## 2. Apply Leave Modal

### Modal Structure
```
┌─────────────────────────────────────────┐
│  Apply for Leave                    [×] │
├─────────────────────────────────────────┤
│                                         │
│  Leave Type: [Casual Leave      ▼]     │
│                                         │
│  Start Date: [📅 2024-01-15]           │
│                                         │
│  End Date:   [📅 2024-01-17]           │
│                                         │
│  Reason (Optional):                     │
│  ┌─────────────────────────────────┐   │
│  │ Enter reason for leave...       │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [  Cancel  ]  [  Submit  ]            │
└─────────────────────────────────────────┘
```

### Features
- Dropdown for leave type selection
- Date pickers with validation
- Optional reason textarea
- Cancel and Submit buttons
- Error messages display above form
- Loading state on submit

## 3. Leave Approval Page (Manager/HR/CEO)

### URL: 
- Manager: `/manager/leave-approvals`
- HR: `/admin/leave-approvals`
- CEO: `/superAdmin/leave-approvals`

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Employee Leave Approvals                          [🔔 5]   │
│  You can approve leave requests from employees              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Pending  │  │  Unread  │  │   Your   │                 │
│  │ Approvals│  │  Notifs  │  │   Role   │                 │
│  │    3     │  │    5     │  │ Manager  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Pending Leave Requests                             │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  👤 John Doe                                        │  │
│  │     EMP001 • Software Engineer • EMPLOYEE           │  │
│  │                                                      │  │
│  │  📄 Casual Leave                                    │  │
│  │  📅 Jan 15 - Jan 17 (3 days)                       │  │
│  │  🕐 Applied: Jan 10, 2024                          │  │
│  │                                                      │  │
│  │  Reason: Personal work                              │  │
│  │                                                      │  │
│  │                    [✓ Approve]  [✗ Reject]         │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │  (More leave requests...)                           │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### Role-Based Header
- Different title based on role
- Description of approval authority
- Notification bell with badge

#### Statistics Cards
- Pending approvals count
- Unread notifications count
- User role display

#### Leave Request Cards
- Employee information with avatar
- Leave details (type, dates, duration)
- Application date
- Reason display
- Approve/Reject buttons

#### Empty State
```
┌─────────────────────────────────────────┐
│                                         │
│           ✅                            │
│                                         │
│      All Caught Up!                     │
│                                         │
│  No pending leave requests to approve  │
│  at the moment.                         │
│                                         │
└─────────────────────────────────────────┘
```

## 4. Approval Confirmation Modal

### Approve Modal
```
┌─────────────────────────────────────────┐
│  Approve Leave Request              [×] │
├─────────────────────────────────────────┤
│                                         │
│  Employee: John Doe                     │
│  Leave Type: Casual Leave               │
│  Duration: Jan 15 - Jan 17              │
│                                         │
│  ⚠️ The employee will be notified      │
│     immediately about the approval.     │
│                                         │
│  [  Cancel  ]  [  Confirm Approval  ]  │
└─────────────────────────────────────────┘
```

### Reject Modal
```
┌─────────────────────────────────────────┐
│  Reject Leave Request               [×] │
├─────────────────────────────────────────┤
│                                         │
│  Employee: John Doe                     │
│  Leave Type: Casual Leave               │
│  Duration: Jan 15 - Jan 17              │
│                                         │
│  Rejection Reason: *                    │
│  ┌─────────────────────────────────┐   │
│  │ Please provide a reason...      │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⚠️ The employee will be notified      │
│     immediately about the rejection.    │
│                                         │
│  [  Cancel  ]  [  Confirm Rejection  ] │
└─────────────────────────────────────────┘
```

## 5. Notification Panel

### Panel Structure
```
┌─────────────────────────────────────────┐
│  Notifications                          │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔵 New Leave Application        │   │
│  │ John Doe has applied for        │   │
│  │ Casual leave from Jan 15-17     │   │
│  │ 2 hours ago                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Leave Request Approved           │   │
│  │ Your Sick leave request has     │   │
│  │ been approved by Jane Smith     │   │
│  │ 1 day ago                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Leave Request Rejected           │   │
│  │ Your Casual leave request has   │   │
│  │ been rejected by John Manager   │   │
│  │ 3 days ago                      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Features
- Unread notifications highlighted in blue
- Blue dot indicator for unread
- Timestamp for each notification
- Auto-scroll for long lists
- Click to mark as read

## 6. Color Scheme

### Status Colors
```
Pending:  🟡 Yellow (#FEF3C7 bg, #92400E text)
Approved: 🟢 Green  (#D1FAE5 bg, #065F46 text)
Rejected: 🔴 Red    (#FEE2E2 bg, #991B1B text)
```

### UI Colors
```
Primary:   🔵 Blue   (#2563EB)
Success:   🟢 Green  (#10B981)
Warning:   🟡 Yellow (#F59E0B)
Danger:    🔴 Red    (#EF4444)
Gray:      ⚪ Gray   (#6B7280)
```

### Button Colors
```
Primary:   Blue background, white text
Secondary: White background, gray border
Success:   Green background, white text
Danger:    Red background, white text
```

## 7. Responsive Design

### Desktop (>1024px)
- Full width layout
- Multi-column grids
- Side-by-side buttons
- Expanded tables

### Tablet (768px - 1024px)
- Adjusted grid columns
- Stacked statistics
- Responsive tables
- Touch-friendly buttons

### Mobile (<768px)
- Single column layout
- Stacked cards
- Full-width buttons
- Scrollable tables
- Hamburger menu

## 8. Interactive Elements

### Hover States
- Cards: Light gray background
- Buttons: Darker shade
- Table rows: Gray background
- Links: Underline

### Loading States
- Spinner on page load
- Button text changes to "Processing..."
- Disabled state during API calls
- Skeleton loaders for data

### Error States
- Red border on invalid inputs
- Error message below field
- Alert box for API errors
- Toast notifications

## 9. Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter to submit forms
- Escape to close modals
- Arrow keys in dropdowns

### Screen Reader Support
- Semantic HTML elements
- ARIA labels on icons
- Alt text on images
- Role attributes

### Visual Accessibility
- High contrast colors
- Large touch targets (44px min)
- Clear focus indicators
- Readable font sizes (16px min)

## 10. Animation & Transitions

### Modal Animations
- Fade in background overlay
- Scale up modal content
- Smooth transitions (200ms)

### Notification Animations
- Slide in from top
- Fade out after 5 seconds
- Smooth badge updates

### Button Animations
- Hover scale (1.02)
- Active press (0.98)
- Loading spinner rotation

## 11. Icons Used

```
📅 Calendar    - Dates
👤 User        - Employee info
📄 Document    - Leave type
🕐 Clock       - Time/Duration
✓  Checkmark   - Approve
✗  Cross       - Reject
🔔 Bell        - Notifications
⚠️  Warning    - Alerts
🏖️  Beach      - Casual leave
🤒 Sick        - Sick leave
💼 Briefcase   - Earned leave
💰 Money       - Unpaid leave
```

## 12. User Feedback

### Success Messages
```
┌─────────────────────────────────────────┐
│  ✅ Success!                            │
│  Leave application submitted            │
│  successfully. Notifications sent to    │
│  approvers.                             │
└─────────────────────────────────────────┘
```

### Error Messages
```
┌─────────────────────────────────────────┐
│  ❌ Error                               │
│  You already have a leave request for   │
│  overlapping dates.                     │
└─────────────────────────────────────────┘
```

### Info Messages
```
┌─────────────────────────────────────────┐
│  ℹ️  Information                        │
│  Your leave request is pending approval │
│  by HR or Manager.                      │
└─────────────────────────────────────────┘
```

## 13. Best Practices Implemented

### UX Best Practices
- ✅ Clear visual hierarchy
- ✅ Consistent spacing
- ✅ Intuitive navigation
- ✅ Immediate feedback
- ✅ Error prevention
- ✅ Confirmation dialogs

### UI Best Practices
- ✅ Responsive design
- ✅ Touch-friendly
- ✅ Accessible
- ✅ Fast loading
- ✅ Smooth animations
- ✅ Clear typography

### Performance
- ✅ Lazy loading
- ✅ Optimistic updates
- ✅ Cached data
- ✅ Minimal re-renders
- ✅ Code splitting
- ✅ Image optimization

## 14. Mobile Experience

### Mobile Layout
```
┌─────────────────────┐
│  Leave Management   │
│  [🔔 3] [+ Apply]  │
├─────────────────────┤
│  ┌───────────────┐  │
│  │  Total: 10    │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │  Pending: 2   │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │  Approved: 7  │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │  Rejected: 1  │  │
│  └───────────────┘  │
├─────────────────────┤
│  Leave History      │
├─────────────────────┤
│  📄 Casual Leave    │
│  📅 Jan 15-17       │
│  ✅ Approved        │
│  👤 John Doe        │
├─────────────────────┤
│  (More leaves...)   │
└─────────────────────┘
```

## 15. Summary

The UI is designed with:
- 🎨 Modern, clean aesthetics
- 📱 Mobile-first approach
- ♿ Accessibility compliance
- 🚀 Fast performance
- 💡 Intuitive interactions
- 🎯 Clear visual feedback
- 🔒 Secure workflows
- ✨ Smooth animations

**Result: Professional, user-friendly interface that makes leave management effortless!**
