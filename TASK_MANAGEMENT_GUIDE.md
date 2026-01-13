# Project & Task Management System

A comprehensive project and task management system built with Node.js, Express, Prisma, PostgreSQL, and Next.js.

## Features

### For Users (Employees)
- **Dashboard**: Overview of assigned tasks, project statistics, and quick actions
- **My Tasks**: View and manage tasks assigned to you
- **Projects**: View projects you're part of or own
- **Task Management**: Create, update, and track task progress
- **Weekly Updates**: Update task status and progress weekly

### For Managers
- **Full Project Access**: View, edit, and manage all projects in the company
- **Team Task Overview**: Monitor all tasks across projects and team members
- **Project Creation**: Create new projects and assign team members
- **Task Assignment**: Assign tasks to team members
- **Progress Tracking**: Monitor project and task completion rates

## Database Schema

### New Models Added

#### Task
- `id`: Unique identifier
- `title`: Task title
- `description`: Optional task description
- `projectId`: Reference to project
- `assignedToId`: Reference to assigned employee (optional)
- `createdById`: Reference to task creator
- `status`: TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, CANCELLED
- `priority`: LOW, MEDIUM, HIGH, URGENT
- `dueDate`: Optional due date
- `startDate`: Optional start date
- `estimatedHours`: Estimated time to complete
- `actualHours`: Actual time spent
- `isActive`: Soft delete flag

#### TaskComment
- `id`: Unique identifier
- `content`: Comment text
- `taskId`: Reference to task
- `authorId`: Reference to comment author
- `createdAt`: Creation timestamp

### Enhanced Models

#### Project
- Added `tasks` relation to Task model
- Maintains existing functionality with user access control

#### Employee
- Added relations for task assignment and creation
- Added relation for task comments

## API Endpoints

### Projects (`/api/projects`)
- `GET /` - List projects (filtered by user access)
- `POST /` - Create new project
- `GET /:id` - Get project details with tasks
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `GET /:id/members` - Get project members

### Tasks (`/api/tasks`)
- `GET /` - List tasks (filtered by user access)
- `POST /` - Create new task
- `GET /my-tasks` - Get tasks assigned to current user
- `GET /stats` - Get task statistics
- `GET /:id` - Get task details with comments
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task
- `POST /:id/comments` - Add comment to task

## Access Control

### User Permissions
- **Employees**: Can only see projects they're members of or own
- **Employees**: Can only see tasks from accessible projects
- **Employees**: Can update tasks assigned to them or created by them
- **Managers/Admins**: Can see and manage all projects and tasks

### Task Management Rules
- Only project members can be assigned tasks
- Task creators and assignees can update task status
- Project owners and managers can assign/reassign tasks
- Comments can be added by anyone with project access

## Frontend Components

### Pages
- `/user/dashboard` - Main dashboard with overview
- `/user/projects` - Project listing and management
- `/user/tasks` - Task listing and management

### Components
- `ProjectCard` - Display project information
- `TaskCard` - Display task information with status updates
- `CreateProjectModal` - Form to create new projects
- `CreateTaskModal` - Form to create new tasks

## Getting Started

### Backend Setup
1. Database migration already applied with task management tables
2. Server running on port 5004
3. New API routes registered and functional

### Frontend Setup
1. Install dependencies: `npm install`
2. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5004/api
   ```
3. Start development server: `npm run dev`

## Usage Examples

### Creating a Project
1. Navigate to Projects page
2. Click "New Project" button
3. Fill in project details and select team members
4. Submit to create project

### Managing Tasks
1. Navigate to Tasks page or specific project
2. Click "New Task" to create tasks
3. Assign to team members and set priorities
4. Update status as work progresses
5. Add comments for collaboration

### Weekly Updates
- Users can filter tasks by status and update progress
- Managers can view team progress and reassign tasks
- Dashboard provides quick overview of overdue and due-today tasks

## Technical Implementation

### Backend Architecture
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data validation
- **Repositories**: Database operations and queries
- **DTOs**: Data validation with Zod schemas
- **Middleware**: Authentication and authorization

### Frontend Architecture
- **Services**: API communication layer
- **Components**: Reusable UI components
- **Pages**: Route-based page components
- **Types**: TypeScript interfaces for type safety

## Security Features
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention with Prisma
- CORS configuration for frontend integration

This system provides a complete project and task management solution with proper access control, real-time updates, and comprehensive tracking capabilities.