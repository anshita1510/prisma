# Navigation Structure Guide

## Overview
This document outlines the comprehensive role-based navigation structure implemented for the TIKR application, featuring both sidebar and top navigation with nested dropdown menus.

## Navigation Components

### 1. NavigationSidebar (`Frontend/components/navigation/NavigationSidebar.tsx`)
- **Purpose**: Left sidebar navigation with role-based menu items
- **Features**:
  - Collapsible nested menu items
  - Role-based access control
  - User profile display
  - Notification badges
  - Logout functionality

### 2. TopNavigation (`Frontend/components/navigation/TopNavigation.tsx`)
- **Purpose**: Top horizontal navigation bar with dropdown menus
- **Features**:
  - Dropdown menus with descriptions
  - Role-based menu filtering
  - Active state highlighting
  - User avatar and profile info

### 3. DashboardLayout (`Frontend/components/layout/DashboardLayout.tsx`)
- **Purpose**: Main layout wrapper with authentication and route protection
- **Features**:
  - Authentication verification
  - Role-based route protection
  - Loading states
  - Layout composition

## Role-Based Access Control

### User Roles
1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - Administrative access
3. **MANAGER** - Team management access
4. **EMPLOYEE** - Limited access to assigned tasks only

### Navigation Structure by Role

#### SUPER_ADMIN & ADMIN
```
├── Home (Dashboard)
├── Me (Profile)
├── Inbox (Notifications)
├── My Team
├── My Finances
├── Org (Organization)
├── Engage
├── Attendance
│   ├── Dashboard
│   ├── My Attendance
│   ├── Team Attendance
│   └── Reports
├── Leave
│   ├── My Leaves
│   ├── Leave Requests
│   ├── Leave Calendar
│   └── Leave Policies
├── Performance
│   ├── My Performance
│   ├── Team Performance
│   ├── Performance Reviews
│   └── Goals & Objectives
├── Expenses & Travel
│   ├── My Expenses
│   ├── Expense Approvals
│   ├── Travel Requests
│   └── Expense Reports
├── Helpdesk
│   ├── My Tickets
│   ├── All Tickets
│   └── Knowledge Base
├── Task Management
│   ├── Projects
│   ├── All Tasks
│   ├── Task Calendar
│   └── Task Reports
└── Apps
    ├── Enhanced TMS
    ├── Calendar
    └── Reports
```

#### MANAGER
```
├── Home (Dashboard)
├── Me (Profile)
├── Inbox (Notifications)
├── My Team
├── My Finances
├── Engage
├── Attendance
│   ├── Dashboard
│   ├── My Attendance
│   ├── Team Attendance
│   └── Reports
├── Leave
│   ├── My Leaves
│   ├── Leave Requests
│   └── Leave Calendar
├── Performance
│   ├── My Performance
│   ├── Team Performance
│   ├── Performance Reviews
│   └── Goals & Objectives
├── Expenses & Travel
│   ├── My Expenses
│   ├── Expense Approvals
│   ├── Travel Requests
│   └── Expense Reports
├── Helpdesk
│   ├── My Tickets
│   ├── All Tickets
│   └── Knowledge Base
├── Task Management
│   ├── Projects
│   ├── All Tasks
│   ├── Task Calendar
│   └── Task Reports
└── Apps
    ├── Enhanced TMS
    ├── Calendar
    └── Reports
```

#### EMPLOYEE
```
├── Home (Dashboard)
├── Me (Profile)
├── Inbox (Notifications)
├── My Finances
├── Engage
├── Attendance
│   └── My Attendance
├── Leave
│   └── My Leaves
├── Performance
│   ├── My Performance
│   └── Goals & Objectives
├── Expenses & Travel
│   ├── My Expenses
│   └── Travel Requests
├── Helpdesk
│   ├── My Tickets
│   └── Knowledge Base
├── My Tasks (Employee-specific task view)
└── Apps
    ├── My Tasks
    └── Calendar
```

## Key Features

### 1. Role-Based Task Management
- **Admins/Managers**: Access to full task management suite with project creation, task assignment, and reporting
- **Employees**: Limited to viewing and managing only their assigned tasks

### 2. Employee Task Interface (`Frontend/app/user/tasks/page.tsx`)
- Shows only tasks assigned to the logged-in employee
- Task status updates (TODO → IN_PROGRESS → IN_REVIEW → COMPLETED)
- Time logging functionality
- Comment system
- Progress tracking
- Overdue task highlighting

### 3. Role-Based Service (`Frontend/app/services/roleBasedTaskService.ts`)
- Automatic filtering based on user role
- Access control for task operations
- Employee-specific endpoints
- Permission validation

### 4. Route Protection
- Automatic redirection based on user role
- Protected routes for admin/manager functions
- Employee-specific routes

## Navigation Behavior

### Top Navigation Dropdowns
Each top-level menu item (ATTENDANCE, LEAVE, PERFORMANCE, etc.) opens a dropdown with:
- Icon-based menu items
- Descriptive text for each option
- Role-based filtering
- Active state highlighting

### Sidebar Navigation
- Expandable/collapsible sections
- Badge notifications
- User profile section
- Quick access to common functions

### Employee-Specific Features
- **My Tasks**: Dedicated page showing only assigned tasks
- **Limited Navigation**: Reduced menu options appropriate for employee role
- **Task Actions**: Start, pause, review, and complete tasks
- **Time Tracking**: Log work hours on tasks
- **Comments**: Add updates and communicate with team

## Implementation Notes

### Authentication Flow
1. User logs in and role is stored in localStorage
2. Navigation components read user role and filter menu items
3. Route protection redirects unauthorized access
4. Task service automatically filters data based on role

### Data Filtering
- **Admins/Managers**: See all tasks and projects
- **Employees**: Only see assigned tasks and projects they're members of
- **API Endpoints**: Different endpoints for role-based data access

### Security Considerations
- Client-side role checking for UI display
- Server-side validation for data access
- Token-based authentication
- Role-based API endpoints

## Usage Examples

### For Employees
```typescript
// Employee sees only their assigned tasks
const tasks = await roleBasedTaskService.getTasks(); // Filtered automatically

// Employee can only update their own tasks
await roleBasedTaskService.updateTaskStatus(taskId, 'COMPLETED');
```

### For Admins/Managers
```typescript
// Admins see all tasks
const allTasks = await roleBasedTaskService.getTasks(); // All tasks

// Admins can create and manage all tasks
await taskManagementService.createTask(taskData);
```

## Future Enhancements

1. **Real-time Notifications**: WebSocket integration for live updates
2. **Advanced Filtering**: More granular task filtering options
3. **Mobile Responsiveness**: Optimized mobile navigation
4. **Customizable Dashboards**: Role-specific dashboard layouts
5. **Audit Logging**: Track user actions and navigation patterns

This navigation structure provides a comprehensive, role-based interface that scales from individual employees to system administrators while maintaining security and usability.