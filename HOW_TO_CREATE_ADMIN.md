# 🔐 How to Create Admin (Super Admin Guide)

## Method 1: Using Swagger UI (Recommended)

### Step 1: Login as Super Admin
1. Open Swagger: http://localhost:5004/api-docs
2. Go to `/api/users/login` endpoint
3. Click "Try it out"
4. Enter credentials:
   ```json
   {
     "email": "singladeepak519@gmail.com",
     "password": "password123"
   }
   ```
5. Click "Execute"
6. **Copy the token** from response (without "Bearer " prefix)

### Step 2: Authorize in Swagger
1. Click the **"Authorize"** button at top of Swagger page
2. Paste **ONLY the token** (not "Bearer token")
3. Click "Authorize"
4. Click "Close"

### Step 3: Create Admin
1. Go to `/api/users/register` endpoint
2. Click "Try it out"
3. Enter admin details:
   ```json
   {
     "email": "newadmin@example.com",
     "firstName": "Admin",
     "lastName": "User",
     "phone": "+1234567890",
     "designation": "Administrator",
     "role": "ADMIN"
   }
   ```
4. Click "Execute"

### Step 4: Get OTP and Password

**Option A: From Backend Terminal Logs**
```
🔐 GENERATED CREDENTIALS FOR: newadmin@example.com
   OTP: 123456
   Temp Password: abc123def456
```

**Option B: From Email**
- Check inbox for email from: `s.deepak@signitysolutions.com`
- Subject: "Welcome to Tikr - Your Account is Ready!"
- **Check SPAM folder if not in inbox!**

### Step 5: Set Password for New Admin
1. Go to `/api/users/set-password` endpoint
2. Click "Try it out"
3. Enter:
   ```json
   {
     "email": "newadmin@example.com",
     "otp": "123456",
     "currentPassword": "abc123def456",
     "newPassword": "YourNewPassword123"
   }
   ```
4. Click "Execute"
5. ✅ Done! Admin can now login with new password

---

## Method 2: Using Terminal/Script

```bash
cd team_anshita_keka_clone_v2/Backend
./final-create-admin.sh
```

Then check backend terminal for OTP and password.

---

## 📧 Email Not Receiving?

### Reasons:
1. **Email is in SPAM folder** ⭐ (Most common!)
2. **Gmail Promotions tab**
3. **Email delay** (wait 1-2 minutes)

### Solution:
**Use credentials from backend terminal logs!** They are printed when admin is created.

---

## ✅ Email IS Working!

Backend logs show:
```
✅ SMTP connection verified
✅ Email sent successfully
```

Email is being sent from: `s.deepak@signitysolutions.com`

---

## 🆘 Need Help?

1. Check backend terminal for credentials
2. Check spam folder
3. Use credentials from logs directly
4. Contact support if still issues

---

**Created by: Kiro AI Assistant**
**Date: January 14, 2026**
