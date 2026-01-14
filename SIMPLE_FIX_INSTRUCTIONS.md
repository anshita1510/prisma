# Simple Fix: How to Test Manager & HR Mutual Approval

## 🎯 The Problem

You're logged in as **Employee ID 30** and trying to approve leaves created by **Employee ID 30** (yourself).

The system correctly blocks this as **self-approval**.

## ✅ Simple Solution

You need to create a leave from a **DIFFERENT user** and then approve it.

## 📋 Step-by-Step Instructions

### Option 1: Use Existing Users (Recommended)

1. **Find another user in your system:**
   - Run the SQL query in `check_leaves_and_users.sql`
   - Look for a user with a different employee ID
   - Note their email and password

2. **Create a leave from that user:**
   - Logout from current session
   - Login with the other user's credentials
   - Go to Leave Management
   - Apply for a leave
   - Logout

3. **Approve as your current user:**
   - Login back as your original user (employee ID 30)
   - Go to Leave Management
   - You should see the other user's leave
   - Click Approve
   - ✅ Success!

### Option 2: Create a New Test User

If you don't have another user, create one:

1. **Register a new user:**
   - Go to your registration page
   - Create a new user with:
     - Email: `testmanager@example.com`
     - Name: Test Manager
     - Designation: MANAGER (or HR)
     - Password: password123

2. **Apply for leave as new user:**
   - Login as `testmanager@example.com`
   - Apply for a leave
   - Logout

3. **Approve as your current user:**
   - Login as your original user
   - Approve the test user's leave
   - ✅ Success!

### Option 3: Use Two Browser Windows

1. **Window 1 (Chrome):**
   - Login as User A
   - Apply for leave
   - Keep window open

2. **Window 2 (Chrome Incognito or Firefox):**
   - Login as User B (your current user)
   - Go to Leave Management
   - Approve User A's leave
   - ✅ Success!

## 🔍 Quick Check

**Before approving, verify:**

1. Open browser console (F12)
2. Check localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('user'))
   ```
3. Note your employee ID

4. Look at the leave you're trying to approve
5. Check if the leave's employee ID is different from yours

**If they're the same → You're trying to approve your own leave!**

## 💡 Why This Happens

The system prevents self-approval for security reasons:
- Ensures proper approval workflow
- Maintains audit trail integrity
- Prevents abuse of the leave system

## 🎯 What You Should See

**Correct scenario:**
```
Your employee ID: 30
Leave applicant ID: 25 (different!)
Result: ✅ Approval works
```

**Wrong scenario (current):**
```
Your employee ID: 30
Leave applicant ID: 30 (same!)
Result: ❌ "You cannot approve your own leave request"
```

## 📞 Still Having Issues?

If you're still stuck, please provide:
1. Your current user's email
2. The email of the user whose leave you're trying to approve
3. Screenshot of the leave management page showing the leave details

This will help identify if there's a different issue.

---

**Remember:** The system is working correctly. You just need to approve someone else's leave, not your own!
