# Calendar Features - Installation Guide

## Required Package Installation

To use the delete confirmation dialog, you need to install the Radix UI Alert Dialog package:

```bash
cd Frontend
npm install @radix-ui/react-alert-dialog
```

Or if using yarn:

```bash
cd Frontend
yarn add @radix-ui/react-alert-dialog
```

Or if using pnpm:

```bash
cd Frontend
pnpm add @radix-ui/react-alert-dialog
```

## Verification

After installation, restart your development server:

```bash
npm run dev
```

## All Features Should Now Work:

✅ Add Event
✅ Edit Event  
✅ Delete Event (with confirmation dialog)
✅ View Event Details
✅ Company Members Integration
✅ Role-based Filtering

## If You Still See Errors:

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Check that the package is in package.json:
```json
{
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.0.5"
  }
}
```

3. Restart your IDE/editor

## Alternative: Use Native Confirm Dialog

If you don't want to install the package, you can use the native browser confirm dialog instead. Replace the AlertDialog in `EventDetailsModal.tsx` with:

```typescript
const handleDelete = async () => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${event.title}"?${
      event.attendees && event.attendees.length > 0
        ? `\n\n⚠️ ${event.attendees.length} attendee(s) will be notified about the cancellation.`
        : ''
    }`
  );
  
  if (confirmed) {
    setDeleting(true);
    try {
      await onDelete(event.id);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setDeleting(false);
    }
  }
};
```

Then remove the AlertDialog imports and component from the file.
