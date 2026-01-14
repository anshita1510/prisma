# Tasks Page - Debugging Guide ✅

## Issue
Tasks are not appearing on the Tasks page even after creation.

## Root Causes

### 1. No Projects Exist
- Tasks belong to projects
- If no projects exist, there are no tasks to display
- Solution: Create a project first

### 2. API Failures
- Projects API might be failing
- Tasks API might be failing
- Network issues
- Authentication issues

### 3. Data Mismatch
- Task data structure doesn't match backend response
- Status values don't match
- Missing required fields

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for logs like:
   ```
   🔍 Fetching all projects...
   📊 Projects result: {...}
   ✅ Found projects: 5
   📋 Fetching tasks for project 1...
   ✅ Tasks loaded: 10
   ```

### Step 2: Check Debug Info on Page
The Tasks page now displays debug information:
- "Loading projects..."
- "Found X projects. Fetching tasks..."
- "✅ Loaded X total tasks"
- "No projects found. Create a project first to add tasks."
- "Error: [error message]"

### Step 3: Verify Projects Exist
1. Navigate to Enhanced TMS → Projects
2. Check if any projects are listed
3. If no projects:
   - Click "Create New Project"
   - Fill in project details
   - Create the project

### Step 4: Verify Tasks Exist in Projects
1. Go to Projects page
2. Click on a project
3. Check if tasks are listed in project detail view
4. If tasks exist in project but not on Tasks page:
   - There's a data fetching issue
   - Check console for errors

### Step 5: Check Network Requests
1. Open DevTools → Network tab
2. Refresh Tasks page
3. Look for API calls:
   - `GET /api/project-management` (get projects)
   - `GET /api/project-management/{id}/tasks` (get tasks)
4. Check response status:
   - 200 = Success
   - 401 = Not authenticated
   - 403 = Not authorized
   - 500 = Server error

### Step 6: Check Authentication
1. Verify you're logged in
2. Check if token is in localStorage:
   - Open DevTools → Application → Local Storage
   - Look for `token` key
   - If missing, log in again

## Common Issues & Solutions

### Issue: "No tasks found" message
**Possible Causes**:
1. No projects exist
2. Projects exist but have no tasks
3. API is failing silently

**Solutions**:
1. Check debug info on page
2. Create a project if none exist
3. Create tasks in the project
4. Check browser console for errors

### Issue: Console shows "No projects found"
**Cause**: Projects API is returning empty or failing

**Solutions**:
1. Check if projects exist in database
2. Verify authentication token
3. Check backend logs
4. Verify API endpoint is correct

### Issue: Console shows projects but no tasks
**Cause**: Tasks API is failing or returning empty

**Solutions**:
1. Check if tasks exist in project
2. Verify task API endpoint
3. Check backend logs
4. Verify data structure matches

### Issue: 401 Unauthorized error
**Cause**: Not authenticated

**Solutions**:
1. Log in again
2. Check token in localStorage
3. Verify token is valid
4. Check token expiration

### Issue: 403 Forbidden error
**Cause**: Not authorized to access resource

**Solutions**:
1. Check user role/permissions
2. Verify user has access to projects
3. Check backend authorization rules

### Issue: 500 Server error
**Cause**: Backend error

**Solutions**:
1. Check backend logs
2. Verify database connection
3. Check API implementation
4. Restart backend server

## Testing Workflow

### Complete Test Flow
1. **Create Project**
   - Go to Projects page
   - Click "Create New Project"
   - Fill in details
   - Create project

2. **Create Task**
   - Go to Tasks page
   - Click "Create New Task"
   - Fill in task details
   - Generate preview
   - Create task

3. **Verify Task Appears**
   - Check Tasks page
   - Task should appear in list
   - Check all details display correctly

4. **Check Console**
   - Open DevTools
   - Look for success logs
   - No errors should appear

### Debug Test Flow
1. Open DevTools Console
2. Go to Tasks page
3. Watch console logs:
   - "🔍 Fetching all projects..."
   - "📊 Projects result: {...}"
   - "✅ Found projects: X"
   - "📋 Fetching tasks for project X..."
   - "✅ Tasks loaded: X"

4. Check page debug info
5. Verify tasks appear

## Console Logs Reference

### Success Logs
```
🔍 Fetching all projects...
📊 Projects result: {success: true, data: [...]}
✅ Found projects: 5
📋 Fetching tasks for project 1...
📋 Tasks result for project 1: {success: true, data: [...]}
✅ Found 3 tasks in project 1
✅ Tasks loaded: 3
```

### Error Logs
```
⚠️ No projects found or API error
❌ Error loading tasks: Error: Network error
📊 Projects result: {success: false, message: "..."}
```

## Data Structure Verification

### Expected Project Structure
```typescript
{
  id: number,
  name: string,
  description?: string,
  status: string,
  ...
}
```

### Expected Task Structure
```typescript
{
  id: number,
  title: string,
  description?: string,
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED',
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  dueDate: string,
  assignedTo?: {
    id: number,
    name: string
  },
  project?: {
    id: number,
    name: string
  },
  tags?: string[]
}
```

## Backend Verification

### Check Backend Logs
1. Look for API request logs
2. Verify projects are being returned
3. Verify tasks are being returned
4. Check for any errors

### Test Backend Endpoints
Use Postman or curl:

```bash
# Get all projects
curl -H "Authorization: Bearer {token}" \
  http://localhost:5004/api/project-management

# Get tasks for project
curl -H "Authorization: Bearer {token}" \
  http://localhost:5004/api/project-management/{projectId}/tasks
```

## Frontend Verification

### Check API Service
1. Verify `dynamicProjectService` is imported
2. Verify methods exist:
   - `getAllProjects()`
   - `getProjectTasks(projectId)`
3. Check method implementations
4. Verify error handling

### Check Component State
1. Verify `tasks` state is updated
2. Verify `projects` state is updated
3. Verify `loading` state changes
4. Verify `debugInfo` displays

## Performance Considerations

### Slow Loading
- Multiple API calls (one per project)
- Consider batching or pagination
- Check network speed
- Check backend performance

### Memory Issues
- Large number of tasks
- Consider pagination
- Consider virtual scrolling
- Check for memory leaks

## Next Steps

1. **Check Console Logs**
   - Open DevTools
   - Look for error messages
   - Note any API failures

2. **Check Debug Info**
   - Read debug message on page
   - Understand what's happening
   - Identify the issue

3. **Follow Solutions**
   - Apply appropriate solution
   - Test again
   - Verify fix works

4. **Report Issues**
   - If still not working
   - Provide console logs
   - Provide debug info
   - Provide steps to reproduce

## Summary

The Tasks page now includes:
- ✅ Detailed console logging
- ✅ Debug info display on page
- ✅ Better error handling
- ✅ Clear error messages
- ✅ Easy troubleshooting

Use these tools to identify and fix any issues with task display.

---

**Version**: 1.0.0
**Last Updated**: January 13, 2026
