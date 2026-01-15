# Project, Task & Employee API Documentation

This document provides comprehensive information about the Project Management, Task Management, and Employee Management APIs with Swagger documentation.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Swagger UI Access](#swagger-ui-access)
3. [Projects API](#projects-api)
4. [Tasks API](#tasks-api)
5. [Employees API](#employees-api)
6. [Authentication](#authentication)

---

## Overview

All Project, Task, and Employee management endpoints are now fully documented with Swagger/OpenAPI specifications. These APIs provide complete CRUD operations and additional management features.

## Swagger UI Access

Access the interactive API documentation at:

```
http://localhost:5004/api-docs
```

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Schema definitions
- Authentication testing

---

## Projects API

### Base URL: `/api/projects`

### Endpoints

#### 1. Create Project
- **POST** `/api/projects`
- **Auth Required**: Yes
- **Description**: Create a new project
- **Request Body**:
```json
{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "startDate": "2026-01-15",
  "endDate": "2026-06-15",
  "status": "PLANNING",
  "priority": "HIGH"
}
```

#### 2. Get All Projects
- **GET** `/api/projects`
- **Auth Required**: Yes
- **Query Parameters**:
  - `status`: Filter by project status (PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED)
  - `priority`: Filter by priority (LOW, MEDIUM, HIGH, URGENT)

#### 3. Get Project by ID
- **GET** `/api/projects/:id`
- **Auth Required**: Yes
- **Description**: Get detailed information about a specific project

#### 4. Update Project
- **PUT** `/api/projects/:id`
- **Auth Required**: Yes
- **Description**: Update project details

#### 5. Delete Project
- **DELETE** `/api/projects/:id`
- **Auth Required**: Yes
- **Description**: Delete a project

#### 6. Get Project Members
- **GET** `/api/projects/:id/members`
- **Auth Required**: Yes
- **Description**: Get all members assigned to a project

---

## Tasks API

### Base URL: `/api/tasks`

### Endpoints

#### 1. Create Task
- **POST** `/api/tasks`
- **Auth Required**: Yes
- **Description**: Create a new task
- **Request Body**:
```json
{
  "title": "Design homepage mockup",
  "description": "Create wireframes and mockups for homepage",
  "projectId": "proj123",
  "assignedTo": "emp123",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-01-20"
}
```

#### 2. Get All Tasks
- **GET** `/api/tasks`
- **Auth Required**: Yes
- **Query Parameters**:
  - `projectId`: Filter by project ID
  - `status`: Filter by task status (TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, CANCELLED)
  - `priority`: Filter by priority (LOW, MEDIUM, HIGH, URGENT)
  - `assignedTo`: Filter by assigned employee ID

#### 3. Get My Tasks
- **GET** `/api/tasks/my-tasks`
- **Auth Required**: Yes
- **Description**: Get tasks assigned to the current user
- **Query Parameters**:
  - `status`: Filter by task status

#### 4. Get Task Statistics
- **GET** `/api/tasks/stats`
- **Auth Required**: Yes
- **Description**: Get task statistics (total, todo, in progress, completed)
- **Query Parameters**:
  - `projectId`: Filter stats by project ID

#### 5. Get Task by ID
- **GET** `/api/tasks/:id`
- **Auth Required**: Yes
- **Description**: Get detailed information about a specific task

#### 6. Update Task
- **PUT** `/api/tasks/:id`
- **Auth Required**: Yes
- **Description**: Update task details

#### 7. Delete Task
- **DELETE** `/api/tasks/:id`
- **Auth Required**: Yes
- **Description**: Delete a task

#### 8. Add Task Comment
- **POST** `/api/tasks/:id/comments`
- **Auth Required**: Yes
- **Description**: Add a comment to a task
- **Request Body**:
```json
{
  "comment": "This task is progressing well"
}
```

---

## Employees API

### Base URL: `/api/employees`

### Endpoints

#### 1. Create Employee (Admin/Super Admin Only)
- **POST** `/api/employees`
- **Auth Required**: Yes
- **Roles**: ADMIN, SUPER_ADMIN
- **Request Body**:
```json
{
  "email": "john.doe@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "departmentId": "dept123",
  "role": "EMPLOYEE",
  "designation": "Software Engineer",
  "joiningDate": "2026-01-15"
}
```

#### 2. Get All Employees
- **GET** `/api/employees`
- **Auth Required**: Yes
- **Roles**: ADMIN, MANAGER, SUPER_ADMIN
- **Query Parameters**:
  - `departmentId`: Filter by department ID
  - `role`: Filter by role (EMPLOYEE, MANAGER, ADMIN, SUPER_ADMIN)
  - `status`: Filter by status (ACTIVE, INACTIVE)

#### 3. Get All Users (Admin/Super Admin Only)
- **GET** `/api/employees/users/all`
- **Auth Required**: Yes
- **Roles**: ADMIN, SUPER_ADMIN
- **Description**: Get all users in the system

#### 4. Get Manager's Team Members (Manager Only)
- **GET** `/api/employees/team/members`
- **Auth Required**: Yes
- **Roles**: MANAGER
- **Description**: Get all team members assigned to the manager

#### 5. Get Unassigned Employees (Manager Only)
- **GET** `/api/employees/team/unassigned`
- **Auth Required**: Yes
- **Roles**: MANAGER
- **Description**: Get employees not assigned to any manager

#### 6. Assign Employee to Manager (Manager Only)
- **POST** `/api/employees/team/assign/:employeeId`
- **Auth Required**: Yes
- **Roles**: MANAGER
- **Description**: Assign an employee to the current manager

#### 7. Get Employee by ID
- **GET** `/api/employees/:employeeId`
- **Auth Required**: Yes
- **Description**: Get detailed information about a specific employee

#### 8. Get Employee Statistics
- **GET** `/api/employees/:employeeId/stats`
- **Auth Required**: Yes
- **Description**: Get employee statistics (tasks, attendance, etc.)

#### 9. Update Employee (Admin/Super Admin Only)
- **PUT** `/api/employees/:employeeId`
- **Auth Required**: Yes
- **Roles**: ADMIN, SUPER_ADMIN
- **Description**: Update employee details

#### 10. Delete Employee (Admin/Super Admin Only)
- **DELETE** `/api/employees/:employeeId`
- **Auth Required**: Yes
- **Roles**: ADMIN, SUPER_ADMIN
- **Description**: Delete an employee

---

## Authentication

All endpoints require authentication using Bearer tokens.

### How to Authenticate in Swagger:

1. Click the **"Authorize"** button at the top of Swagger UI
2. Enter your token in the format: `Bearer YOUR_TOKEN_HERE`
3. Click **"Authorize"**
4. Now you can test all authenticated endpoints

### Getting a Token:

Use the login endpoint to get your authentication token:

```bash
POST /api/users/login
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

---

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

---

## Project Status Values

- `PLANNING`: Project is in planning phase
- `IN_PROGRESS`: Project is actively being worked on
- `ON_HOLD`: Project is temporarily paused
- `COMPLETED`: Project is finished
- `CANCELLED`: Project has been cancelled

## Task Status Values

- `TODO`: Task is pending
- `IN_PROGRESS`: Task is being worked on
- `IN_REVIEW`: Task is under review
- `COMPLETED`: Task is finished
- `CANCELLED`: Task has been cancelled

## Priority Values

- `LOW`: Low priority
- `MEDIUM`: Medium priority
- `HIGH`: High priority
- `URGENT`: Urgent priority

## Employee Roles

- `EMPLOYEE`: Regular employee
- `MANAGER`: Team manager
- `ADMIN`: Administrator
- `SUPER_ADMIN`: Super administrator

---

## Testing with Swagger UI

1. Navigate to `http://localhost:5004/api-docs`
2. Click on any endpoint to expand it
3. Click **"Try it out"**
4. Fill in the required parameters
5. Click **"Execute"**
6. View the response

---

## Notes

- All dates should be in ISO 8601 format (YYYY-MM-DD)
- All endpoints return JSON responses
- Authentication token must be included in the Authorization header
- Role-based access control is enforced on specific endpoints

---

## Support

For issues or questions, please contact the development team.

**Backend Server**: http://localhost:5004
**Swagger Documentation**: http://localhost:5004/api-docs
