# Enhanced Task Management System (TMS) - KEKA-like Implementation

A comprehensive, enterprise-grade Task Management System with advanced role-based access control, project-level permissions, calendar scheduling, task dependencies, and real-time notifications.

## 🚀 **Key Features**

### **Advanced Role-Based Access Control**
- **System Roles**: SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
- **Designations**: INTERN, SOFTWARE_ENGINEER, SENIOR_ENGINEER, TECH_LEAD, MANAGER, HR, DIRECTOR
- **Project-Level Roles**: OWNER, MANAGER, MEMBER, VIEWER
- **Business Visibility Rules**: HR and DIRECTOR have read-only access to all projects

### **Project Management**
- ✅ **Project Creation & Management** (ADMIN, TECH_LEAD, MANAGER only)
- ✅ **Project Status Tracking** (PLANNING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED)
- ✅ **Milestone Management** with progress tracking
- ✅ **Budget & Resource Management**
- ✅ **Project Templates** for standardization
- ✅ **Gantt Chart Data** for timeline visualization
- ✅ **Project Statistics & Analytics**

### **Task Management**
- ✅ **Advanced Task Creation** with dependencies
- ✅ **Task Hierarchy** (parent-child relationships)
- ✅ **Task Dependencies** (FINISH_TO_START, START_TO_START, etc.)
- ✅ **Priority Management** (LOW, MEDIUM, HIGH, URGENT)
- ✅ **Status Workflow** (TODO → IN_PROGRESS → IN_REVIEW → COMPLETED)
- ✅ **Time Tracking** with start/end times
- ✅ **Progress Percentage** tracking
- ✅ **Task Comments** for collaboration
- ✅ **File Attachments** support

### **Calendar & Scheduling**
- ✅ **Calendar Views** (DAY, WEEK, MONTH, GANTT)
- ✅ **Task Scheduling** with due dates
- ✅ **Calendar Events** integration
- ✅ **Recurring Events** support
- ✅ **Meeting Management** with attendees

### **Notification System**
- ✅ **Real-time Notifications** for task assignments
- ✅ **Deadline Reminders** (automated)
- ✅ **Status Change Notifications**
- ✅ **Dependency Blocking Alerts**
- ✅ **Project Updates** notifications
- ✅ **Bulk Notification Management**

### **Reporting & Analytics**
- ✅ **Project Reports** (weekly, monthly, milestone-based)
- ✅ **Task Reports** with progress tracking
- ✅ **Time Tracking Reports**
- ✅ **Performance Analytics**
- ✅ **Custom Report Generation**

## 🏗️ **Architecture Overview**

### **Database Schema**

#### **Enhanced Models**
```prisma
// Project with advanced features
model Project {
  id          Int     @id @default(autoincrement())
  name        String
  code        String? @unique
  status      ProjectStatus @default(PLANNING)
  startDate   DateTime?
  endDate     DateTime?
  budget      Decimal?
  actualCost  Decimal?
  progressPercentage Int @default(0)
  
  // Relations
  milestones   Milestone[]
  projectRoles ProjectMember[]
  reports      ProjectReport[]
}

// Task with dependencies and hierarchy
model Task {
  id          Int     @id @default(autoincrement())
  title       String
  code        String?
  
  // Hierarchy
  parentTaskId Int?
  parentTask   Task? @relation("TaskHierarchy")
  subTasks     Task[] @relation("TaskHierarchy")
  
  // Dependencies
  dependencies TaskDependency[] @relation("DependentTask")
  dependents   TaskDependency[] @relation("PredecessorTask")
  
  // Time tracking
  timeEntries TaskTimeEntry[]
  attachments TaskAttachment[]
  
  progressPercentage Int @default(0)
  completedAt DateTime?
}

// Project-level role management
model ProjectMember {
  projectId  Int
  employeeId Int
  role       ProjectRole @default(MEMBER)
  isActive   Boolean     @default(true)
}

// Task dependencies with types
model TaskDependency {
  predecessorTaskId Int
  dependentTaskId   Int
  type TaskDependencyType @default(FINISH_TO_START)
  lag  Int                @default(0)
}
```

