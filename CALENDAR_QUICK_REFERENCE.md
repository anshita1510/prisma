# Calendar - Quick Reference Guide 📅

## Installation (Required)

```bash
cd Frontend
npm install @radix-ui/react-alert-dialog
npm run dev
```

## Quick Actions

### Create Event
- Click **"+ Add Event"** button
- OR click any **calendar day**
- Fill form → Select attendees → Create

### View Event
- Click any **event** on calendar
- OR click event in **upcoming list**
- View full details

### Edit Event
- Click event → **"Edit Event"** button
- Modify fields → **"Update Event"**

### Delete Event
- Click event → **"Delete"** button
- Confirm → Event removed

## Event Types

| Type | Icon | Color | Use For |
|------|------|-------|---------|
| Meeting | 🔵 | Blue | Team meetings, calls |
| Deadline | 🔴 | Red | Due dates, cutoffs |
| Milestone | 🟢 | Green | Achievements, releases |
| Reminder | 🟡 | Yellow | Follow-ups, tasks |
| Festival | 🎉 | Purple | Cultural events |
| Holiday | 🏖️ | Orange | Public holidays |

## Key Features

✅ **91+ Festivals** - All major holidays pre-loaded
✅ **Company Members** - Real employee list (excludes SUPER_ADMIN)
✅ **Email Notifications** - Notify attendees automatically
✅ **Edit/Delete** - Full event management
✅ **Protected Events** - Festivals/holidays locked
✅ **Instant Updates** - Real-time calendar refresh

## Attendee Selection

- ✅ Shows all company members
- ✅ Excludes SUPER_ADMIN automatically
- ✅ Displays role badges
- ✅ Multi-select support
- ✅ Email addresses visible

## Permissions

| Action | Custom Events | System Events |
|--------|--------------|---------------|
| View | ✅ | ✅ |
| Create | ✅ | ❌ |
| Edit | ✅ | ❌ |
| Delete | ✅ | ❌ |

## Tips

💡 **Quick Create**: Click calendar day to pre-fill date
💡 **All Day Events**: Leave time blank
💡 **Multiple Attendees**: Select as many as needed
💡 **System Events**: Festivals/holidays are protected
💡 **Notifications**: Check box to email attendees

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Delete not working | Install @radix-ui/react-alert-dialog |
| No attendees | Check API endpoint & token |
| Can't edit festival | System events are protected |
| Events not saving | Backend API needed |

## Files

- **Calendar Page**: `Frontend/app/enhanced-tms/calendar/page.tsx`
- **Add/Edit Modal**: `Frontend/components/calendar/AddEventModal.tsx`
- **Details Modal**: `Frontend/components/calendar/EventDetailsModal.tsx`
- **API Service**: `Frontend/app/services/calendarService.ts`

## API Endpoints (Ready)

```typescript
POST   /api/calendar/events          // Create
GET    /api/calendar/events          // List
PUT    /api/calendar/events/:id      // Update
DELETE /api/calendar/events/:id      // Delete
POST   /api/calendar/events/:id/notify // Notify
GET    /api/employees/company/:id    // Members
```

## Quick Test

1. ✅ Click "Add Event"
2. ✅ Fill in "Team Meeting"
3. ✅ Select 2-3 attendees
4. ✅ Enable notifications
5. ✅ Create event
6. ✅ Click event to view
7. ✅ Edit event title
8. ✅ Delete event

## Support

📖 **Full Docs**: See `CALENDAR_COMPLETE_FEATURES_SUMMARY.md`
🚀 **Installation**: See `CALENDAR_INSTALLATION_GUIDE.md`
📝 **Details**: See `CALENDAR_EDIT_DELETE_IMPLEMENTATION.md`

---

**Ready to manage events! 🎉**
