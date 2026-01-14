# Enhanced Team - Setup Instructions 🚀

## Prerequisites

- Backend running on port 5004
- Frontend running on port 3000 or 3001
- User logged in with ADMIN or SUPER_ADMIN role
- Company ID available in user data

## Installation Steps

### Step 1: Backend Setup

#### 1.1 Create Employee Controller
**File**: `Backend/src/modules/controller/employee.controller.ts`
- Contains all employee management logic
- Handles CRUD operations
- Validates data and manages relationships

#### 1.2 Create Employee Routes
**File**: `Backend/src/modules/routes/employee.routes.ts`
- Defines API endpoints
- Implements authorization checks
- Routes requests to controller

#### 1.3 Register Routes in Server
**File**: `Backend/src/server.ts`
- Add import: `import employeeRoutes from './modules/routes/employee.routes';`
- Add route: `app.use('/api/employees', employeeRoutes);`

#### 1.4 Verify Backend
```bash
# Check if backend compiles
npm run build

# Start backend
npm run dev

# Test endpoint
curl -H "Authorization: Bearer {token}" http://localhost:5004/api/employees
```

### Step 2: Frontend Setup

#### 2.1 Create Employee Service
**File**: `Frontend/app/services/employeeService.ts`
- API client for employee operations
- Handles requests and responses
- Provides utility functions

#### 2.2 Create Add Team Member Modal
**File**: `Frontend/components/team/AddTeamMemberModal.tsx`
- Modal dialog component
- Form with validation
- Success/error handling

#### 2.3 Update Team Page
**File**: `Frontend/app/enhanced-tms/team/page.tsx`
- Replace mock data with API calls
- Integrate modal component
- Handle state updates

#### 2.4 Verify Frontend
```bash
# Check if frontend compiles
npm run build

# Start frontend
npm run dev

# Navigate to http://localhost:3000/enhanced-tms/team
```

## Configuration

### Environment Variables

**Backend** (`.env`):
```
PORT=5004
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5004
```

## Testing

### Test 1: Create Team Member
1. Navigate to Enhanced TMS → Team
2. Click "Add Team Member" button
3. Fill in form:
   - Name: "John Doe"
   - Email: "john@company.com"
   - Designation: "Senior Developer"
   - Role: "MANAGER"
   - Status: "ACTIVE"
4. Click "Add Team Member"
5. Verify success message
6. Verify member appears in grid

### Test 2: Form Validation
1. Click "Add Team Member"
2. Leave name empty
3. Click "Add Team Member"
4. Verify error: "Name is required"

### Test 3: Duplicate Email
1. Click "Add Team Member"
2. Enter existing email
3. Click "Add Team Member"
4. Verify error: "Email already exists"

### Test 4: Search
1. Create member "Alice Johnson"
2. Search for "Alice"
3. Verify member appears in results

## Troubleshooting

### Issue: Modal doesn't open
**Solution**:
1. Check browser console (F12)
2. Verify button has onClick handler
3. Check if modal component is imported
4. Verify state management

### Issue: Form submission fails
**Solution**:
1. Check all required fields are filled
2. Verify email format is correct
3. Check backend is running
4. Look at Network tab for API response

### Issue: New member doesn't appear
**Solution**:
1. Check browser console for errors
2. Verify API response in Network tab
3. Check if member was created in database
4. Try refreshing page

### Issue: API returns 401 Unauthorized
**Solution**:
1. Verify user is logged in
2. Check token in localStorage
3. Verify token is valid
4. Check authentication middleware

### Issue: API returns 403 Forbidden
**Solution**:
1. Verify user has ADMIN or SUPER_ADMIN role
2. Check authorization middleware
3. Verify user permissions

### Issue: Database errors
**Solution**:
1. Check database connection
2. Verify Prisma schema is up to date
3. Run migrations: `npx prisma migrate dev`
4. Check database logs

## API Endpoints Reference

### Get All Employees
```
GET /api/employees?companyId=1
Authorization: Bearer {token}
```

### Create Employee
```
POST /api/employees
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "+1 (555) 234-5678",
  "designation": "Senior Developer",
  "role": "MANAGER",
  "status": "ACTIVE",
  "location": "San Francisco, USA"
}
```

### Get Employee by ID
```
GET /api/employees/1
Authorization: Bearer {token}
```

### Update Employee
```
PUT /api/employees/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Smith",
  "status": "AWAY"
}
```

### Delete Employee
```
DELETE /api/employees/1
Authorization: Bearer {token}
```

### Get Employee Stats
```
GET /api/employees/1/stats
Authorization: Bearer {token}
```

## Database Schema