### **API Architecture**

#### **Enhanced Endpoints**

**Projects API (`/api/v2/projects`)**
```
POST   /                    # Create project (ADMIN, TECH_LEAD, MANAGER)
GET    /                    # List projects (filtered by access)
GET    /:id                 # Get project details
PUT    /:id                 # Update project
DELETE /:id                 # Delete project (ADMIN only)
GET    /:id/stats           # Project statistics
GET    /:id/gantt           # Gantt chart data
POST   /milestones          # Create milestone
PUT    /milestones/:id      # Update milestone
```

**Tasks API (`/api/v2/tasks`)**
```
POST   /                    # Create task
GET    /                    # List tasks (filtered by access)
GET    /my-tasks            # Get user's assigned tasks
GET    /calendar            # Calendar view
GET    /stats               # Task statistics
PUT    /bulk-update         # Bulk task operations
POST   /dependencies        # Create task dependency
POST   /:id/time-entries    # Time tracking
POST   /:id/comments        # Add comments
```

**Notifications API (`/api/notifications`)**
```
GET    /                    # Get notifications
POST   /                    # Create notification
PUT    /mark-read           # Mark as read
GET    /unread-count        # Unread count
POST   /system/deadline-reminders  # System triggers
```

## 🔐 **Permission System**

### **Access Control Matrix**

| Role/Designation | Project Creation | All Projects View | Project Management | Task Assignment |
|------------------|------------------|-------------------|-------------------|-----------------|
| SUPER_ADMIN      | ✅ Full Access   | ✅ Full Access    | ✅ Full Access    | ✅ Full Access  |
| ADMIN            | ✅ Full Access   | ✅ Full Access    | ✅ Full Access    | ✅ Full Access  |
| TECH_LEAD        | ✅ Team Projects | ❌ Limited        | ✅ Own Projects   | ✅ Team Members |
| MANAGER          | ✅ Team Projects | ❌ Limited        | ✅ Own Projects   | ✅ Team Members |
| HR               | ❌ No            | ✅ Read-Only      | ❌ No             | ❌ No           |
| DIRECTOR         | ❌ No            | ✅ Read-Only      | ❌ No             | ❌ No           |
| EMPLOYEE         | ❌ No            | ❌ Assigned Only  | ❌ No             | ❌ No           |

### **Project-Level Permissions**

| Project Role | Create Tasks | Assign Tasks | View All Tasks | Manage Project | Delete Project |
|--------------|--------------|--------------|----------------|----------------|----------------|
| OWNER        | ✅           | ✅           | ✅             | ✅             | ✅             |
| MANAGER      | ✅           | ✅           | ✅             | ✅             | ❌             |
| MEMBER       | ✅           | ❌           | ✅             | ❌             | ❌             |
| VIEWER       | ❌           | ❌           | ✅             | ❌             | ❌             |

## 📅 **Calendar & Scheduling Features**

### **Calendar Views**
- **Day View**: Detailed daily task schedule
- **Week View**: Weekly task overview with deadlines
- **Month View**: Monthly project milestones
- **Gantt View**: Project timeline with dependencies

### **Scheduling Capabilities**
- Task due date management
- Milestone tracking
- Dependency-based scheduling
- Resource allocation
- Conflict detection

## 🔔 **Notification System**

### **Automated Notifications**
- **Task Assignment**: Notify assignee when task is assigned
- **Status Changes**: Notify stakeholders of task updates
- **Deadline Reminders**: 1-day and same-day alerts
- **Dependency Blocks**: Alert when tasks are blocked
- **Project Updates**: Notify team of project changes

