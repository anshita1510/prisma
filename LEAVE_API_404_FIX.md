# Leave API 404 Error - FIXED ✅

## Problem

The frontend was getting a 404 error when calling the leave API:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
5004/api/leave:1
```

## Root Cause

**Mismatch between frontend and backend API endpoints:**

- **Backend route:** `/api/leaves` (plural)
- **Frontend calls:** `/api/leave` (singular)

## Solution

Updated all frontend API calls to use `/api/leaves` (plural) to match the backend route registration.

## Changes Made

### File: `Frontend/app/services/leave.service.ts`

Changed all API endpoints from `/api/leave` to `/api/leaves`:

**Before:**
```typescript
fetch(`${this.baseUrl}/api/leave`)
fetch(`${this.baseUrl}/api/leave/my-leaves`)
fetch(`${this.baseUrl}/api/leave/${id}`)
fetch(`${this.baseUrl}/api/leave/${id}/status`)
fetch(`${this.baseUrl}/api/leave/statistics`)
fetch(`${this.baseUrl}/api/leave/notifications`)
```

**After:**
```typescript
fetch(`${this.baseUrl}/api/leaves`)
fetch(`${this.baseUrl}/api/leaves/my-leaves`)
fetch(`${this.baseUrl}/api/leaves/${id}`)
fetch(`${this.baseUrl}/api/leaves/${id}/status`)
fetch(`${this.baseUrl}/api/leaves/statistics`)
fetch(`${this.baseUrl}/api/leaves/notifications`)
```

## Backend Route Registration

In `Backend/src/server.ts`:
```typescript
app.use('/api/leaves', leaveRoutes);  // ✅ Correct - plural
```

## All Affected Endpoints

1. ✅ `POST /api/leaves` - Apply for leave
2. ✅ `GET /api/leaves/my-leaves` - Get user's leaves
3. ✅ `GET /api/leaves` - Get all leaves
4. ✅ `GET /api/leaves/approvable` - Get approvable leaves
5. ✅ `GET /api/leaves/:id` - Get leave by ID
6. ✅ `PATCH /api/leaves/:id/status` - Update leave status
7. ✅ `DELETE /api/leaves/:id` - Delete leave
8. ✅ `GET /api/leaves/statistics` - Get leave statistics
9. ✅ `GET /api/leaves/notifications` - Get notifications
10. ✅ `POST /api/leaves/notifications/mark-read` - Mark as read
11. ✅ `GET /api/leaves/:id/can-approve` - Check approval permission

## Testing

After this fix, all API calls should work correctly:

```bash
# Test the endpoint
curl http://localhost:5004/api/leaves \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Status

✅ **FIXED** - All API endpoints now use the correct `/api/leaves` path

The 404 error should be resolved and the Leave Management system should now load data correctly.
