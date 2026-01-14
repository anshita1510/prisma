# Swagger Quick Start Guide - Fix "Unauthorized" Error

## Problem
Getting `401 Unauthorized` error with message "No token provided" when testing authenticated endpoints in Swagger.

## Solution - Step by Step

### Step 1: Login to Get Token

1. Open Swagger UI: `http://localhost:5004/api-docs`

2. Find the **POST /api/users/login** endpoint under "Authentication" section

3. Click on it to expand

4. Click the **"Try it out"** button (top right of the endpoint)

5. In the Request body, enter:
   ```json
   {
     "email": "singladeepak519@gmail.com",
     "password": "password123"
   }
   ```

6. Click **"Execute"** button

7. Scroll down to see the response

8. In the response, you'll see something like:
   ```json
   {
     "success": true,
     "user": { ... },
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlNVUEVSX0FETUlOIiwiZW1haWwiOiJzaW5nbGFkZWVwYWs1MTlAZ21haWwuY29tIiwidHlwZSI6ImF1dGgiLCJpYXQiOjE3NjgzMDcyMzMsImV4cCI6MTc2ODkxMjAzM30.baUerqFbA-JCIpUB9ptUYHfVB7xxu_nAlioCLOppEN4"
   }
   ```

9. **COPY THE TOKEN** (the long string after "token":) - just the token value, not the quotes

### Step 2: Authorize in Swagger

1. Look at the top right of the Swagger page

2. You'll see an **"Authorize"** button with a lock icon 🔓

3. Click the **"Authorize"** button

4. A popup will appear with a field labeled "Value"

5. **PASTE ONLY THE TOKEN** (without "Bearer " prefix)
   - ✅ **CORRECT**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlNVUEVSX0FETUlOIiwiZW1haWwiOiJzaW5nbGFkZWVwYWs1MTlAZ21haWwuY29tIiwidHlwZSI6ImF1dGgiLCJpYXQiOjE3NjgzMDcyMzMsImV4cCI6MTc2ODkxMjAzM30.baUerqFbA-JCIpUB9ptUYHfVB7xxu_nAlioCLOppEN4`
   - ❌ **WRONG**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

6. Click **"Authorize"** button in the popup

7. Click **"Close"** to close the popup

8. The lock icon should now be closed 🔒 (indicating you're authenticated)

### Step 3: Test Register Employee Endpoint

1. Find **POST /api/users/register** endpoint

2. Click on it to expand

3. Click **"Try it out"**

4. Enter the request body:
   ```json
   {
     "email": "newuser@example.com",
     "firstName": "John",
     "lastName": "Doe",
     "role": "EMPLOYEE",
     "phone": "1234567890",
     "designation": "SOFTWARE_ENGINEER"
   }
   ```

5. Click **"Execute"**

6. You should now get a **200 Success** response instead of 401!

## Common Mistakes

### ❌ Mistake 1: Including "Bearer " in the token
**Wrong**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
**Right**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Swagger automatically adds "Bearer " prefix, so you should only paste the token.

### ❌ Mistake 2: Not clicking "Authorize" button
You must click the Authorize button at the top of the page, not just copy the token.

### ❌ Mistake 3: Token expired
Tokens expire after 7 days. If you get "Invalid or expired token", login again to get a new token.

### ❌ Mistake 4: Using wrong credentials
Make sure you're using the correct email and password:
- Super Admin: `singladeepak519@gmail.com` / `password123`

## Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│  Swagger UI                                    [Authorize 🔓]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Authentication                                               │
│  ▼ POST /api/users/login                                     │
│     Login to get token                                        │
│                                                               │
│  User Management                                              │
│  ▼ POST /api/users/register  🔒 (Requires Auth)             │
│     Register new employee                                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Step 1: Login → Get Token
Step 2: Click [Authorize 🔓] → Paste Token → Click Authorize
Step 3: Test any authenticated endpoint
```

## Testing with cURL (Alternative)

If you prefer using cURL instead of Swagger UI:

```bash
# Step 1: Login and get token
curl -X POST http://localhost:5004/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "singladeepak519@gmail.com",
    "password": "password123"
  }'

# Copy the token from response

# Step 2: Register employee with token
curl -X POST http://localhost:5004/api/users/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "email": "newuser@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "EMPLOYEE",
    "phone": "1234567890",
    "designation": "SOFTWARE_ENGINEER"
  }'
```

## Troubleshooting

### Still getting 401 error?

1. **Check if you clicked Authorize**: The lock icon should be closed 🔒
2. **Check token format**: Should NOT include "Bearer " prefix in Swagger
3. **Check token validity**: Try logging in again to get a fresh token
4. **Check user role**: Only ADMIN and SUPER_ADMIN can register employees
5. **Check backend logs**: Look at the terminal where backend is running

### Backend not running?

```bash
cd Backend
npm run dev
```

Server should start on port 5004.

## Success Indicators

✅ Lock icon is closed 🔒 after authorization
✅ Response code is 200 or 201 (not 401)
✅ Response body shows success: true
✅ New user appears in database

## Need Help?

- Check backend terminal for error logs
- Verify database connection
- Ensure all environment variables are set
- Try restarting the backend server
