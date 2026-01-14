# Dynamic Task Generation - Visual Guide

## 🎯 Complete Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    CREATE NEW TASK MODAL                     │
└─────────────────────────────────────────────────────────────┘

STEP 1: INPUT FORM
┌─────────────────────────────────────────────────────────────┐
│ 📋 Task Information                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Task Title *                                            │ │
│ │ [Implement user authentication                        ] │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Description                                             │ │
│ │ [Critical bug - users cannot login. Production issue.  ] │ │
│ │ [Urgent fix needed for security compliance.            ] │ │
│ │ [💡 Tip: Include keywords like 'urgent', 'bug fix'...  ] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ 📅 Timeline                                                  │
│ ┌──────────────────────┐  ┌──────────────────────┐         │
│ │ Start Date           │  │ Due Date *           │         │
│ │ [2026-01-15        ] │  │ [2026-01-14        ] │         │
│ └──────────────────────┘  └──────────────────────┘         │
│                                                              │
│ 👥 Assignment                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Assign To                                               │ │
│ │ [▼ Select team member                                 ] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Cancel]                          [Generate Preview] ▶      │
└─────────────────────────────────────────────────────────────┘

                            ↓ CLICK GENERATE PREVIEW ↓

STEP 2: ANALYSIS & GENERATION
┌─────────────────────────────────────────────────────────────┐
│ taskGenerationService.generateTask()                         │
│                                                              │
│ ✓ Analyzing keywords...                                      │
│   - Found: "critical", "bug", "urgent", "security"          │
│                                                              │
│ ✓ Calculating status...                                      │
│   - Due date: 2026-01-14                                     │
│   - Today: 2026-01-13                                        │
│   - Result: OVERDUE (due date passed)                        │
│                                                              │
│ ✓ Determining priority...                                    │
│   - Urgent keywords found: YES                               │
│   - Days until due: -1 (overdue)                             │
│   - Result: URGENT                                           │
│                                                              │
│ ✓ Generating tags...                                         │
│   - Matched: Authentication, Security, Backend              │
│   - Result: [Authentication, Security, Backend]             │
│                                                              │
│ ✓ Estimating hours...                                        │
│   - Complexity: Medium (bug fix)                             │
│   - Priority multiplier: 1.5 (URGENT)                        │
│   - Result: 6 hours                                          │
│                                                              │
│ ✓ Calculating urgency...                                     │
│   - Base score: 95 (URGENT)                                  │
│   - Overdue adjustment: +30                                  │
│   - Result: 100/100                                          │
│                                                              │
│ ✓ Task generated successfully!                               │
└─────────────────────────────────────────────────────────────┘

                            ↓ DISPLAY PREVIEW ↓

STEP 3: PREVIEW & REVIEW
┌─────────────────────────────────────────────────────────────┐
│ 📋 Review Generated Task                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Implement User Authentication                    [OVERDUE]  │
│ Critical bug - users cannot login. Production issue.         │
│ Urgent fix needed for security compliance.                   │
│                                                              │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│ │ Priority     │  │ Est. Hours   │  │ Days Due     │        │
│ │ [URGENT]     │  │ [6h]         │  │ [-1]         │        │
│ └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ Urgency Score: ████████████████████ 100/100         │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ 📅 Timeline                                                  │
│ Start Date: 2026-01-15                                       │
│ Due Date: 2026-01-14                                         │
│                                                              │
│ 🏷️ Auto-Generated Tags                                       │
│ [Authentication] [Security] [Backend]                        │
│                                                              │
│ 👤 Assigned To                                               │
│ [👤] John Doe - Senior Developer                             │
│                                                              │
│ 👤 Task Creator                                              │
│ [👤] Admin User - Project Manager                            │
│                                                              │
│ [Edit]                                    [Create Task] ▶    │
└─────────────────────────────────────────────────────────────┘

                    ↓ CLICK CREATE TASK ↓

STEP 4: TASK CREATED
┌─────────────────────────────────────────────────────────────┐
│ ✅ Task created successfully!                                │
│                                                              │
│ Task ID: 42                                                  │
│ Task Code: TSK001                                            │
│ Title: Implement User Authentication                         │
│ Status: OVERDUE                                              │
│ Priority: URGENT                                             │
│ Assigned To: John Doe                                        │
│ Estimated Hours: 6                                           │
│ Tags: [Authentication, Security, Backend]                    │
│                                                              │
│ Modal closes and task appears in project list                │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Decision Trees

