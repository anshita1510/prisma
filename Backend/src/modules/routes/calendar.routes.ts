import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { CalendarController } from '../controllers/calendar.controller';

const router = Router();
const calendarController = new CalendarController();

// All routes require authentication
router.use(authenticateToken);

// Event routes
router.post('/events', calendarController.createEvent);
router.get('/events', calendarController.getEvents);
router.get('/events/:id', calendarController.getEventById);
router.put('/events/:id', calendarController.updateEvent);
router.delete('/events/:id', calendarController.deleteEvent);

// Attendee routes
router.post('/events/:id/attendees', calendarController.addAttendees);
router.put('/events/:id/attendees/:attendeeId/status', calendarController.updateAttendeeStatus);

export default router;
