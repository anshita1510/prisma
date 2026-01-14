# Leave Management System - Quick Start Guide

## 🚀 Quick Setup

### 1. Backend Setup
```bash
cd Backend
npm install
npx prisma generate
npm run dev
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## 📋 Access URLs

### Employee
- **Leave Management:** `http://localhost:3000/user/leave-management`
- Apply for leave, view history, check statistics

### Manager
- **Leave Approvals:** `http://localhost:3000/manager/leave-approvals`
- Approve employee leave requests

### HR (Admin)
- **Leave Approvals:** `http://localhost:3000/admin/leave-approvals`
- Approve employee and manager leave requests

### CEO (Super Admin)
- **Leave Approvals:** `http://localhost:3000/superAdmin/leave-approvals`
- Approve all leave requests (employee, manager, HR)

## 🔑 Role-Based Approval Matrix

| Applicant Role | Can Be Approved By | Notifications Sent To |
|----------------|-------------------|----------------------|
| Employee       | HR, Manager       | HR, Manager, CEO     |
| Manager        | HR only           | HR, CEO              |
| HR             | CEO only          | CEO only             |

## 📝 How to Use

### As an Employee:
1. Navigate to Leave Management page
2. Click "Apply Leave" button
3. Fill in leave details (type, dates, reason)
4. Submit application
5. Receive notification when approved/rejected

### As a Manager:
1. Navigate to Leave Approvals page
2. View pending employee leave requests
3. Click "Approve" or "Reject"
4. Provide reason if rejecting
5. Confirm action

### As HR:
1. Navigate to Leave Approvals page
2. View pending employee and manager requests
3. Approve or reject with reason
4. Employee/Manager receives notification

### As CEO:
1. Navigate to Leave Approvals page
2. View all pending requests (employee, manager, HR)
3. Approve or reject any request
4. Applicant receives notification

## 🔔 Notification System

### Real-Time Notifications
- Badge shows unread count
- Click bell icon to view notifications
- Auto-mark as read when viewed
- Notifications include:
  - Leave application alerts
  - Approval/rejection status
  - Applicant details
  - Leave dates and type

## ✅ Key Features

### Leave Application
- ✅ Date validation (no past dates)
- ✅ Overlapping leave detection
- ✅ Multiple leave types (Casual, Sick, Earned, Unpaid)
- ✅ Optional reason field
- ✅ Automatic notification to approvers

### Leave Approval
- ✅ Role-based access control
- ✅ Cannot approve own leave
- ✅ Rejection reason required
- ✅ Confirmation dialog
- ✅ Real-time UI updates
- ✅ Automatic notification to applicant

### Dashboard
- ✅ Leave statistics
- ✅ Leave type breakdown
- ✅ Pending approvals count
- ✅ Leave history
- ✅ Status indicators

## 🧪 Testing Scenarios

### Test 1: Employee Leave Application
1. Login as Employee
2. Apply for casual leave (tomorrow to day after)
3. Check that HR and Manager receive notifications
4. Verify leave appears in "My Leaves"

### Test 2: Manager Approval
1. Login as Manager
2. Check Leave Approvals page
3. Approve an employee leave request
4. Verify employee receives notification
5. Verify leave removed from pending list

### Test 3: HR Approval for Manager
1. Login as Manager
2. Apply for leave
3. Login as HR
4. Approve manager's leave request
5. Verify manager receives notification

### Test 4: CEO Approval for HR
1. Login as HR
2. Apply for leave
3. Login as CEO
4. Approve HR's leave request
5. Verify HR receives notification

### Test 5: Rejection Flow
1. Login as Manager/HR/CEO
2. Reject a leave request
3. Provide rejection reason
4. Verify applicant receives rejection notification

## 🔒 Security Features

- ✅ JWT authentication on all endpoints
- ✅ Role-based authorization
- ✅ Cannot approve own leave
- ✅ Only pending leaves can be modified
- ✅ Audit trail with approver tracking

## 📊 API Endpoints

### Apply Leave
```bash
POST /api/leave
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "CASUAL",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "reason": "Personal work"
}
```

### Get Approvable Leaves
```bash
GET /api/leave/approvable
Authorization: Bearer <token>
```

### Approve/Reject Leave
```bash
PATCH /api/leave/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED",
  "rejectionReason": "Optional for rejection"
}
```

### Get Notifications
```bash
GET /api/leave/notifications
Authorization: Bearer <token>
```

## 🐛 Troubleshooting

### Issue: Notifications not appearing
- Check backend is running on port 5004
- Verify JWT token is valid
- Check browser console for errors

### Issue: Cannot approve leave
- Verify user role has permission
- Check leave is in PENDING status
- Ensure not trying to approve own leave

### Issue: Date validation error
- Ensure start date is not in past
- Verify end date is after start date
- Check for overlapping leaves

## 📱 UI Components

### Leave Management Page (Employee)
- Statistics cards
- Leave history table
- Apply leave modal
- Notification panel

### Leave Approval Page (Manager/HR/CEO)
- Pending requests list
- Employee details
- Approve/Reject buttons
- Confirmation modal
- Notification panel

## 🎨 Status Colors

- **Pending:** Yellow (⏳)
- **Approved:** Green (✅)
- **Rejected:** Red (❌)

## 📈 Statistics Dashboard

Shows:
- Total leaves applied
- Pending count
- Approved count
- Rejected count
- Breakdown by leave type

## 🔄 Workflow Summary

```
Employee applies → Notifications sent → Manager/HR approves → Employee notified
Manager applies → Notifications sent → HR approves → Manager notified
HR applies → Notification sent → CEO approves → HR notified
```

## ✨ Best Practices

1. Always provide reason when rejecting
2. Review leave details before approving
3. Check notification panel regularly
4. Verify dates before applying
5. Use appropriate leave type

## 🎯 Next Steps

1. Test all role-based flows
2. Verify notification delivery
3. Check approval permissions
4. Test date validations
5. Review leave statistics

## 📞 Support

For issues:
1. Check console logs
2. Verify API responses
3. Review role permissions
4. Test with different users

---

**System is ready to use!** 🎉

Start by logging in with different roles and testing the complete workflow.
