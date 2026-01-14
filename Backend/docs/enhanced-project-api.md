# Enhanced Dynamic Project Creation API

## Overview

This document describes the enhanced project creation module that provides fully dynamic project management with advanced authorization, team assignment, and validation capabilities.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Enhanced Project Creation                 │
├─────────────────────────────────────────────────────────────┤
│  Controller Layer                                           │
│  ├── Enhanced Project Controller                           │
│  ├── Request Validation                                     │
│  └── Response Formatting                                    │
├─────────────────────────────────────────────────────────────┤
│  Use Case Layer                                             │
│  ├── Enhanced Create Project Use Case                      │
│  ├── Authorization Check                                    │
│  ├── Business Rule Validation                              │
│  ├── Team Member Validation                                │
│  └── Transaction Management                                 │
├─────────────────────────────────────────────────────────────┤
│  Authorization Layer                                        │
│  ├── Permission Configuration                               │
│  ├── Authorization Utility                                  │
│  ├── Role-based Access Control                             │
│  └── Custom Condition Evaluation                           │
├─────────────────────────────────────────────────────────────┤
│  Database Layer (Prisma ORM)                               │
│  ├── Project Management                                     │
│  ├── Team Member Assignment                                 │
│  ├── Milestone Creation                                     │
│  └── Audit Logging                                         │
└─────────────────────────────────────────────────────────────┘
```

## Authorization Rules

### Project Creation Permissions

Users can create projects if they have:

1. **Role-based Access:**
   - `ADMIN` role
   - `MANAGER` role

2. **Designation-based Access:**
   - `MANAGER` designation
   - `TECH_LEAD` designation

3. **Custom Conditions:**
   - Must be an active user
   - Must have company access
   - Must have employee record

### Permission Configuration

```typescript
'project:create': {
  roles: [Role.ADMIN, Role.MANAGER],
  designations: [Designation.MANAGER, Designation.TECH_LEAD],
  customConditions: ['isActiveUser', 'hasCompanyAccess']
}
```

## API Endpoints

### 1. Create Enhanced Project

**Endpoint:** `POST /api/project-management/enhanced`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Advanced E-commerce Platform",
  "description": "A comprehensive e-commerce solution with microservices architecture",
  "code": "AECP2024",
  "companyId": 2,
  "departmentId": 2,
  "startDate": "2024-02-01T00:00:00.000Z",
  "endDate": "2024-08-31T23:59:59.000Z",
  "budget": 250000,
  "status": "PLANNING",
  "isPublic": false,
  "priority": "HIGH",
  "category": "Software Development",
  "tags": ["e-commerce", "microservices", "react", "nodejs"],
  "teamMembers": [
    {
      "employeeId": 3,
      "role": "MANAGER",
      "permissions": ["task:create", "task:assign"]
    },
    {
      "employeeId": 4,
      "role": "MEMBER",
      "permissions": ["task:update"]
    },
    {
      "employeeId": 5,
      "role": "VIEWER",
      "permissions": []
    }
  ],
  "milestones": [
    {
      "name": "Requirements Analysis Complete",
      "description": "All functional and non-functional requirements documented",
      "dueDate": "2024-03-15T00:00:00.000Z"
    },
    {
      "name": "MVP Development Complete",
      "description": "Minimum viable product ready for testing",
      "dueDate": "2024-06-30T00:00:00.000Z"
    },
    {
      "name": "Production Deployment",
      "description": "System deployed to production environment",
      "dueDate": "2024-08-15T00:00:00.000Z"
    }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully with enhanced features",
  "data": {
    "project": {
      "id": 15,
      "name": "Advanced E-commerce Platform",
      "description": "A comprehensive e-commerce solution with microservices architecture",
      "code": "AECP2024",
      "companyId": 2,
      "departmentId": 2,
      "ownerId": 2,
      "status": "PLANNING",
      "startDate": "2024-02-01T00:00:00.000Z",
      "endDate": "2024-08-31T23:59:59.000Z",
      "budget": "250000",
      "progressPercentage": 0,
      "isActive": true,
      "createdAt": "2024-01-13T10:30:00.000Z",
      "updatedAt": "2024-01-13T10:30:00.000Z",
      "owner": {
        "id": 2,
        "name": "John Manager",
        "employeeCode": "EMP002",
        "designation": "MANAGER"
      },
      "department": {
        "name": "IT Department",
        "type": "IT"
      },
      "company": {
        "name": "Tech Solutions Inc",
        "code": "TSI"
      }
    },
    "teamMembers": [
      {
        "id": 25,
        "projectId": 15,
        "employeeId": 2,
        "role": "OWNER",
        "isActive": true,
        "joinedAt": "2024-01-13T10:30:00.000Z",
        "employee": {
          "id": 2,
          "name": "John Manager",
          "employeeCode": "EMP002",
          "designation": "MANAGER"
        }
      },
      {
        "id": 26,
        "projectId": 15,
        "employeeId": 3,
        "role": "MANAGER",
        "isActive": true,
        "joinedAt": "2024-01-13T10:30:00.000Z",
        "employee": {
          "id": 3,
          "name": "Alice TechLead",
          "employeeCode": "EMP003",
          "designation": "TECH_LEAD"
        }
      },
      {
        "id": 27,
        "projectId": 15,
        "employeeId": 4,
        "role": "MEMBER",
        "isActive": true,
        "joinedAt": "2024-01-13T10:30:00.000Z",
        "employee": {
          "id": 4,
          "name": "Bob Developer",
          "employeeCode": "EMP004",
          "designation": "SENIOR_ENGINEER"
        }
      }
    ],
    "milestones": [
      {
        "id": 8,
        "name": "Requirements Analysis Complete",
        "description": "All functional and non-functional requirements documented",
        "projectId": 15,
        "dueDate": "2024-03-15T00:00:00.000Z",
        "completedAt": null,
        "isCompleted": false,
        "createdAt": "2024-01-13T10:30:00.000Z"
      },
      {
        "id": 9,
        "name": "MVP Development Complete",
        "description": "Minimum viable product ready for testing",
        "projectId": 15,
        "dueDate": "2024-06-30T00:00:00.000Z",
        "completedAt": null,
        "isCompleted": false,
        "createdAt": "2024-01-13T10:30:00.000Z"
      }
    ],
    "permissions": [
      "project:view",
      "project:update",
      "project:delete",
      "project:assign_members",
      "project:remove_members",
      "project:change_status",
      "project:manage_budget"
    ],
    "stats": {
      "totalTeamMembers": 3,
      "totalMilestones": 3,
      "createdAt": "2024-01-13T10:30:00.000Z"
    }
  },
  "meta": {
    "createdBy": {
      "id": 2,
      "employeeId": 2,
      "role": "MANAGER",
      "designation": "MANAGER"
    },
    "warnings": [
      "Project duration exceeds 6 months - consider breaking into phases"
    ],
    "version": "2.0",
    "enhanced": true
  }
}
```

