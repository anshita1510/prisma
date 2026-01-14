import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'REMINDER' | 'FESTIVAL' | 'HOLIDAY';
  attendees?: string[];
  location?: string;
  isPublicHoliday?: boolean;
  createdBy?: string;
  notifyAttendees?: boolean;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  location?: string;
  attendeeIds?: number[];
  notifyAttendees?: boolean;
}

class CalendarService {
  /**
   * Create a new calendar event
   */
  async createEvent(eventData: CreateEventData): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/calendar/events`,
        eventData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error creating event:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create event'
      };
    }
  }

  /**
   * Get all calendar events
   */
  async getEvents(startDate?: string, endDate?: string): Promise<{ success: boolean; data?: CalendarEvent[]; message?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(
        `${API_URL}/calendar/events?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error: any) {
      console.error('Error fetching events:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch events'
      };
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId: string, eventData: Partial<CreateEventData>): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${API_URL}/calendar/events/${eventId}`,
        eventData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error updating event:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update event'
      };
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `${API_URL}/calendar/events/${eventId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete event'
      };
    }
  }

  /**
   * Send notifications to attendees
   */
  async sendEventNotifications(eventId: string, attendeeIds: number[]): Promise<{ success: boolean; message?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_URL}/calendar/events/${eventId}/notify`,
        { attendeeIds },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error sending notifications:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send notifications'
      };
    }
  }

  /**
   * Get user's calendar view
   */
  async getCalendarView(month: number, year: number): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_URL}/calendar/view?month=${month}&year=${year}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error: any) {
      console.error('Error fetching calendar view:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch calendar view'
      };
    }
  }
}

export const calendarService = new CalendarService();
