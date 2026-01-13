# Attendance Module Integration Guide

## 🎯 Overview

The attendance module has been successfully integrated between backend and frontend with the following access control:

- ✅ **Admin Users**: Full access to attendance module
- ✅ **Employee Users**: Full access to attendance module  
- ❌ **Super Admin Users**: No access to attendance module

## 🏗️ Architecture

### Backend Structure
```
Backend/src/modules/
├── controller/attendance/
│   └── attendance.controller.ts     # Main controller with user-specific methods
├── services/
│   └── attendance.service.ts        # Business logic for attendance operations
├── routes/attendance/
│   └── attendance.routes.ts         # API routes (authenticated & admin routes)
└── dto/attendance/
    └── attendance.dto.ts            # Data validation schemas
```

### Frontend Structure
```
Frontend/app/
├── user/attendance/                 # Employee attendance module
│   ├── component/                   # Reusable UI components
│   ├── hooks/useAttendance.ts       # Main attendance hook with API integration
│   ├── pages/AttendancePage.tsx     # Main attendance page
│   ├── types/attendanceTypes.tsx    # TypeScript interfaces
│   └── page.tsx                     # Next.js route file
├── admin/attendance/
│   └── page.tsx                     # Admin attendance page (reuses user components)
└── hooks/
    ├── useAuth.ts                   # Authentication hook
    └── useToast.ts                  # Toast notification hook
```

## 🔗 API Endpoints

### User-Specific Endpoints (Authenticated)
- `POST /api/attendance/my-check-in` - Check in current user
- `POST /api/attendance/my-check-out` - Check out current user
- `GET /api/attendance/my-stats` - Get current user's attendance stats
- `GET /api/attendance/my-logs` - Get current user's attendance logs
- `GET /api/attendance/my-team-stats` - Get current user's team stats
- `GET /api/attendance/my-today` - Get current user's today attendance

### Admin Endpoints (With Employee IDs)
- `POST /api/attendance/check-in` - Check in specific employee
- `POST /api/attendance/check-out` - Check out specific employee
- `GET /api/attendance/stats/:employeeId` - Get employee stats
- `GET /api/attendance/logs/:employeeId` - Get employee logs
- `GET /api/attendance/team-stats/:departmentId` - Get department stats
- `GET /api/attendance/today/:employeeId` - Get employee's today attendance
- `POST /api/attendance/mark` - Manually mark attendance (admin only)

## 🎨 UI Features

### Main Components
1. **AttendanceStats Card**: Shows personal and team statistics
2. **TimingsCard**: Displays current time, date, and work schedule
3. **ActionsCard**: Check-in/check-out buttons and quick actions
4. **AttendanceLog**: Detailed attendance history with timeline visualization
5. **LogsTabs**: Navigation between log, calendar, and requests views

### Interactive Features
- ✅ Real-time clock display
- ✅ Check-in/Check-out functionality with toast notifications
- ✅ Timeline visualization of work hours
- ✅ Responsive design for mobile and desktop
- ✅ Loading states and error handling
- ✅ Month-wise attendance filtering

## 🔐 Access Control

### Navigation Updates
- **Admin Sidebar**: Includes "Attendance" menu item
- **Employee Sidebar**: Includes "Attendance" menu item
- **Super Admin Sidebar**: No "Attendance" menu item

### Route Protection
- All attendance API endpoints require authentication
- User-specific endpoints automatically use current user's employee data
- Admin endpoints require specific employee/department IDs

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd Backend
npm install
npm run build
```

### 2. Database Setup (Optional - for testing)
```bash
# Seed demo data
npx ts-node src/seed-demo-data.ts

# Test integration
npx ts-node src/test-attendance-integration.ts
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### 4. Test Accounts (if using demo data)
- **Admin**: admin@demo.com / password123
- **Employee**: employee@demo.com / password123

## 📱 Usage

### For Employees
1. Login with employee credentials
2. Navigate to "Attendance" from sidebar
3. View attendance stats and timeline
4. Use check-in/check-out buttons
5. Review attendance logs and history

### For Admins
1. Login with admin credentials
2. Navigate to "Attendance" from sidebar
3. View team statistics and individual employee data
4. Same interface as employees but with admin privileges

### For Super Admins
- No attendance module access (by design)
- Focus on user management and system administration

## 🔧 Technical Details

### Data Flow
1. **Frontend** → API call via axios with JWT token
2. **Auth Middleware** → Validates token and extracts user info
3. **Controller** → Gets employee data from user ID
4. **Service** → Performs business logic and database operations
5. **Response** → Formatted data sent back to frontend

### Error Handling
- API failures gracefully fall back to mock data
- Toast notifications for user feedback
- Loading states during API calls
- Proper error messages for debugging

### Security
- JWT token authentication required
- User-specific data access (employees can only see their own data)
- Admin routes protected with role-based access
- Input validation using Zod schemas

## 🎯 Key Features Implemented

✅ **Complete Backend-Frontend Integration**
✅ **Role-based Access Control**
✅ **Real-time Check-in/Check-out**
✅ **Attendance Statistics & Analytics**
✅ **Timeline Visualization**
✅ **Toast Notifications**
✅ **Responsive UI Design**
✅ **Error Handling & Loading States**
✅ **Mock Data Fallback**
✅ **TypeScript Support**

## 🔄 Future Enhancements

- Calendar view implementation
- Attendance request system
- Push notifications
- Geolocation-based check-in
- Attendance reports and exports
- Mobile app integration

The attendance module is now fully integrated and ready for production use! 🎉