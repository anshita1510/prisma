# Frontend-Backend Connection Fix 🔧

## 🎯 **Issue**: Create New Project button not connected to backend

## ✅ **Solution Steps**

### Step 1: Open Browser Developer Tools
1. Press `F12` or right-click → "Inspect"
2. Go to the **Console** tab
3. Try creating a project and watch for error messages

### Step 2: Check Network Requests
1. Go to the **Network** tab in Developer Tools
2. Try creating a project
3. Look for failed requests (they'll be red)
4. Click on any failed request to see details

### Step 3: Verify Authentication
1. Go to **Application** tab → **Local Storage**
2. Check if `token` exists
3. If no token, try logging out and logging back in

### Step 4: Test API Connection Directly

Open your browser console and run this test:

```javascript
// Test 1: Check if backend is reachable
fetch('http://localhost:5004/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@company.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Login result:', data);
  if (data.success) {
    // Store token
    localStorage.setItem('token', data.token);
    
    // Test 2: Try creating a project
    return fetch('http://localhost:5004/api/project-management', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`
      },
      body: JSON.stringify({
        name: 'Browser Test Project',
        description: 'Testing from browser console',
        companyId: 2,
        departmentId: 2,
        ownerId: data.user.employeeId,
        status: 'PLANNING'
      })
    });
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ Project creation result:', data);
  if (data.success) {
    alert('✅ Backend connection works! The issue is in your React form.');
  } else {
    alert('❌ Project creation failed: ' + data.message);
  }
})
.catch(err => {
  console.error('❌ Error:', err);
  alert('❌ Connection failed: ' + err.message);
});
```

### Step 5: Check Environment Variables

Make sure your `Frontend/.env.local` file contains:
```
NEXT_PUBLIC_API_URL=http://localhost:5004
```

### Step 6: Restart Frontend Development Server

If you made changes to environment variables:
```bash
# Stop the frontend server (Ctrl+C)
# Then restart it
npm run dev
```

## 🔍 **Common Issues & Solutions**

### Issue 1: "Network Error" or "CORS Error"
**Solution**: Make sure both servers are running:
- Backend: `http://localhost:5004` 
- Frontend: `http://localhost:3000` or `http://localhost:3001`

### Issue 2: "401 Unauthorized"
**Solution**: 
1. Check if you're logged in
2. Clear localStorage and login again
3. Check if token is being sent with requests

### Issue 3: "404 Not Found"
**Solution**: 
1. Verify backend server is running
2. Check API endpoint URL is correct
3. Ensure routes are properly configured

### Issue 4: "403 Forbidden" 
**Solution**:
1. Check user permissions (must be ADMIN, MANAGER, or TECH_LEAD)
2. Verify user has employee record
3. Check role-based access control

## 🛠️ **Debug Mode Enabled**

I've added debug logging to your frontend code. When you try to create a project, check the browser console for detailed logs:

- 🚀 Project data being sent
- 🔑 Authentication token status  
- 🌐 API URL being used
- 📡 API response details
- ❌ Error details if any

## 📋 **Quick Checklist**

- [ ] Backend server running on port 5004
- [ ] Frontend server running on port 3000/3001
- [ ] User is logged in (check localStorage for token)
- [ ] User has correct permissions (ADMIN/MANAGER/TECH_LEAD)
- [ ] No CORS errors in browser console
- [ ] No network errors in browser console

## 🆘 **If Still Not Working**

1. **Open the debug page**: `Frontend/debug-project-creation.html`
2. **Run all tests** in the debug page
3. **Share the results** from the browser console

The debug page will test:
- ✅ Backend connection
- ✅ Authentication  
- ✅ Project creation
- ✅ Available employees
- ✅ Local storage status

## 💡 **Most Likely Cause**

Based on my testing, your backend is working perfectly. The issue is most likely:

1. **Authentication token not being stored/sent properly**
2. **CORS issue** (frontend and backend on different ports)
3. **User permissions** (user doesn't have project creation rights)
4. **Form validation** preventing the API call

Run the browser console test above - if it works, then the issue is in your React form component!