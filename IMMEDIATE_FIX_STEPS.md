# ✅ Immediate Fix - Create a Test User to Approve

## 🎯 The Problem (Confirmed)

You are logged in as:
- **Employee ID:** 30
- **Name:** HR HR
- **Designation:** HR (based on name)

The leave you're trying to approve:
- **Leave ID:** 11
- **Created by Employee ID:** 30 (YOU!)
- **Applicant:** HR HR (YOU!)

**Result:** System correctly blocks self-approval ❌

## ✅ Solution: Create or Use Another User

### Option 1: Quick Test with Existing User (If Available)

Do you have access to another user account? For example:
- `singladeepak519@gmail.com`
- `manager@example.com`
- Any other user email

If yes:
1. **Logout** from current session (HR HR)
2. **Login** as the other user
3. **Apply for a leave** from that user
4. **Logout**
5. **Login back** as HR HR
6. **Approve** the other user's leave ✅

### Option 2: Create a New Test User

1. **Open a new Incognito/Private browser window**

2. **Register a new user:**
   - Go to: http://localhost:3000/register (or your registration page)
   - Fill in:
     - Email: `testmanager@test.com`
     - Password: `password123`
     - Name: Test Manager
     - Designation: MANAGER
     - Other required fields

3. **Apply for leave as Test Manager:**
   - Login as `testmanager@test.com`
   - Go to Leave Management
   - Click "Apply for Leave"
   - Fill in the form and submit
   - **Keep this window open**

4. **In your original window (as HR HR):**
   - Refresh the Leave Management page
   - You should see Test Manager's leave
   - Click "Approve"
   - ✅ Success!

### Option 3: Use Database to Create Test Leave

If you have database access, you can create a test leave from another employee:

```sql
-- First, find another employee ID (not 30)
SELECT id, name, designation FROM "Employee" WHERE id != 30 LIMIT 1;

-- Let's say you found employee ID 25
-- Create a test leave for that employee
INSERT INTO "Leave" ("employeeId", "departmentId", "type", "status", "reason", "startDate", "endDate", "createdAt", "updatedAt")
VALUES (
  25,  -- Different employee ID
  (SELECT "departmentId" FROM "Employee" WHERE id = 25),
  'CASUAL',
  'PENDING',
  'Test leave for approval',
  '2026-01-20',
  '2026-01-22',
  NOW(),
  NOW()
);
```

Then refresh your Leave Management page and approve this leave.

## 🔍 How to Verify You're Using Different Users

**Before approving, check:**

1. Open browser console (F12)
2. Run:
   ```javascript
   const user = JSON.parse(localStorage.getItem('user'));
   console.log('My Employee ID:', user.id);
   ```
3. Look at the leave card - it should show a different employee name
4. If the names match → You're trying to approve your own leave!

## 📊 Expected Result

**When using different users:**

```
Logged in as: HR HR (Employee ID: 30)
Approving leave from: Test Manager (Employee ID: 25)
Result: ✅ Approval successful!
```

## 💡 Quick Workaround for Testing

If you just want to test the functionality quickly:

1. **Ask a colleague** to create a user account
2. **Have them apply** for a leave
3. **You approve** their leave

Or:

1. **Use two different browsers** (Chrome + Firefox)
2. **Login as different users** in each
3. **Create leave in one**, **approve in the other**

---

**The system is working correctly!** You just need to approve someone else's leave, not your own.