**Error Response (400 - Validation Failed):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Project name must be at least 3 characters long",
    "End date must be after start date",
    "Employee with ID 999 not found or inactive"
  ],
  "warnings": [
    "Budget exceeds 10 million - requires additional approval"
  ],
  "validationFailed": true,
  "meta": {
    "requestedBy": 2,
    "timestamp": "2024-01-13T10:30:00.000Z"
  }
}
```

**Error Response (403 - Permission Denied):**
```json
{
  "success": false,
  "message": "Insufficient permissions to create projects",
  "errors": [
    "User does not have project creation permissions",
    "Current role: EMPLOYEE",
    "Current designation: SOFTWARE_ENGINEER",
    "Required: ADMIN/MANAGER role OR MANAGER/TECH_LEAD designation"
  ],
  "error": "PERMISSION_DENIED",
  "code": "PERM_001"
}
```

### 2. Get Available Team Members

**Endpoint:** `GET /api/project-management/team-members/available`

**Query Parameters:**
- `companyId` (optional): Filter by company
- `departmentId` (optional): Filter by department
- `role` (optional): Filter by role or designation
- `skills` (optional): Filter by skills
- `availability` (optional): Filter by availability status

**Example Request:**
```
GET /api/project-management/team-members/available?companyId=2&departmentId=2&role=TECH_LEAD
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "Alice TechLead",
      "employeeCode": "EMP003",
      "designation": "TECH_LEAD",
      "user": {
        "id": 3,
        "email": "alice@company.com",
        "role": "MANAGER",
        "isActive": true
      },
      "capabilities": {
        "canBeProjectManager": true,
        "canBeTeamLead": true,
        "recommendedRoles": ["MANAGER", "MEMBER"]
      },
      "availability": {
        "status": "available",
        "currentProjects": 2,
        "workload": "normal"
      }
    }
  ],
  "meta": {
    "total": 1,
    "filtered": 0,
    "filters": {
      "companyId": 2,
      "departmentId": 2,
      "role": "TECH_LEAD"
    }
  }
}
```

### 3. Check User Permissions

**Endpoint:** `GET /api/project-management/permissions/:projectId?`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "permissions": [
      "project:create",
      "project:view",
      "project:update",
      "project:assign_members"
    ],
    "userRole": "MANAGER",
    "userDesignation": "TECH_LEAD",
    "canCreateProject": true,
    "canUpdateProject": true,
    "canDeleteProject": false,
    "canManageTeam": true
  }
}
```