### Status Determination
```
                    START
                      │
                      ▼
            Is due_date < today?
                   /        \
                 YES         NO
                  │           │
                  ▼           ▼
              OVERDUE    Is start_date <= today?
                         AND due_date >= today?
                              /        \
                            YES         NO
                             │           │
                             ▼           ▼
                        IN_PROGRESS    TODO
```

### Priority Calculation
```
                    START
                      │
                      ▼
        Check for URGENT keywords?
        (urgent, critical, asap, emergency, blocker)
                   /        \
                 YES         NO
                  │           │
                  ▼           ▼
              URGENT    Check for HIGH keywords?
                        (important, deadline, release, security)
                              /        \
                            YES         NO
                             │           │
                             ▼           ▼
                           HIGH    Check timeline
                                   /    |    \
                            ≤1d  ≤3d  ≤7d  >14d
                             │    │    │     │
                             ▼    ▼    ▼     ▼
                           HIGH  MED  MED   LOW
```

### Tag Generation
```
                    START
                      │
                      ▼
            Scan description for keywords
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    UI/UX?       Backend?      API?
      │             │            │
    YES/NO        YES/NO       YES/NO
      │             │            │
      ▼             ▼            ▼
    [Add]        [Add]        [Add]
      │             │            │
      └─────────────┼─────────────┘
                    │
                    ▼
        Continue for all 12 categories
                    │
                    ▼
        Remove duplicates & limit to 5
                    │
                    ▼
                 RETURN TAGS
```

## 📊 Priority Matrix

```
                    TIMELINE
        ┌─────────────────────────────────┐
        │ >14d  │ 7-14d │ 3-7d │ 1-3d │ ≤1d │
    ┌───┼───────┼───────┼──────┼──────┼─────┤
    │ U │ URGENT│URGENT │URGENT│URGENT│URGENT
    │ R │       │       │      │      │     │
    │ G ├───────┼───────┼──────┼──────┼─────┤
    │ E │ HIGH  │ HIGH  │ HIGH │ HIGH │ HIGH│
    │ N ├───────┼───────┼──────┼──────┼─────┤
    │ C │ MED   │ MED   │ MED  │ HIGH │ HIGH│
    │ Y ├───────┼───────┼──────┼──────┼─────┤
    │   │ LOW   │ MED   │ MED  │ MED  │ HIGH│
    │   ├───────┼───────┼──────┼──────┼─────┤
    │   │ LOW   │ LOW   │ LOW  │ MED  │ MED │
    └───┴───────┴───────┴──────┴──────┴─────┘
    K
    E
    Y
    W
    O
    R
    D
    S
```

## 🎨 Color Coding

### Status Colors
```
┌─────────────┬──────────────────┐
│ TODO        │ ⬜ Gray           │
│ IN_PROGRESS │ 🔵 Blue           │
│ OVERDUE     │ 🔴 Red            │
│ COMPLETED   │ 🟢 Green          │
│ CANCELLED   │ ⬜ Gray           │
└─────────────┴──────────────────┘
```

### Priority Colors
```
┌─────────────┬──────────────────┐
│ LOW         │ 🟢 Green          │
│ MEDIUM      │ 🟡 Yellow         │
│ HIGH        │ 🟠 Orange         │
│ URGENT      │ 🔴 Red            │
└─────────────┴──────────────────┘
```

### Section Colors
```
┌─────────────────────┬──────────────────┐
│ Task Information    │ 🔵 Blue           │
│ Timeline            │ 🟢 Green          │
│ Assignment          │ 🟣 Indigo         │
│ Priority & Status   │ 🟣 Purple         │
│ Tags                │ 🟣 Indigo         │
│ Creator             │ 🟠 Orange         │
└─────────────────────┴──────────────────┘
```

## 📈 Urgency Score Scale

```
0 ─────────────────────────────────────── 100
│                                          │
LOW                                    URGENT
│                                          │
20                50                   95  100
│                 │                    │   │
└─────────────────┴────────────────────┴───┘
  LOW          MEDIUM        HIGH      URGENT
```

## 🔑 Keyword Examples

### Urgent Keywords
```
🔴 URGENT KEYWORDS
├─ urgent
├─ critical
├─ asap
├─ immediately
├─ emergency
├─ blocker
├─ critical bug
└─ production issue
```