### User Table
```sql
- id (INT, PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- firstName (VARCHAR)
- lastName (VARCHAR)
- phone (VARCHAR)
- designation (VARCHAR)
- role (ENUM: SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE)
- status (ENUM: PENDING, ACTIVE, AWAY, BUSY, OFFLINE)
- password (VARCHAR)
- isActive (BOOLEAN)
- companyId (INT, FOREIGN KEY)
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

### Employee Table
```sql
- id (INT, PRIMARY KEY)
- userId (INT, UNIQUE, FOREIGN KEY)
- name (VARCHAR)
- designation (ENUM)
- employeeCode (VARCHAR, UNIQUE)
- companyId (INT, FOREIGN KEY)
- departmentId (INT, FOREIGN KEY)
- managerId (INT, FOREIGN KEY, NULLABLE)
- isActive (BOOLEAN)
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

## Performance Optimization

### Frontend
- Use React.memo for team member cards
- Implement virtual scrolling for large lists
- Cache employee data with React Query
- Lazy load employee details

### Backend
- Add database indexes on frequently queried fields
- Implement pagination for large result sets
- Cache employee lists
- Use connection pooling

### Database
- Index on `companyId` and `departmentId`
- Index on `email` for uniqueness checks
- Index on `isActive` for filtering

## Security Best Practices

1. **Authentication**
   - Verify JWT token on every request
   - Check token expiration
   - Refresh token if needed

2. **Authorization**
   - Check user role for sensitive operations
   - Verify user has access to company data
   - Implement row-level security

3. **Input Validation**
   - Validate all form inputs
   - Sanitize email addresses
   - Check phone number format
   - Validate designation

4. **Data Protection**
   - Hash passwords before storing
   - Use HTTPS for all requests
   - Encrypt sensitive data
   - Implement rate limiting

5. **Error Handling**
   - Don't expose sensitive error details
   - Log errors securely
   - Provide user-friendly error messages
   - Monitor for suspicious activity

## Monitoring & Logging

### Frontend Logs
```javascript
// Create employee
console.log('📤 Creating employee:', payload);
console.log('✅ Employee created:', response.data);

// Load employees
console.log('🔍 Fetching team members...');
console.log('✅ Found employees:', result.data.length);
```

### Backend Logs
```typescript
// Create employee
console.log(`✅ Employee created: ${employee.name} (ID: ${employee.id})`);

// Errors
console.error('Error creating employee:', error);
```

## Maintenance

### Regular Tasks
- Monitor API performance
- Check error logs
- Verify database integrity
- Update dependencies
- Review security logs

### Backup & Recovery
- Daily database backups
- Test backup restoration
- Document recovery procedures
- Monitor backup status

## Support & Documentation

### Documentation Files
1. `ENHANCED_TEAM_ADD_MEMBER_FIX_COMPLETE.md` - Complete fix explanation
2. `ENHANCED_TEAM_QUICK_START.md` - Quick start guide
3. `ENHANCED_TEAM_IMPLEMENTATION_SUMMARY.md` - Implementation overview
4. `ENHANCED_TEAM_SETUP_INSTRUCTIONS.md` - This file

### Getting Help
1. Check console logs (F12)
2. Check Network tab for API calls
3. Review error messages
4. Check documentation
5. Review backend logs

## Deployment

### Development
```bash
# Backend
cd Backend
npm install
npm run dev

# Frontend
cd Frontend
npm install
npm run dev
```

### Production
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
npm start
```

### Environment Setup
1. Set environment variables
2. Configure database
3. Run migrations
4. Seed initial data
5. Test all endpoints

## Rollback Plan

If issues occur:
1. Stop the application
2. Revert code changes
3. Restore database backup
4. Restart application
5. Verify functionality

## Success Criteria

- ✅ Backend API endpoints working
- ✅ Frontend modal opens and closes
- ✅ Form validation working
- ✅ New members created successfully
- ✅ Members appear in team grid
- ✅ Search functionality working
- ✅ No console errors
- ✅ No API errors
- ✅ Page refresh not required
- ✅ All tests passing

## Next Steps

1. **Deploy to Development**
   - Test all functionality
   - Verify API endpoints
   - Check error handling

2. **Deploy to Staging**
   - Run full test suite
   - Performance testing
   - Security testing

3. **Deploy to Production**
   - Final verification
   - Monitor performance
   - Gather user feedback

4. **Post-Deployment**
   - Monitor logs
   - Track metrics
   - Gather feedback
   - Plan enhancements

---

**Status**: Ready for Deployment ✅
**Last Updated**: January 14, 2026
**Version**: 1.0.0

