# Swagger API Documentation

## Overview
Swagger UI has been successfully integrated into the Keka Clone backend API. This provides an interactive interface to explore and test all API endpoints.

## Accessing Swagger UI

Once the backend server is running, you can access Swagger UI at:

```
http://localhost:5004/api-docs
```

## Features

### 1. Interactive API Testing
- Test all API endpoints directly from the browser
- No need for external tools like Postman
- Real-time request/response visualization

### 2. Authentication
Most endpoints require authentication. To test authenticated endpoints:

1. **Login First**: Use the `/api/users/login` endpoint to get a JWT token
   - Click on the endpoint
   - Click "Try it out"
   - Enter credentials:
     ```json
     {
       "email": "singladeepak519@gmail.com",
       "password": "password123"
     }
     ```
   - Click "Execute"
   - Copy the token from the response

2. **Authorize**: 
   - Click the "Authorize" 🔓 button at the top of the page
   - In the "Value" field, enter ONLY the token (without "Bearer " prefix)
   - Swagger will automatically add "Bearer " prefix
   - Click "Authorize"
   - Click "Close"
   - Now you can test all authenticated endpoints
   
   **IMPORTANT**: 
   - ✅ Correct: Just paste the token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ❌ Wrong: Don't include "Bearer ": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Now you can test all authenticated endpoints

### 3. Available API Groups

#### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/check-user` - Check if user exists
- `POST /api/users/google-login` - Google OAuth login
- `POST /api/users/microsoft-login` - Microsoft OAuth login
- `POST /api/users/superAdmin` - Create super admin
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/verify-otp` - Verify OTP
- `POST /api/users/reset-password` - Reset password
- `POST /api/users/set-password` - Set password for invited user

#### User Management (Requires Authentication)
- `GET /api/users/me` - Get current user profile
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users/register` - Invite employee (Admin only)

#### Leave Management (Requires Authentication)
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my-leaves` - Get current user's leaves
- `GET /api/leaves` - Get all leaves (Admin/Manager only)
- `GET /api/leaves/{id}` - Get leave by ID
- `PATCH /api/leaves/{id}/status` - Approve/Reject leave (Admin/Manager only)
- `DELETE /api/leaves/{id}` - Delete leave (Pending only)

## Test Credentials

### Super Admin
- Email: `singladeepak519@gmail.com`
- Password: `password123`

### Managers
- Email: `jane.smith@tikr.com` | Password: `password123`
- Email: `mike.johnson@tikr.com` | Password: `password123`
- Email: `sarah.wilson@tikr.com` | Password: `password123`

### Employees
- Email: `john.doe@tikr.com` | Password: `password123`
- Email: `david.brown@tikr.com` | Password: `password123`
- Email: `singladeepak910@gmail.com` | Password: `password123`

## Example Workflow

### 1. Login and Get Token
```bash
curl -X POST http://localhost:5004/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"singladeepak519@gmail.com","password":"password123"}'
```

### 2. Get All Leaves (Admin)
```bash
curl -X GET http://localhost:5004/api/leaves \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Approve Leave
```bash
curl -X PATCH http://localhost:5004/api/leaves/1/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"status":"APPROVED"}'
```

## Benefits of Swagger

1. **Self-Documenting API**: Automatically generates documentation from code
2. **Interactive Testing**: Test endpoints without writing code
3. **Schema Validation**: See request/response schemas
4. **Error Handling**: View possible error responses
5. **Team Collaboration**: Share API documentation with frontend developers

## Troubleshooting

### Swagger UI Not Loading
- Ensure backend server is running on port 5004
- Check console for any errors
- Try clearing browser cache

### Authentication Issues
- Make sure to include "Bearer " prefix before the token
- Token expires after 7 days - login again if needed
- Check if user account is active

### CORS Issues
- Frontend is configured to accept requests from localhost:3000 and localhost:3001
- If using different ports, update CORS configuration in `server.ts`

## Next Steps

- Add more detailed examples for each endpoint
- Include response schemas for error cases
- Add rate limiting documentation
- Document file upload endpoints (if any)
