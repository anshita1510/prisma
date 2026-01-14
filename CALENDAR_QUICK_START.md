# Calendar Add Event - Quick Start Guide 🚀

## What's New?

You can now **create custom events** on the calendar that will be visible to all users and send notifications!

## How to Use

### Method 1: Add Event Button
1. Click the **"+ Add Event"** button in the top-right corner
2. Fill in the event details
3. Select attendees (optional)
4. Click **"Create Event"**

### Method 2: Click on Calendar Day
1. Click on any **calendar day**
2. The date will be **pre-filled** in the form
3. Fill in remaining details
4. Click **"Create Event"**

## Event Types

Choose from 4 event types:

- 🔵 **Meeting** - Team meetings, client calls, standups
- 🔴 **Deadline** - Project deadlines, due dates
- 🟢 **Milestone** - Achievements, releases, launches
- 🟡 **Reminder** - Personal reminders, follow-ups

## Features

### ✅ What You Can Do:
- Create meetings, deadlines, milestones, and reminders
- Add event title and description
- Set date and time
- Add location (physical or virtual)
- Select multiple attendees
- Send email notifications to attendees
- View events on the calendar
- See upcoming events in the sidebar

### 📧 Notifications:
- Check **"Send notifications to all attendees"** to notify everyone
- Attendees receive email with event details
- Includes date, time, location, and description

### 📅 Calendar Display:
- Events appear on the calendar immediately
- Color-coded by event type
- Shows in "Upcoming Events" list
- Sorted chronologically

## Form Fields

### Required:
- ✅ Event Title
- ✅ Event Date
- ✅ Event Type

### Optional:
- Description
- Time (defaults to "All Day")
- Location
- Attendees
- Notifications

## Tips

💡 **Quick Event Creation**: Click directly on a calendar day to create an event for that date

💡 **Multiple Attendees**: Select as many attendees as needed - they'll all receive notifications

💡 **All Day Events**: Leave time blank for all-day events like holidays or deadlines

💡 **Location Flexibility**: Use "Virtual Meeting" or "Conference Room A" - any text works

## What Happens When You Create an Event?

1. ✅ Event is created
2. 📅 Appears on calendar immediately
3. 📋 Shows in upcoming events list
4. 📧 Notifications sent (if enabled)
5. 👥 All users can see the event

## Files Involved

- **Modal**: `Frontend/components/calendar/AddEventModal.tsx`
- **Calendar Page**: `Frontend/app/enhanced-tms/calendar/page.tsx`
- **Service**: `Frontend/app/services/calendarService.ts`

## Next Steps

The frontend is complete! To enable full functionality:

1. **Backend API**: Implement calendar event endpoints
2. **Database**: Add calendar_events table
3. **Email Service**: Configure notification emails
4. **Permissions**: Set up event access controls

## Support

Having issues? Check:
- Console logs for errors
- Network tab for API calls
- Form validation messages
- Browser console for debugging

---

**Ready to schedule your first event? Click "Add Event" and get started! 🎉**
