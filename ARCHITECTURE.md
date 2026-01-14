# 🏗️ System Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Data Flow](#data-flow)
4. [Security Architecture](#security-architecture)
5. [Scalability](#scalability)

## Overview

This document provides detailed architectural information about the Enterprise HR Management System.

## Architecture Patterns

### 1. Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                             │
│                      (Frontend - Next.js)                        │
│  • User Interface                                                │
│  • Client-side validation                                        │
│  • State management                                              │
│  • API consumption                                               │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ REST API (HTTPS)
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    APPLICATION TIER                              │
│                    (Backend - Express.js)                        │
│  • Business logic                                                │
│  • Authentication & Authorization                                │
│  • Data validation                                               │
│  • API endpoints                                                 │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ SQL Queries (Prisma ORM)
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                       DATA TIER                                  │
│                    (PostgreSQL Database)                         │
│  • Data persistence                                              │
│  • Data integrity                                                │
│  • Transactions                                                  │
│  • Relationships                                                 │
└──────────────────────────────────────────────────────────────────┘
```

### 2. MVC Pattern (Backend)

```
Request → Router → Controller → Service → Prisma → Database
                      ↓
                  Response
```

### 3. Component-Based Architecture (Frontend)

```
Pages → Layouts → Components → UI Components
  ↓
Services → API Calls → Backend
```

## Data Flow

### Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Login Request (email, password)
     ▼
┌─────────────────┐
│   Frontend      │
│  (Login Page)   │
└────┬────────────┘
     │ 2. POST /api/auth/login
     ▼
┌─────────────────┐
│   Backend       │
│ Auth Controller │
└────┬────────────┘
     │ 3. Validate credentials
     ▼
┌─────────────────┐
│  Auth Service   │
│  • Hash check   │
│  • Generate JWT │
└────┬────────────┘
     │ 4. Query user
     ▼
┌─────────────────┐
│   Database      │
│  (User table)   │
└────┬────────────┘
     │ 5. Return user data
     ▼
┌─────────────────┐
│  Auth Service   │
│  • Create token │
└────┬────────────┘
     │ 6. Return token + user
     ▼
┌─────────────────┐
│   Frontend      │
│  • Store token  │
│  • Redirect     │
└────┬────────────┘
     │ 7. Access dashboard
     ▼
┌──────────┐
│Dashboard │
└──────────┘
```

### Attendance Check-in Flow

```
Employee → Click "Check In" → Frontend validates
                                    ↓
                            POST /api/attendance/check-in
                                    ↓
                            Backend validates JWT
                                    ↓
                            Extract employeeId from token
                                    ↓
                            Check existing attendance
                                    ↓
                            Create/Update attendance record
                                    ↓
                            Calculate work hours
                                    ↓
                            Return attendance data
                                    ↓
                            Frontend updates UI
```

### Leave Approval Workflow

```
Employee applies leave
        ↓
Manager receives notification
        ↓
Manager reviews and approves (Level 1)
        ↓
HR receives notification
        ↓
HR reviews and approves (Level 2)
        ↓
Employee receives approval notification
        ↓
Leave status updated to APPROVED
```

## Security Architecture

### 1. Authentication Security

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYERS                         │
│                                                                  │
│  1. Password Hashing (Bcrypt)                                   │
│     • Salt rounds: 10                                           │
│     • One-way encryption                                        │
│                                                                  │
│  2. JWT Token                                                   │
│     • Signed with secret key                                    │
│     • Expiry: 7 days                                            │
│     • Payload: userId, role, employeeId                         │
│                                                                  │
│  3. Token Validation Middleware                                 │
│     • Verify signature                                          │
│     • Check expiry                                              │
│     • Validate user exists                                      │
│                                                                  │
│  4. Role-Based Access Control (RBAC)                            │
│     • Check user role                                           │
│     • Verify permissions                                        │
│     • Enforce access rules                                      │
└──────────────────────────────────────────────────────────────────┘
```

### 2. API Security

- **HTTPS Only**: All production traffic encrypted
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: Input sanitization

### 3. Data Security

- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: TLS/SSL
- **Sensitive Data**: Passwords hashed, tokens encrypted
- **Audit Logging**: All critical actions logged
- **Data Backup**: Regular automated backups

## Scalability

### Horizontal Scaling

```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Frontend 1       Frontend 2      Frontend 3
        │                │                │
        └────────────────┼────────────────┘
                         │
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Backend 1        Backend 2       Backend 3
        │                │                │
        └────────────────┼────────────────┘
                         │
                  Database Cluster
                (Primary + Replicas)
```

### Caching Strategy

```
Request → Cache Check → Cache Hit? → Return cached data
                │
                │ Cache Miss
                ▼
          Database Query → Store in cache → Return data
```

### Database Optimization

- **Indexing**: Key columns indexed
- **Connection Pooling**: Prisma connection pool
- **Query Optimization**: Efficient queries with Prisma
- **Read Replicas**: For read-heavy operations
- **Partitioning**: Large tables partitioned by date

---

**Last Updated**: January 15, 2026