### High Priority Keywords
```
🟠 HIGH PRIORITY KEYWORDS
├─ important
├─ high priority
├─ deadline
├─ release
├─ launch
├─ security
├─ bug fix
└─ hotfix
```

### Low Priority Keywords
```
🟢 LOW PRIORITY KEYWORDS
├─ nice to have
├─ optional
├─ enhancement
├─ improvement
├─ refactor
├─ cleanup
└─ documentation
```

### Complexity Keywords
```
🔷 COMPLEX KEYWORDS
├─ complex
├─ complicated
├─ difficult
├─ refactor
├─ rewrite
├─ redesign
└─ migration

🔹 SIMPLE KEYWORDS
├─ simple
├─ easy
├─ quick
├─ minor
├─ small
├─ typo
└─ fix
```

## 📋 Tag Categories

```
┌─────────────────────────────────────────┐
│ 12+ AUTO-GENERATED TAG CATEGORIES       │
├─────────────────────────────────────────┤
│ 🎨 UI/UX                                │
│ 🔧 Backend                              │
│ 🌐 API                                  │
│ 💾 Database                             │
│ 🔐 Authentication                       │
│ ⚡ Performance                           │
│ 🧪 Testing                              │
│ 📚 Documentation                        │
│ 🚀 DevOps                               │
│ 📱 Mobile                               │
│ 🛡️ Security                             │
│ 📊 Analytics                            │
└─────────────────────────────────────────┘
```

## 🎯 Example Scenarios

### Scenario 1: Critical Bug
```
INPUT:
┌─────────────────────────────────────┐
│ Title: Fix login button             │
│ Description: Critical bug - login   │
│ button not responding on mobile.    │
│ Urgent fix needed for production    │
│ Due Date: Tomorrow                  │
└─────────────────────────────────────┘

GENERATED:
┌─────────────────────────────────────┐
│ Status: HIGH (due tomorrow)         │
│ Priority: URGENT (critical keyword) │
│ Tags: [UI/UX, Mobile, Security]     │
│ Hours: 6 (2 × 1.5 for urgent)       │
│ Urgency: 95/100                     │
└─────────────────────────────────────┘
```

### Scenario 2: Feature Development
```
INPUT:
┌─────────────────────────────────────┐
│ Title: Implement dashboard          │
│ Description: Create responsive      │
│ dashboard with charts and analytics │
│ Include database optimization       │
│ Start Date: Today                   │
│ Due Date: 2 weeks                   │
└─────────────────────────────────────┘

GENERATED:
┌─────────────────────────────────────┐
│ Status: IN_PROGRESS (started today) │
│ Priority: MEDIUM (14 days timeline) │
│ Tags: [UI/UX, Backend, Database,    │
│        Performance, Analytics]      │
│ Hours: 16 (complex keywords)        │
│ Urgency: 50/100                     │
└─────────────────────────────────────┘
```

### Scenario 3: Documentation
```
INPUT:
┌─────────────────────────────────────┐
│ Title: API documentation            │
│ Description: Nice to have -         │
│ document REST API endpoints         │
│ Due Date: 3 weeks                   │
└─────────────────────────────────────┘

GENERATED:
┌─────────────────────────────────────┐
│ Status: TODO (future date)          │
│ Priority: LOW (nice to have, 21d)   │
│ Tags: [Documentation, API]          │
│ Hours: 3 (simple task)              │
│ Urgency: 20/100                     │
└─────────────────────────────────────┘
```

## 🚀 Quick Reference

```
QUICK REFERENCE CARD
═══════════════════════════════════════════

1. FILL FORM
   ✓ Title (required)
   ✓ Description (use keywords!)
   ✓ Due Date (required)
   ○ Start Date (optional)
   ○ Assign To (optional)

2. GENERATE PREVIEW
   ✓ Click "Generate Preview"
   ✓ System analyzes input
   ✓ Shows all auto-generated fields

3. REVIEW
   ✓ Check status, priority, tags
   ✓ Review estimated hours
   ✓ Check urgency score

4. CREATE
   ✓ Click "Create Task"
   ✓ Task created with all details
   ✓ Appears in project

KEYWORDS TO USE:
• Urgent: urgent, critical, asap, emergency
• High: important, deadline, release, security
• Low: nice to have, optional, enhancement
• Complex: complex, refactor, rewrite
• Simple: simple, easy, quick, minor
• Categories: ui, backend, api, database, auth, performance

═══════════════════════════════════════════
```

---

**Visual Guide Complete** ✅
