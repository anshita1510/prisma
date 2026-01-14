# Apply Leave Modal - Quick Reference Card

## 🚀 Quick Start

### For Users/Employees
1. Navigate to Leave Management
2. Click "Request Leave" button (purple button with + icon)
3. Fill the form:
   - Select leave type
   - Pick start date
   - Pick end date
   - Add reason (optional)
4. Click Submit
5. Done! Your leave request is now pending approval

### For CEO/SuperAdmin
1. Navigate to Leave Management dashboard
2. Click "Request Leave" button
3. Fill and submit the form
4. Your leave request will be sent to other SuperAdmins for approval

---

## 📋 Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Leave Type | Dropdown | Yes | CASUAL, SICK, EARNED, UNPAID |
| Start Date | Date Picker | Yes | Must be today or future |
| End Date | Date Picker | Yes | Must be >= start date |
| Reason | Textarea | No | Max 3 rows |

---

## 🎨 UI Elements

### Button
```
[+ Request Leave]  ← Purple button, top-right of pending requests section
```

### Modal Layout
```
┌─────────────────────────────────────┐
│  Apply for Leave                    │
├─────────────────────────────────────┤
│                                     │
│  Leave Type: [Dropdown ▼]          │
│                                     │
│  Start Date: [📅 Date Picker]      │
│                                     │
│  End Date:   [📅 Date Picker]      │
│                                     │
│  Reason (Optional):                 │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Cancel]  [Submit]                 │
└─────────────────────────────────────┘
```

---

## ⚡ Quick Actions

### Open Modal
```typescript
setShowApplyModal(true)
```

### Close Modal
```typescript
setShowApplyModal(false)
```

### Submit Leave
```typescript
await leaveService.applyLeave({
  type: 'CASUAL',
  startDate: '2024-01-20',
  endDate: '2024-01-22',
  reason: 'Family function'
})
```

---

## 🔄 Workflow

```
User clicks "Request Leave"
  ↓
Modal opens with form
  ↓
User fills form fields
  ↓
User clicks Submit
  ↓
Validation checks
  ↓
API call to backend
  ↓
Success → Modal closes, data refreshes
Error → Error message shown, modal stays open
```

---

## ✅ Validation Rules

### Start Date
- ✅ Must be today or future date
- ❌ Cannot be in the past
- ❌ Cannot be empty

### End Date
- ✅ Must be >= start date
- ✅ Must be today or future date
- ❌ Cannot be before start date
- ❌ Cannot be empty

### Leave Type
- ✅ Must select one option
- ❌ Cannot be empty

### Reason
- ✅ Optional field
- ✅ Can be empty
- ✅ Max 3 rows

---

## 🎯 Success Indicators

### Modal Closes
- ✅ Form submitted successfully
- ✅ Leave application created

### Data Refreshes
- ✅ Pending requests updated
- ✅ Leave balances updated
- ✅ Statistics updated

### Notifications Sent
- ✅ HR receives notification
- ✅ Manager receives notification
- ✅ CEO receives notification

---

## ❌ Error Scenarios

### Network Error
```
Error: Failed to apply for leave
Action: Check backend server is running
```

### Validation Error
```
Error: End date must be after start date
Action: Select valid date range
```

### Session Expired
```
Error: Session expired. Please log in again.
Action: Re-login to the application
```

---

## 🧪 Testing Checklist

Quick test in 2 minutes:

1. ✅ Click "Request Leave" → Modal opens
2. ✅ Select "Casual Leave"
3. ✅ Pick tomorrow as start date
4. ✅ Pick day after tomorrow as end date
5. ✅ Type "Test leave" in reason
6. ✅ Click Submit → Modal closes
7. ✅ Check pending requests → Leave appears
8. ✅ Check backend logs → Notifications sent

---

## 📁 File Locations

### Components with Apply Leave Modal
```
Frontend/app/user/_components/LeaveManagement.tsx
Frontend/app/superAdmin/_components/LeaveManagement.tsx
Frontend/app/user/leave-management/page.tsx
```

### API Service
```
Frontend/app/services/leave.service.ts
```

### Backend Controller
```
Backend/src/modules/controller/leave/leave.controller.ts
```

---

## 🔧 Troubleshooting

### Modal doesn't open
- Check `showApplyModal` state
- Verify button onClick handler
- Check console for errors

### Submit button disabled
- Check if form is submitting
- Verify `submitting` state
- Check required fields filled

### Error message not clearing
- Check `setError('')` on new submission
- Verify error state management

### Data not refreshing
- Check `loadLeaveData()` called after success
- Verify API response
- Check network tab for API calls

---

## 💡 Pro Tips

1. **Date Selection**: Use keyboard arrows to navigate dates quickly
2. **Reason Field**: Press Tab to move between fields
3. **Quick Cancel**: Press Escape key to close modal (if implemented)
4. **Form Reset**: Modal resets form data on close
5. **Loading State**: Submit button shows "Submitting..." during API call

---

## 🎉 Success Message

After successful submission:
```
✅ Leave application submitted successfully!
   - Status: PENDING
   - Notifications sent to approvers
   - You will be notified once approved/rejected
```

---

## 📞 Support

### Common Questions

**Q: Can I edit my leave after submitting?**  
A: Currently, you need to cancel and reapply. Edit feature coming soon.

**Q: How long does approval take?**  
A: Depends on your manager/HR. You'll receive a notification once decided.

**Q: Can I apply for past dates?**  
A: No, you can only apply for today or future dates.

**Q: What if I make a mistake?**  
A: Click Cancel and reopen the modal to start fresh.

---

## 🔗 Related Documentation

- `LEAVE_MANAGEMENT_APPLY_LEAVE_COMPLETE.md` - Full implementation details
- `test-apply-leave-modal.js` - Testing guide
- `LEAVE_MANAGEMENT_SYSTEM_COMPLETE.md` - Complete system overview
- `CONTEXT_TRANSFER_CONTINUATION_COMPLETE.md` - Session summary

---

**Last Updated**: January 14, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