### **Notification Types**
```typescript
enum NotificationType {
  TASK_ASSIGNED
  TASK_UPDATED
  TASK_OVERDUE
  PROJECT_CREATED
  PROJECT_UPDATED
  DEADLINE_REMINDER
  DEPENDENCY_BLOCKED
}
```

## 📊 **Reporting & Analytics**

### **Available Reports**
- **Project Progress Reports**: Timeline, budget, completion rates
- **Task Performance Reports**: Individual and team productivity
- **Time Tracking Reports**: Actual vs estimated hours
- **Resource Utilization Reports**: Team workload analysis
- **Milestone Achievement Reports**: Project milestone tracking

### **Analytics Dashboard**
- Real-time project statistics
- Task completion trends
- Team performance metrics
- Overdue task alerts
- Budget vs actual cost tracking

## 🚀 **Getting Started**

### **1. Database Setup**
```bash
# Run the enhanced migration
cd Backend
npx prisma migrate dev --name enhanced-tms-features
```

### **2. Server Configuration**
```bash
# Start the enhanced server
npm run dev
# Server runs on http://localhost:5004
```

### **3. API Usage Examples**

#### **Create a Project**
```bash
POST /api/v2/projects
{
  "name": "Mobile App Development",
  "description": "iOS and Android app development",
  "departmentId": 1,
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-06-15T00:00:00Z",
  "budget": 50000,
  "memberIds": [2, 3, 4],
  "memberRoles": [
    { "employeeId": 2, "role": "MANAGER" },
    { "employeeId": 3, "role": "MEMBER" },
    { "employeeId": 4, "role": "MEMBER" }
  ]
}
```

#### **Create a Task with Dependencies**
```bash
POST /api/v2/tasks
{
  "title": "Design User Interface",
  "description": "Create wireframes and mockups",
  "projectId": 1,
  "assignedToId": 3,
  "priority": "HIGH",
  "dueDate": "2024-02-01T00:00:00Z",
  "estimatedHours": 40,
  "dependencies": [
    {
      "predecessorTaskId": 1,
      "type": "FINISH_TO_START",
      "lag": 24
    }
  ]
}
```

#### **Get Calendar View**
```bash
GET /api/v2/tasks/calendar?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z&viewType=WEEK
```

## 🔧 **Advanced Features**

### **Task Dependencies**
- **FINISH_TO_START**: Task B starts after Task A finishes
- **START_TO_START**: Task B starts when Task A starts
- **FINISH_TO_FINISH**: Task B finishes when Task A finishes
- **START_TO_FINISH**: Task B finishes when Task A starts

### **Time Tracking**
- Start/stop time tracking
- Manual time entry
- Estimated vs actual hours
- Productivity analytics

### **Bulk Operations**
- Bulk task status updates
- Bulk task assignments
- Bulk deadline changes
- Bulk priority updates

### **Automation Rules**
- Automatic task assignment based on rules
- Status change triggers
- Deadline reminder automation
- Dependency-based notifications

## 🔮 **Future Enhancements**

### **Planned Features**
- **AI-Powered Scheduling**: Intelligent task scheduling
- **Advanced Gantt Charts**: Interactive timeline management
- **Resource Management**: Team capacity planning
- **Integration APIs**: Third-party tool integrations
- **Mobile App**: Native mobile applications
- **Advanced Reporting**: Custom report builder
- **Workflow Automation**: Advanced business rules

### **Scalability Considerations**
- Database indexing optimization
- Caching layer implementation
- Microservices architecture
- Real-time WebSocket notifications
- Performance monitoring

## 📝 **API Documentation**

### **Authentication**
All API endpoints require JWT authentication:
```
Authorization: Bearer <jwt_token>
```

### **Response Format**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { ... } // For list endpoints
}
```

### **Error Handling**
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

This enhanced TMS system provides a robust, scalable foundation for enterprise project and task management with comprehensive role-based access control, advanced scheduling capabilities, and real-time collaboration features.