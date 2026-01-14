-- Check all users and their designations
SELECT 
  u.id as user_id,
  u.email,
  u.role,
  e.id as employee_id,
  e.name as employee_name,
  e.designation,
  e."employeeCode"
FROM "User" u
JOIN "Employee" e ON e."userId" = u.id
ORDER BY e.designation, e.id;

-- Check all pending leaves
SELECT 
  l.id as leave_id,
  l.type,
  l.status,
  l."startDate",
  l."endDate",
  l."employeeId",
  e.name as employee_name,
  e.designation as employee_designation,
  e."employeeCode"
FROM "Leave" l
JOIN "Employee" e ON l."employeeId" = e.id
WHERE l.status = 'PENDING'
ORDER BY l."createdAt" DESC;

-- Check which employee ID you're logged in as
-- (Run this after you know your email)
-- SELECT e.id, e.name, e.designation 
-- FROM "Employee" e 
-- JOIN "User" u ON e."userId" = u.id 
-- WHERE u.email = 'YOUR_EMAIL_HERE';