## Database Schema Updates

### Enhanced Project Table
```sql
-- Additional fields for enhanced project management
ALTER TABLE "Project" ADD COLUMN "isPublic" BOOLEAN DEFAULT false;
ALTER TABLE "Project" ADD COLUMN "priority" VARCHAR(20) DEFAULT 'MEDIUM';
ALTER TABLE "Project" ADD COLUMN "category" VARCHAR(100);
ALTER TABLE "Project" ADD COLUMN "tags" JSONB;
ALTER TABLE "Project" ADD COLUMN "metadata" JSONB;
```

### Project Member Permissions
```sql
-- Enhanced project member roles with custom permissions
ALTER TABLE "ProjectMember" ADD COLUMN "customPermissions" JSONB;
ALTER TABLE "ProjectMember" ADD COLUMN "accessLevel" VARCHAR(20) DEFAULT 'STANDARD';
```

## Validation Rules

### Project Creation Validation

1. **Required Fields:**
   - Project name (3-255 characters)
   - Company ID
   - Department ID

2. **Business Rules:**
   - Project name must be unique within company
   - Project code must be unique within company (if provided)
   - Creator must belong to the specified company
   - Department must belong to the specified company
   - End date must be after start date
   - Budget must be positive (if specified)

3. **Team Member Validation:**
   - All team members must be active employees
   - All team members must belong to the same company
   - No duplicate team member assignments
   - Only one project owner allowed
   - Manager role requires appropriate designation/role

4. **Milestone Validation:**
   - Milestone names are required
   - Milestone due dates cannot exceed project end date
   - Maximum 20 milestones per project

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Authentication required |
| PERM_001 | Permission denied |
| VAL_001 | Validation error |
| BUS_001 | Business rule violation |
| SRV_001 | Server error |

## Usage Examples

### Creating a Simple Project
```javascript
const projectData = {
  name: "Website Redesign",
  description: "Redesign company website with modern UI/UX",
  companyId: 2,
  departmentId: 2,
  startDate: "2024-02-01",
  endDate: "2024-04-30",
  budget: 50000
};

const response = await fetch('/api/project-management/enhanced', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(projectData)
});
```

### Creating a Project with Team and Milestones
```javascript
const complexProjectData = {
  name: "Mobile App Development",
  description: "Cross-platform mobile application",
  companyId: 2,
  departmentId: 2,
  startDate: "2024-03-01",
  endDate: "2024-09-30",
  budget: 150000,
  teamMembers: [
    { employeeId: 3, role: "MANAGER" },
    { employeeId: 4, role: "MEMBER" },
    { employeeId: 5, role: "MEMBER" }
  ],
  milestones: [
    {
      name: "UI/UX Design Complete",
      dueDate: "2024-04-15"
    },
    {
      name: "Backend API Complete",
      dueDate: "2024-06-30"
    },
    {
      name: "App Store Submission",
      dueDate: "2024-09-15"
    }
  ],
  tags: ["mobile", "react-native", "api"]
};
```

## Best Practices

1. **Authorization:**
   - Always check permissions before project operations
   - Use role-based and designation-based access control
   - Implement custom conditions for complex business rules

2. **Validation:**
   - Validate all input data comprehensively
   - Provide clear error messages
   - Use warnings for non-blocking issues

3. **Team Management:**
   - Validate team member availability
   - Check role compatibility
   - Ensure proper permission assignment

4. **Performance:**
   - Use database transactions for consistency
   - Implement proper indexing
   - Cache frequently accessed data

5. **Scalability:**
   - Design for horizontal scaling
   - Use configurable permission rules
   - Implement audit logging for compliance