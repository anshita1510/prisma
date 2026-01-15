import { PrismaClient } from '@prisma/client';
import { NotificationService } from './notification.service';

const prisma = new PrismaClient();

interface CreateEventDTO {
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  isAllDay?: boolean;
  eventType: string;
  referenceId?: number;
  isRecurring?: boolean;
  recurrenceRule?: string;
  attendeeIds?: number[];
  location?: string;
}

interface UpdateEventDTO {
  title?: string;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
  isAllDay?: boolean;
  eventType?: string;
  location?: string;
}

interface GetEventsFilter {
  startDate?: string;
  endDate?: string;
  eventType?: string;
}

export class CalendarService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async createEvent(userId: number, data: CreateEventDTO) {
    // Get employee from user
    const employee = await prisma.employee.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Create event
    const event = await prisma.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description,
        startDateTime: new Date(data.startDateTime),
        endDateTime: new Date(data.endDateTime),
        isAllDay: data.isAllDay || false,
        eventType: data.eventType,
        referenceId: data.referenceId,
        isRecurring: data.isRecurring || false,
        recurrenceRule: data.recurrenceRule,
        organizerId: employee.id,
        attendees: data.attendeeIds ? {
          create: data.attendeeIds.map(attendeeId => ({
            attendeeId,
            status: 'pending'
          }))
        } : undefined
      },
      include: {
        organizer: {
          include: { user: true }
        },
        attendees: {
          include: {
            attendee: {
              include: { user: true }
            }
          }
        }
      }
    });

    // Send notifications to attendees
    if (data.attendeeIds && data.attendeeIds.length > 0) {
      await this.notificationService.createNotification({
        title: 'New Event Invitation',
        message: `You have been invited to "${data.title}"`,
        type: 'TASK_ASSIGNED', // Using existing type, can add EVENT_INVITATION later
        referenceId: event.id,
        referenceType: 'calendar_event',
        createdById: employee.id,
        recipientIds: data.attendeeIds
      });
    }

    return event;
  }

  async getEvents(userId: number, filters: GetEventsFilter) {
    const employee = await prisma.employee.findUnique({
      where: { userId }
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const where: any = {
      OR: [
        { organizerId: employee.id },
        {
          attendees: {
            some: {
              attendeeId: employee.id
            }
          }
        }
      ]
    };

    // Add date filters
    if (filters.startDate && filters.endDate) {
      where.AND = [
        {
          startDateTime: {
            gte: new Date(filters.startDate)
          }
        },
        {
          endDateTime: {
            lte: new Date(filters.endDate)
          }
        }
      ];
    }

    // Add event type filter
    if (filters.eventType) {
      where.eventType = filters.eventType;
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        organizer: {
          include: { user: true }
        },
        attendees: {
          include: {
            attendee: {
              include: { user: true }
            }
          }
        }
      },
      orderBy: {
        startDateTime: 'asc'
      }
    });

    return events;
  }

  async getEventById(eventId: number) {
    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          include: { user: true }
        },
        attendees: {
          include: {
            attendee: {
              include: { user: true }
            }
          }
        }
      }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  async updateEvent(eventId: number, userId: number, data: UpdateEventDTO) {
    const employee = await prisma.employee.findUnique({
      where: { userId }
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Check if user is organizer
    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizerId !== employee.id) {
      throw new Error('Only organizer can update the event');
    }

    const updatedEvent = await prisma.calendarEvent.update({
      where: { id: eventId },
      data: {
        title: data.title,
        description: data.description,
        startDateTime: data.startDateTime ? new Date(data.startDateTime) : undefined,
        endDateTime: data.endDateTime ? new Date(data.endDateTime) : undefined,
        isAllDay: data.isAllDay,
        eventType: data.eventType
      },
      include: {
        organizer: {
          include: { user: true }
        },
        attendees: {
          include: {
            attendee: {
              include: { user: true }
            }
          }
        }
      }
    });

    // Notify attendees about update
    const attendeeIds = updatedEvent.attendees.map(a => a.attendeeId);
    if (attendeeIds.length > 0) {
      await this.notificationService.createNotification({
        title: 'Event Updated',
        message: `"${updatedEvent.title}" has been updated`,
        type: 'TASK_UPDATED',
        referenceId: updatedEvent.id,
        referenceType: 'calendar_event',
        createdById: employee.id,
        recipientIds: attendeeIds
      });
    }

    return updatedEvent;
  }

  async deleteEvent(eventId: number, userId: number) {
    const employee = await prisma.employee.findUnique({
      where: { userId }
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
      include: { attendees: true }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizerId !== employee.id) {
      throw new Error('Only organizer can delete the event');
    }

    // Notify attendees about cancellation
    const attendeeIds = event.attendees.map(a => a.attendeeId);
    if (attendeeIds.length > 0) {
      await this.notificationService.createNotification({
        title: 'Event Cancelled',
        message: `"${event.title}" has been cancelled`,
        type: 'TASK_UPDATED',
        referenceId: event.id,
        referenceType: 'calendar_event',
        createdById: employee.id,
        recipientIds: attendeeIds
      });
    }

    await prisma.calendarEvent.delete({
      where: { id: eventId }
    });

    return { message: 'Event deleted successfully' };
  }

  async addAttendees(eventId: number, attendeeIds: number[]) {
    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const attendees = await prisma.calendarEventAttendee.createMany({
      data: attendeeIds.map(attendeeId => ({
        eventId,
        attendeeId,
        status: 'pending'
      })),
      skipDuplicates: true
    });

    // Send notifications
    await this.notificationService.createNotification({
      title: 'New Event Invitation',
      message: `You have been invited to "${event.title}"`,
      type: 'TASK_ASSIGNED',
      referenceId: event.id,
      referenceType: 'calendar_event',
      createdById: event.organizerId,
      recipientIds: attendeeIds
    });

    return attendees;
  }

  async updateAttendeeStatus(eventId: number, attendeeId: number, status: string) {
    const attendee = await prisma.calendarEventAttendee.updateMany({
      where: {
        eventId,
        attendeeId
      },
      data: {
        status
      }
    });

    return attendee;
  }
}
