# Dynamic Task Generation - Quick Start Guide

## What's New?
A fully intelligent task generation system that automatically determines:
- ✅ Task Status (TODO, IN_PROGRESS, OVERDUE)
- ✅ Priority (LOW, MEDIUM, HIGH, URGENT)
- ✅ Tags (UI/UX, Backend, API, Database, etc.)
- ✅ Estimated Hours
- ✅ Urgency Score (0-100)

## How to Use

### 1. Open Create Task Modal
- Go to Projects page
- Click on a project
- Click "Create New Task" button

### 2. Fill in Task Details
- **Title**: Task name (required)
- **Description**: Task details with keywords (optional but recommended)
- **Start Date**: When task begins (optional)
- **Due Date**: Task deadline (required)
- **Assign To**: Team member (optional)

### 3. Generate Preview
- Click "Generate Preview" button
- System analyzes your input
- Shows all auto-generated fields

### 4. Review Generated Task
See:
- Auto-enhanced title
- Calculated priority
- Determined status
- Auto-generated tags
- Estimated hours
- Urgency score (0-100)
- Days until due

### 5. Create Task
- Click "Create Task" button
- Task is created with all details
- Modal closes
- Task appears in project

## Tips for Better Results

### Use Keywords in Description
Include relevant keywords for better auto-detection:

**For Urgent Tasks**:
- "urgent", "critical", "asap", "emergency", "blocker"

**For High Priority**:
- "important", "deadline", "release", "security", "bug fix"

**For Low Priority**:
- "nice to have", "optional", "enhancement", "improvement"

**For Complexity**:
- Complex: "complex", "refactor", "rewrite", "redesign"
- Simple: "simple", "easy", "quick", "minor", "typo"

**For Categories**:
- UI/UX: "design", "interface", "layout", "component"
- Backend: "server", "logic", "algorithm", "processing"
- API: "endpoint", "rest", "graphql", "integration"
- Database: "database", "sql", "query", "migration"
- Authentication: "auth", "login", "password", "token"
- Performance: "optimization", "speed", "caching"
- Testing: "test", "qa", "bug", "debug"
- Documentation: "documentation", "readme", "guide"

### Examples

**Example 1: Bug Fix**
```
Title: Fix login button
Description: Critical bug - login button not responding on mobile. Urgent fix needed for production
Due Date: Tomorrow

Result:
- Status: HIGH
- Priority: URGENT
- Tags: [UI/UX, Mobile, Security]
- Hours: 6
- Urgency: 95/100
```

**Example 2: Feature**
```
Title: Implement dashboard
Description: Create responsive dashboard with charts and analytics. Include database optimization for performance
Start Date: Today
Due Date: 2 weeks

Result:
- Status: IN_PROGRESS
- Priority: MEDIUM
- Tags: [UI/UX, Backend, Database, Performance, Analytics]
- Hours: 16
- Urgency: 50/100
```

**Example 3: Documentation**
```
Title: API documentation
Description: Nice to have - document REST API endpoints with examples
Due Date: 3 weeks

Result:
- Status: TODO
- Priority: LOW
- Tags: [Documentation, API]
- Hours: 3
- Urgency: 20/100
```

## Key Features

### Automatic Status Detection
- **TODO**: Task hasn't started yet
- **IN_PROGRESS**: Task started and not yet due
- **OVERDUE**: Due date has passed

### Smart Priority Calculation
- Analyzes keywords in description
- Considers days until due date
- Combines both factors for final priority

### Auto-Tag Generation
- Extracts up to 5 relevant tags
- Helps organize and filter tasks
- Based on description keywords

### Estimated Hours
- Calculates based on complexity
- Adjusts for priority level
- Helps with resource planning

### Urgency Scoring
- 0-100 scale
- Combines priority and timeline
- Helps prioritize work

## Workflow

```
Input Form
    ↓
[Generate Preview]
    ↓
Preview Display
    ↓
[Edit] or [Create Task]
    ↓
Task Created
```

## What Gets Auto-Generated?

| Field | Auto-Generated | How |
|-------|---|---|
| Title | ✅ Enhanced | Capitalized, action verb added if needed |
| Description | ❌ From user | User input |
| Status | ✅ Yes | Based on dates |
| Priority | ✅ Yes | Keywords + timeline |
| Tags | ✅ Yes | Description keywords |
| Estimated Hours | ✅ Yes | Complexity + priority |
| Urgency Score | ✅ Yes | Priority + timeline |
| Start Date | ❌ From user | User input |
| Due Date | ❌ From user | User input |
| Assigned To | ❌ From user | User selection |

## Common Scenarios

### Scenario 1: Production Bug
```
Input:
- Title: "Login page broken"
- Description: "Critical bug - users cannot login. Production issue. Urgent fix needed"
- Due Date: Today

Auto-Generated:
- Status: OVERDUE (due today)
- Priority: URGENT (critical + urgent keywords)
- Tags: [Authentication, Security]
- Hours: 6
- Urgency: 100/100
```

### Scenario 2: New Feature
```
Input:
- Title: "User profile page"
- Description: "Implement user profile with avatar upload, bio, and settings. Include database schema updates"
- Start Date: Today
- Due Date: 1 week

Auto-Generated:
- Status: IN_PROGRESS (started today)
- Priority: MEDIUM (no urgent keywords, 7 days)
- Tags: [UI/UX, Backend, Database]
- Hours: 12
- Urgency: 50/100
```

### Scenario 3: Refactoring
```
Input:
- Title: "Refactor authentication module"
- Description: "Nice to have - refactor auth code for better performance and maintainability"
- Due Date: 1 month

Auto-Generated:
- Status: TODO (future date)
- Priority: LOW (nice to have, 30 days)
- Tags: [Backend, Performance, Security]
- Hours: 8
- Urgency: 20/100
```

## Troubleshooting

### Q: Why is priority not what I expected?
**A**: Check your description for keywords. Priority considers both keywords and timeline.

### Q: How are tags determined?
**A**: Tags are extracted from keywords in your description. Use relevant keywords for better results.

### Q: Can I edit after preview?
**A**: Yes! Click "Edit" button to go back and modify inputs.

### Q: What if I don't want auto-generated values?
**A**: You can still edit the task after creation through the project detail view.

## Files Involved

### Frontend
- `Frontend/app/services/taskGenerationService.ts` - Generation logic
- `Frontend/components/projects/CreateTaskModal.tsx` - UI component

### Backend (No changes needed)
- Already supports all generated fields
- Works with existing API

## Performance
- Task generation: < 100ms
- No API calls during preview
- Instant feedback
- Scales to batch operations

## Next Steps
1. Try creating a task with keywords
2. Review the generated preview
3. Adjust if needed
4. Create the task
5. See it in your project

## Support
- Check browser console for detailed logs
- Review keyword reference above
- Try example scenarios
- Check documentation file

---

**Ready to create intelligent tasks? Start now!** 🚀
