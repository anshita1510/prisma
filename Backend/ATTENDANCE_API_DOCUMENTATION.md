# 📋 Attendance API Documentation

Complete Swagger documentation has been added to all attendance endpoints!

## ✅ What's Been Added

### Swagger Documentation for All Attendance Routes:

1. **Personal Attendance Routes** (All Users)
   - `POST /api/attendance/my-check-in` - Check in for the day
   - `POST /api/attendance/my-check-out` - Check out for the day
   - `GET /api/attendance/my-stats` - Get personal attendance statistics
   - `GET /api/attendance/my-logs` - Get personal attendance history
   - `GET /api/attendance/my-today` - Get today's attendance status
   - `POST /api/attendance/regularization-request` - Submit regularization request

2. **Admin/Manager Routes** (Check-in/out for employees)
   - `POST /api/attendance/check-in` - Check in for specific employee
   - `POST /api/attendance/check-out` - Check out for specific employee

3. **Employee Management Routes** (Admin/Manager)
   - `GET /api/attendance/employees` - Get all employee attendance
   - `GET /api/attendance/dashboard-stats` - Get dashboard statistics
   - `GET /api/attendance/stats/:employeeId` - Get employee statistics
   - `GET /api/attendance/logs/:employeeId` - Get employee attendance logs
   - `GET /api/attendance/team-stats/:departmentId` - Get team statistics
   - `GET /api/attendance/today/:employeeId` - Get today's attendance for employee
   - `GET /api/attendance/history/:employeeId` - Get attendance history
   - `GET /api/attendance/calendar/:employeeId` - Get monthly calendar

4. **Manual Attendance** (Admin Only)
   - `POST /api/attendance/mark` - Manually mark attendance

5. **Regularization Management** (Admin/Manager)
   - `GET /api/attendance/regularization-requests/pending` - Get pending requests
   - `POST /api/attendance/regularization-requests/:requestId/approve` - Approve request
   - `POST /api/attendance/regularization-requests/:requestId/reject` - Reject request

6. **Reports** (Admin/Manager)
   - `GET /api/attendance/reports/daily` - Generate daily report
   - `GET /api/attendance/reports/monthly` - Generate monthly report

7. **Audit Trail** (Admin Only)
   - `GET /api/attendance/audit-trail` - Get audit trail

8. **Auto-Checkout** (Admin Only)
   - `POST /api/attendance/auto-checkout/trigger` - Manually trigger auto-checkout
   - `POST /api/attendance/auto-checkout/scheduled` - Scheduled auto-checkout

## 📖 How to Access Swagger Documentation

1. **Start Backend Server:**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Open Swagger UI:**
   ```
   http://localhost:5004/api-docs
   ```

3. **Authorize:**
   - Click "Authorize" button at top
   - Login first to get token: `POST /api/users/login`
   - Paste token (without "Bearer " prefix)
   - Click "Authorize"

## 🎯 Example Usage

### Check In
```bash
curl -X POST http://localhost:5004/api/attendance/my-check-in \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Office",
    "latitude": 28.7041,
    "longitude": 77.1025
  }'
```

### Check Out
```bash
curl -X POST http://localhost:5004/api/attendance/my-check-out \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Get My Stats
```bash
curl -X GET http://localhost:5004/api/attendance/my-stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Submit Regularization Request
```bash
curl -X POST http://localhost:5004/api/attendance/regularization-request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "checkIn": "09:00:00",
    "checkOut": "18:00:00",
    "reason": "Forgot to check in"
  }'
```

## 🔐 Authentication

All attendance endpoints require JWT authentication:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 Role-Based Access

| Endpoint | EMPLOYEE | MANAGER | ADMIN | SUPER_ADMIN |
|----------|----------|---------|-------|-------------|
| My Check-in/out | ✅ | ✅ | ✅ | ✅ |
| My Stats/Logs | ✅ | ✅ | ✅ | ✅ |
| Regularization Request | ✅ | ✅ | ✅ | ✅ |
| Employee Attendance | ❌ | ✅ | ✅ | ✅ |
| Dashboard Stats | ❌ | ✅ | ✅ | ✅ |
| Manual Mark | ❌ | ❌ | ✅ | ✅ |
| Approve Regularization | ❌ | ✅ | ✅ | ✅ |
| Reports | ❌ | ✅ | ✅ | ✅ |
| Audit Trail | ❌ | ❌ | ✅ | ✅ |
| Auto-Checkout | ❌ | ❌ | ✅ | ✅ |

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 🚀 Next Steps

1. Restart backend server to load new Swagger documentation
2. Open http://localhost:5004/api-docs
3. Test all attendance endpoints
4. Check role-based access control

---

**Documentation Updated:** January 15, 2026
**Backend Server:** http://localhost:5004
**Swagger UI:** http://localhost:5004/api-docs
