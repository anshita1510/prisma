# Dynamic Project & Task Management - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Verify Backend is Running
```bash
cd Backend
npm run dev
# Should see: 🚀 Server is running on port 5004
```

### Step 2: Use Dynamic Projects Page

The dynamic projects page is ready at:
```
Frontend/app/enhanced-tms/projects/page-dynamic.tsx
```

To use it, either:

**Option A: Replace the current page**
```bash
cp Frontend/app/enhanced-tms/projects/page.tsx Frontend/app/enhanced-tms/projects/page.tsx.backup
cp Frontend/app/enhanced-tms/projects/page-dynamic.tsx Frontend/app/enhanced-tms/projects/page.tsx
```

**Option B: Update your routing to use the dynamic version**
```typescript
// In your routing configuration
import DynamicProjectsPage from '@/app/enhanced-tms/projects/page-dynamic';
```

### Step 3: Start Frontend
```bash
cd Frontend
npm run dev
# Should see: ▲ Next.js running on http://localhost:3000
```

### Step 4: Test the Implementation

1. **Login** with your admin/manager account
2. **Navigate** to Projects page
3. **Click** "Create New Project"
4. **Fill** in the form and submit
5. **Click** on a project to view details
6. **Click** "Add Task" to create a task
7. **Change** task status from dropdown

## 📁 Files Overview

### New Files Created
```
Frontend/app/services/dynamicProjectService.ts
├── getAllProjects()
├── getProjectById()
├── createProject()
├── updateProject()
├── deleteProject()
├── getProjectTasks()
├── createTask()
├── updateTask()
├── deleteTask()
├── getProjectMembers()
├── assignTeamMember()
└── removeTeamMember()

Frontend/app/enhanced-tms/projects/page-dynamic.tsx
├── Projects list view
├── Project detail view
├── Task management
└── Real-time updates

Frontend/components/projects/CreateTaskModal.tsx
├── Task creation form
├── Team member assignment
├── Priority and status selection
└── Due date and hours estimation
```

### Updated Files
```
Frontend/components/projects/CreateProjectModal.tsx
├── Now uses dynamicProjectService
├── Proper authentication
└── Real-time employee loading
```

## 🎯 Key Features

### Projects Management
- ✅ Create projects dynamically
- ✅ View all projects in real-time
- ✅ Search and filter projects
- ✅ View project details
- ✅ Delete projects
- ✅ Track progress
- ✅ View team members

### Task Management
- ✅ Create tasks within projects
- ✅ Assign tasks to team members
- ✅ Set priority (LOW, MEDIUM, HIGH, URGENT)
- ✅ Set status (TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, CANCELLED)
- ✅ Set due dates
- ✅ Estimate hours
- ✅ Update task status
- ✅ Delete tasks

## 🔧 API Endpoints

All endpoints are under `/api/project-management`:

```
Projects:
  GET    /api/project-management
  GET    /api/project-management/:projectId
  POST   /api/project-management
  PUT    /api/project-management/:projectId
  DELETE /api/project-management/:projectId

Tasks:
  GET    /api/project-management/:projectId/tasks
  POST   /api/project-management/:projectId/tasks
  PUT    /api/project-management/tasks/:taskId
  DELETE /api/project-management/tasks/:taskId

Members:
  GET    /api/project-management/:projectId/members
  POST   /api/project-management/:projectId/members
  DELETE /api/project-management/:projectId/members/:employeeId
```

## 🧪 Testing Scenarios

### Scenario 1: Create and View Project
```
1. Click "Create New Project"
2. Fill in:
   - Project Name: "My First Project"
   - Description: "Test project"
   - Department: Select from dropdown
3. Click "Create Project"
4. Project should appear in list
5. Click on project to view details
```

### Scenario 2: Create and Manage Tasks
```
1. Open a project
2. Click "Add Task"
3. Fill in:
   - Task Title: "Design UI"
   - Priority: "HIGH"
   - Assign To: Select team member
   - Due Date: Select date
   - Estimated Hours: "8"
4. Click "Create Task"
5. Task should appear in "To Do" tab
6. Change status from dropdown
7. Task should move to new status tab
```

### Scenario 3: Search and Filter
```
1. On projects page
2. Type in search box
3. Projects should filter in real-time
4. Clear search to see all projects
```

## 🐛 Troubleshooting

### Issue: "User information not found"
**Solution**: Make sure you're logged in. Check localStorage has user data.

### Issue: "Failed to load projects"
**Solution**: 
- Verify backend is running on port 5004
- Check network tab in DevTools
- Verify API URL in environment variables

### Issue: "No employees available"
**Solution**:
- Create employees first
- Assign employees to departments
- Verify employees are active

### Issue: "Failed to create project"
**Solution**:
- Fill all required fields
- Check user has ADMIN or MANAGER role
- Check browser console for error details

## 📊 Data Flow

```
User Interface
    ↓
CreateProjectModal / CreateTaskModal
    ↓
dynamicProjectService
    ↓
Axios (with auth interceptor)
    ↓
Backend API (/api/project-management)
    ↓
Database
    ↓
Response back to Frontend
    ↓
Update UI State
    ↓
Re-render Components
```

## 🔐 Authentication

All requests automatically include:
```
Authorization: Bearer <token>
```

Token is read from localStorage and added by axios interceptor.

## 📝 Environment Variables

Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5004
```

## 🎨 UI Components Used

- Dialog (for modals)
- Button (for actions)
- Input (for text fields)
- Textarea (for descriptions)
- Select (for dropdowns)
- Badge (for status/priority)
- Card (for project/task cards)
- Tabs (for task status tabs)
- Progress (for progress bars)

## 📱 Responsive Design

- Mobile: Single column layout
- Tablet: 2 column layout
- Desktop: 3 column layout

## ⚡ Performance

- Projects loaded once on page mount
- Tasks loaded when project selected
- Optimistic UI updates
- Minimal re-renders
- Efficient filtering

## 🚀 Next Steps

1. ✅ Test the implementation
2. ✅ Verify all features work
3. ✅ Check error handling
4. ✅ Test on different devices
5. ✅ Deploy to production

## 📞 Support

For detailed information, see:
- `DYNAMIC_PROJECT_TASK_IMPLEMENTATION.md` - Full documentation
- `Frontend/CREATE_PROJECT_MODAL_FIX.md` - Project modal details
- Browser console - Error messages
- Network tab - API responses

## ✅ Checklist

- [ ] Backend running on port 5004
- [ ] Frontend running on port 3000
- [ ] User logged in with proper role
- [ ] Can create projects
- [ ] Can view projects
- [ ] Can create tasks
- [ ] Can update task status
- [ ] Can delete projects/tasks
- [ ] Search works
- [ ] Error messages display
- [ ] Loading states show

---

**Status**: ✅ Ready to Use
**Version**: 1.0
**Last Updated**: 2024
