# Tasks Page - Technical Details 🔧

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Tasks Page (Frontend)                     │
│  - Fetches projects from API                                │
│  - Fetches tasks for each project                           │
│  - Calculates overdue status locally                        │
│  - Displays tasks with correct status colors                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Dynamic Project Service (API Layer)             │
│  - getAllProjects()                                         │
│  - getProjectTasks(projectId)                               │
│  - createTask(payload)                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Port 5004)                     │
│  - GET /api/project-management (get projects)               │
│  - GET /api/project-management/{id}/tasks (get tasks)       │
│  - POST /api/project-management/{id}/tasks (create task)    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database (Prisma)                         │
│  - Project table                                            │
│  - Task table (with status: TODO, IN_PROGRESS, etc.)        │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Task Creation Flow
```
User Input
    ↓
CreateTaskModal
    ↓
taskGenerationService.generateTask()
    ├─ Generates title, description
    ├─ Calculates status (may be OVERDUE)
    ├─ Calculates priority
    └─ Generates tags
    ↓
User Reviews Preview
    ↓
handleSubmit()
    ├─ Maps status to valid backend value
    │  (OVERDUE → TODO, IN_PROGRESS → IN_PROGRESS, etc.)
    ├─ Extracts createdById from localStorage
    └─ Calls dynamicProjectService.createTask()
    ↓
API Request
    ├─ POST /api/project-management/{projectId}/tasks
    ├─ Headers: Authorization: Bearer {token}
    └─ Body: { title, description, status, priority, ... }
    ↓
Backend Processing
    ├─ Validates status (must be valid enum)
    ├─ Creates task in database
    └─ Returns created task
    ↓
Modal Closes
    ↓
onSuccess() callback
    ↓
loadTasks() reloads task list
```

### Task Display Flow
```
Tasks Page Loads
    ↓
loadTasks()
    ├─ Calls dynamicProjectService.getAllProjects()
    │  └─ GET /api/project-management
    │     └─ Returns: { success: true, data: [...projects] }
    ↓
For Each Project
    ├─ Calls dynamicProjectService.getProjectTasks(projectId)
    │  └─ GET /api/project-management/{projectId}/tasks
    │     └─ Returns: { success: true, data: [...tasks] }
    ↓
Map Tasks to Frontend Format
    ├─ Extract: id, title, description, status, priority, dueDate, etc.
    ├─ Status is one of: TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, CANCELLED
    └─ Store in allTasks array
    ↓
setTasks(allTasks)
    ↓
Render Tasks
    ├─ For each task:
    │  ├─ Get status color (with overdue check)
    │  ├─ Get priority color
    │  ├─ Check if overdue (dueDate < today)
    │  └─ Display task card
    ↓
User Sees Tasks
```

## Status Handling

### Frontend Task Generation Service
```typescript
// Generates status based on dates
generateStatus(startDate, dueDate) {
  if (dueDate < today) return 'OVERDUE';
  if (startDate <= today && dueDate >= today) return 'IN_PROGRESS';
  return 'TODO';
}
```

### Create Task Modal - Status Mapping
```typescript
// Maps generated status to valid backend status
const generatedStatus = 'OVERDUE'; // from task generation
let backendStatus = 'TODO'; // default

if (generatedStatus === 'IN_PROGRESS') {
  backendStatus = 'IN_PROGRESS';
} else if (generatedStatus === 'COMPLETED') {
  backendStatus = 'COMPLETED';
} else if (generatedStatus === 'CANCELLED') {
  backendStatus = 'CANCELLED';
}
// OVERDUE and TODO both map to TODO

// Send to backend
await api.post('/api/project-management/{projectId}/tasks', {
  status: backendStatus,  // ✅ Valid backend status
  ...otherData
});
```

### Tasks Page - Overdue Calculation
```typescript
// Frontend calculates overdue by comparing dates
const getStatusColor = (status, dueDate) => {
  // Check if overdue (frontend calculation)
  if (dueDate && status !== 'COMPLETED' && status !== 'CANCELLED') {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (due < today) {
      return 'bg-red-100 text-red-800'; // Overdue color
    }
  }
  
  // Use status for other colors
  switch (status) {
    case 'TODO': return 'bg-gray-100 text-gray-800';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
    case 'IN_REVIEW': return 'bg-orange-100 text-orange-800';
    case 'COMPLETED': return 'bg-green-100 text-green-800';
    case 'CANCELLED': return 'bg-gray-100 text-gray-800';
  }
};
```

