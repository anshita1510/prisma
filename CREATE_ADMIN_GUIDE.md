# How to Create Admin Users - Complete Guide

## Overview
This guide shows you how to create admin users in your Keka Clone system. Only SUPER_ADMIN users can create ADMIN users.

## Prerequisites
- Backend server running on port 5004
- Super Admin account exists (email: singladeepak519@gmail.com)

---

## Method 1: Using Swagger UI (Recommended - Visual Interface)

### Step-by-Step Instructions:

#### 1. Open Swagger UI
Open your browser and navigate to:
```
http://localhost:5004/api-docs
```

#### 2. Login as Super Admin

1. Find the **"Authentication"** section
2. Click on **`POST /api/users/login`** to expand it
3. Click the **"Try it out"** button
4. In the Request body, enter:
   ```json
   {
     "email": "singladeepak519@gmail.com",
     "password": "password123"
   }
   ```
5. Click **"Execute"**
6. Scroll down to see the response
7. **Copy the entire token** (the long string after "token":)
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlNVUEVSX0FETUlOIi...`

#### 3. Authorize in Swagger

1. Look at the **top right** of the Swagger page
2. Click the **"Authorize"** button (lock icon 🔓)
3. A popup will appear
4. **Paste ONLY the token** in the "Value" field (don't add "Bearer ")
   - ✅ Correct: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ❌ Wrong: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
5. Click **"Authorize"** in the popup
6. Click **"Close"**
7. The lock icon should now be closed 🔒

#### 4. Create Admin User

1. Find the **"User Management"** section
2. Click on **`POST /api/users/register`** to expand it
3. Click **"Try it out"**
4. In the Request body, enter:
   ```json
   {
     "email": "admin@example.com",
     "firstName": "John",
     "lastName": "Admin",
     "role": "ADMIN",
     "phone": "9876543210",
     "designation": "MANAGER"
   }
   ```
5. Click **"Execute"**
6. Check the response - you should see:
   ```json
   {
     "success": true,
     "message": "Invitation email sent successfully"
   }
   ```

#### 5. Admin User Setup

The new admin will receive an email with:
- Temporary password
- Link to set their own password

**Note**: If email is not configured, check the backend logs for the temporary password.

---

## Method 2: Using cURL (Command Line)

### Step 1: Login and Get Token

```bash
curl -X POST http://localhost:5004/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "singladeepak519@gmail.com",
    "password": "password123"
  }'
```

**Copy the token from the response.**

### Step 2: Create Admin User

Replace `YOUR_TOKEN_HERE` with the token you copied:

```bash
curl -X POST http://localhost:5004/api/users/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Admin",
    "role": "ADMIN",
    "phone": "9876543210",
    "designation": "MANAGER"
  }'
```

---

## Method 3: Using Frontend (Admin Dashboard)

### Step 1: Login to Frontend

1. Open: `http://localhost:3000/login`
2. Login with Super Admin credentials:
   - Email: `singladeepak519@gmail.com`
   - Password: `password123`

### Step 2: Navigate to Create User

1. After login, you'll be on the admin dashboard
2. Look for **"Create User"** or **"Add Employee"** in the sidebar
3. Click on it

### Step 3: Fill the Form

1. Enter the new admin details:
   - Email: `admin@example.com`
   - First Name: `John`
   - Last Name: `Admin`
   - Role: Select **"ADMIN"** from dropdown
   - Phone: `9876543210`
   - Designation: Select appropriate designation

2. Click **"Create User"** or **"Send Invitation"**

3. Success message should appear

---

## Available Roles

When creating users, you can assign these roles:

| Role | Description | Permissions |
|------|-------------|-------------|
| **SUPER_ADMIN** | Highest level | Full system access, can create admins |
| **ADMIN** | Administrator | Can manage users, approve leaves, view all data |
| **MANAGER** | Department Manager | Can approve team leaves, view team data |
| **EMPLOYEE** | Regular Employee | Can apply for leave, view own data |

---

## User Designation Options

Common designations you can use:
- `MANAGER`
- `SOFTWARE_ENGINEER`
- `SENIOR_ENGINEER`
- `TEAM_LEAD`
- `HR_MANAGER`
- `DIRECTOR`
- `ANALYST`
- `DESIGNER`

---

## Example: Create Multiple Admin Users

### Admin 1 - HR Admin
```json
{
  "email": "hr.admin@company.com",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "role": "ADMIN",
  "phone": "1234567890",
  "designation": "HR_MANAGER"
}
```

### Admin 2 - IT Admin
```json
{
  "email": "it.admin@company.com",
  "firstName": "Mike",
  "lastName": "Smith",
  "role": "ADMIN",
  "phone": "0987654321",
  "designation": "IT_MANAGER"
}
```

### Admin 3 - Operations Admin
```json
{
  "email": "ops.admin@company.com",
  "firstName": "Emily",
  "lastName": "Davis",
  "role": "ADMIN",
  "phone": "5555555555",
  "designation": "OPERATIONS_MANAGER"
}
```

---

## Troubleshooting

### Error: "Unauthorized" or "No token provided"

**Solution**: You need to authenticate first
1. Login using `/api/users/login` endpoint
2. Copy the token
3. Click "Authorize" in Swagger and paste the token
4. Try again

### Error: "Access denied"

**Solution**: Only SUPER_ADMIN can create ADMIN users
- Make sure you're logged in as Super Admin
- Check your role in the login response

### Error: "Email already exists"

**Solution**: The email is already registered
- Use a different email address
- Or check if the user already exists

### Error: "Failed to send invitation email"

**Solution**: Email service might not be configured
- Check backend logs for the temporary password
- User can still be created, just won't receive email
- You can manually share the credentials with the user

### Token Expired

**Solution**: Login again to get a fresh token
- Tokens expire after 7 days
- Simply login again and get a new token

---

## Verify Admin Creation

### Method 1: Check in Swagger

1. Use `GET /api/users` endpoint (requires authentication)
2. You should see the new admin in the list

### Method 2: Check Database

```bash
# If you have database access
# Connect to your PostgreSQL database and run:
SELECT id, email, "firstName", "lastName", role, status 
FROM "User" 
WHERE role = 'ADMIN';
```

### Method 3: Try Logging In

1. Go to login page
2. Try logging in with the new admin email
3. Use the temporary password from email or backend logs

---

## Next Steps After Creating Admin

1. **Admin Sets Password**: New admin should set their own password
2. **Assign Permissions**: Configure what the admin can access
3. **Create Employee Profile**: Link admin to an employee record if needed
4. **Test Access**: Verify admin can access admin features

---

## Security Best Practices

✅ **Do:**
- Use strong, unique passwords
- Change temporary passwords immediately
- Limit number of admin accounts
- Regularly review admin access
- Use role-based access control

❌ **Don't:**
- Share admin credentials
- Use simple passwords
- Create unnecessary admin accounts
- Leave default passwords unchanged

---

## Quick Reference

### Super Admin Credentials (Default)
- Email: `singladeepak519@gmail.com`
- Password: `password123`

### API Endpoints
- Login: `POST /api/users/login`
- Create User: `POST /api/users/register`
- Get All Users: `GET /api/users`

### Swagger UI
- URL: `http://localhost:5004/api-docs`

### Frontend
- URL: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`

---

## Need Help?

If you encounter any issues:
1. Check backend server is running: `npm run dev` in Backend folder
2. Check backend logs in terminal
3. Verify database connection
4. Ensure you're using correct credentials
5. Try restarting the backend server

---

**Last Updated**: January 14, 2026
**Backend Version**: 1.0.0