## API Endpoints

### Get All Projects
```
GET /api/project-management
Headers: Authorization: Bearer {token}

Response:
{
  success: true,
  data: [
    {
      id: 1,
      name: "Project Name",
      description: "...",
      status: "ACTIVE",
      ...
    }
  ]
}
```

### Get Project Tasks
```
GET /api/project-management/{projectId}/tasks
Headers: Authorization: Bearer {token}

Response:
{
  success: true,
  data: [
    {
      id: 1,
      title: "Task Title",
      description: "...",
      status: "TODO",  // ✅ Valid status
      priority: "HIGH",
      dueDate: "2026-01-20",
      assignedTo: { id: 1, name: "John" },
      ...
    }
  ]
}
```

### Create Task
```
POST /api/project-management/{projectId}/tasks
Headers: Authorization: Bearer {token}
Body: {
  title: "Task Title",
  description: "...",
  status: "TODO",  // ✅ Must be valid status
  priority: "HIGH",
  dueDate: "2026-01-20",
  assignedToId: 1,
  createdById: 1,
  ...
}

Response:
{
  success: true,
  data: {
    id: 1,
    title: "Task Title",
    status: "TODO",
    ...
  }
}
```

## Database Schema

### Task Table
```sql
CREATE TABLE Task (
  id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED'),
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
  dueDate DATETIME,
  startDate DATETIME,
  projectId INT,
  assignedToId INT,
  createdById INT,
  ...
);
```

## Type Definitions

### Frontend Task Interface
```typescript
interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  startDate?: string;
  assignedTo?: {
    id: number;
    name: string;
  };
  project?: {
    id: number;
    name: string;
  };
  tags?: string[];
  estimatedHours?: number;
  progressPercentage?: number;
}
```

### Backend Task Status Enum
```typescript
enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  COMPLETED
  CANCELLED
}
```

## Performance Considerations

### Current Implementation
- **Projects Fetch**: 1 API call
- **Tasks Fetch**: N API calls (one per project)
- **Total**: 1 + N API calls

### Optimization Opportunities
1. **Batch Fetch**: Fetch all tasks in one call
2. **Pagination**: Limit tasks per page
3. **Caching**: Cache projects and tasks
4. **Virtual Scrolling**: For large lists
5. **WebSocket**: Real-time updates

### Current Performance
- ✅ Fast for typical use (< 10 projects)
- ✅ Acceptable for < 100 tasks
- ⚠️ May slow down with 1000+ tasks

## Error Handling

### API Errors
```typescript
if (!result.success) {
  console.error('Error:', result.message);
  setDebugInfo(`Error: ${result.message}`);
  // Display error to user
}
```

### Network Errors
```typescript
try {
  const result = await api.get(...);
} catch (error) {
  console.error('Network error:', error);
  setDebugInfo(`Error: ${error.message}`);
}
```

### Validation Errors
```typescript
if (!formData.title.trim()) {
  setError('Task title is required');
  return;
}
```

## Testing Strategy

### Unit Tests
- Status color calculation
- Overdue detection
- Status mapping

### Integration Tests
- Create task → Display on page
- Filter tasks by status
- Search tasks

### E2E Tests
- Full workflow: Create project → Create task → View task

## Debugging

### Enable Debug Info
- Debug info displays on Tasks page
- Shows: "Loading projects...", "Found X projects", "Loaded X tasks"

### Console Logs
```
🔍 Fetching all projects...
📊 Projects result: {...}
✅ Found projects: 5
📋 Fetching tasks for project 1...
✅ Found 3 tasks in project 1
✅ Tasks loaded: 3
```

### Browser DevTools
1. Open F12
2. Go to Console tab
3. Look for logs with emoji prefixes
4. Check Network tab for API calls

## Future Enhancements

1. **Task Editing**: Update task details
2. **Task Deletion**: Remove tasks
3. **Bulk Operations**: Select multiple tasks
4. **Task Comments**: Add comments to tasks
5. **Task Attachments**: Attach files
6. **Task History**: Track changes
7. **Task Templates**: Create from templates
8. **Task Dependencies**: Link related tasks
9. **Task Notifications**: Alert on changes
10. **Task Analytics**: Track metrics

---

**Version**: 1.0.0
**Last Updated**: January 13, 2026
**Status**: Complete ✅

