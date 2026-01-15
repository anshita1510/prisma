'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '../../admin/_components/Sidebar_A';
import { AddEventModal } from '@/components/calendar/AddEventModal';
import { EventDetailsModal } from '@/components/calendar/EventDetailsModal';
import { calendarService } from '@/app/services/calendarService';
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Users,
  MapPin,
  Sparkles
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'REMINDER' | 'FESTIVAL' | 'HOLIDAY';
  attendees?: string[];
  location?: string;
  isPublicHoliday?: boolean;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  // Festivals and Holidays for 2025-2026
  const festivalsAndHolidays: CalendarEvent[] = [
    // ========== 2025 ==========
    
    // January 2025
    { id: 'f1', title: 'New Year\'s Day', description: 'Public Holiday - New Year Celebration', date: '2025-01-01', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f2', title: 'Makar Sankranti', description: 'Hindu Festival - Harvest Festival', date: '2025-01-14', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f3', title: 'Pongal', description: 'Tamil Harvest Festival', date: '2025-01-15', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f4', title: 'Republic Day', description: 'Public Holiday - National Day', date: '2025-01-26', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    
    // February 2025
    { id: 'f5', title: 'Basant Panchami', description: 'Hindu Festival - Spring Festival', date: '2025-02-03', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f6', title: 'Valentine\'s Day', description: 'Day of Love', date: '2025-02-14', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f7', title: 'Maha Shivaratri', description: 'Hindu Festival - Night of Shiva', date: '2025-02-26', time: 'All Day', type: 'FESTIVAL' },
    
    // March 2025
    { id: 'f8', title: 'Holi', description: 'Festival of Colors', date: '2025-03-14', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    { id: 'f9', title: 'Holika Dahan', description: 'Holi Eve Celebration', date: '2025-03-13', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f10', title: 'Ugadi', description: 'Telugu & Kannada New Year', date: '2025-03-30', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f11', title: 'Gudi Padwa', description: 'Marathi New Year', date: '2025-03-30', time: 'All Day', type: 'FESTIVAL' },
    
    // April 2025
    { id: 'f12', title: 'Ram Navami', description: 'Birth of Lord Rama', date: '2025-04-06', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f13', title: 'Mahavir Jayanti', description: 'Jain Festival', date: '2025-04-10', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f14', title: 'Good Friday', description: 'Christian Holiday', date: '2025-04-18', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f15', title: 'Easter Sunday', description: 'Christian Festival', date: '2025-04-20', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f16', title: 'Hanuman Jayanti', description: 'Birth of Lord Hanuman', date: '2025-04-13', time: 'All Day', type: 'FESTIVAL' },
    
    // May 2025
    { id: 'f17', title: 'May Day', description: 'Labour Day', date: '2025-05-01', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f18', title: 'Buddha Purnima', description: 'Birth of Buddha', date: '2025-05-12', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f19', title: 'Mother\'s Day', description: 'Celebration of Mothers', date: '2025-05-11', time: 'All Day', type: 'FESTIVAL' },
    
    // June 2025
    { id: 'f20', title: 'Eid al-Adha', description: 'Islamic Festival of Sacrifice', date: '2025-06-07', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    { id: 'f21', title: 'Father\'s Day', description: 'Celebration of Fathers', date: '2025-06-15', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f22', title: 'Rath Yatra', description: 'Jagannath Rath Yatra', date: '2025-06-29', time: 'All Day', type: 'FESTIVAL' },
    
    // July 2025
    { id: 'f23', title: 'Muharram', description: 'Islamic New Year', date: '2025-07-06', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f24', title: 'Guru Purnima', description: 'Festival of Teachers', date: '2025-07-10', time: 'All Day', type: 'FESTIVAL' },
    
    // August 2025
    { id: 'f25', title: 'Raksha Bandhan', description: 'Brother-Sister Festival', date: '2025-08-09', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f26', title: 'Independence Day', description: 'Public Holiday - National Day', date: '2025-08-15', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f27', title: 'Janmashtami', description: 'Birth of Lord Krishna', date: '2025-08-16', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f28', title: 'Ganesh Chaturthi', description: 'Birth of Lord Ganesha', date: '2025-08-27', time: 'All Day', type: 'FESTIVAL' },
    
    // September 2025
    { id: 'f29', title: 'Onam', description: 'Kerala Harvest Festival', date: '2025-09-05', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f30', title: 'Ganesh Visarjan', description: 'Immersion of Ganesha Idols', date: '2025-09-06', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f31', title: 'Navratri Begins', description: 'Nine Nights Festival', date: '2025-09-22', time: 'All Day', type: 'FESTIVAL' },
    
    // October 2025
    { id: 'f32', title: 'Dussehra', description: 'Victory of Good over Evil', date: '2025-10-02', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    { id: 'f33', title: 'Gandhi Jayanti', description: 'Public Holiday - Birth of Mahatma Gandhi', date: '2025-10-02', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f34', title: 'Karva Chauth', description: 'Hindu Festival for Married Women', date: '2025-10-09', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f35', title: 'Diwali', description: 'Festival of Lights', date: '2025-10-20', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    { id: 'f36', title: 'Dhanteras', description: 'Festival of Wealth', date: '2025-10-18', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f37', title: 'Govardhan Puja', description: 'Day after Diwali', date: '2025-10-21', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f38', title: 'Bhai Dooj', description: 'Brother-Sister Festival', date: '2025-10-22', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f39', title: 'Halloween', description: 'Western Festival', date: '2025-10-31', time: 'All Day', type: 'FESTIVAL' },
    
    // November 2025
    { id: 'f40', title: 'Guru Nanak Jayanti', description: 'Birth of Guru Nanak', date: '2025-11-05', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    { id: 'f41', title: 'Children\'s Day', description: 'Celebration of Children', date: '2025-11-14', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f42', title: 'Thanksgiving', description: 'Western Holiday', date: '2025-11-27', time: 'All Day', type: 'FESTIVAL' },
    
    // December 2025
    { id: 'f43', title: 'Christmas Eve', description: 'Christian Festival', date: '2025-12-24', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f44', title: 'Christmas Day', description: 'Public Holiday - Birth of Jesus Christ', date: '2025-12-25', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f45', title: 'New Year\'s Eve', description: 'Year End Celebration', date: '2025-12-31', time: 'All Day', type: 'FESTIVAL' },
    
    // ========== 2026 ==========
    
    // January 2026
    { id: 'f46', title: 'New Year\'s Day', description: 'Public Holiday - New Year Celebration', date: '2026-01-01', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f47', title: 'Makar Sankranti', description: 'Hindu Festival - Harvest Festival', date: '2026-01-14', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f48', title: 'Pongal', description: 'Tamil Harvest Festival', date: '2026-01-15', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f49', title: 'Republic Day', description: 'Public Holiday - National Day', date: '2026-01-26', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    
    // February 2026
    { id: 'f50', title: 'Basant Panchami', description: 'Hindu Festival - Spring Festival', date: '2026-02-01', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f51', title: 'Valentine\'s Day', description: 'Day of Love', date: '2026-02-14', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f52', title: 'Maha Shivaratri', description: 'Hindu Festival - Night of Shiva', date: '2026-02-17', time: 'All Day', type: 'FESTIVAL' },
    
    // March 2026
    { id: 'f53', title: 'Holi', description: 'Festival of Colors', date: '2026-03-04', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    { id: 'f54', title: 'Holika Dahan', description: 'Holi Eve Celebration', date: '2026-03-03', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f55', title: 'Ugadi', description: 'Telugu & Kannada New Year', date: '2026-03-22', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f56', title: 'Gudi Padwa', description: 'Marathi New Year', date: '2026-03-22', time: 'All Day', type: 'FESTIVAL' },
    
    // April 2026
    { id: 'f57', title: 'Ram Navami', description: 'Birth of Lord Rama', date: '2026-03-28', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f58', title: 'Mahavir Jayanti', description: 'Jain Festival', date: '2026-04-02', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f59', title: 'Good Friday', description: 'Christian Holiday', date: '2026-04-03', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f60', title: 'Easter Sunday', description: 'Christian Festival', date: '2026-04-05', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f61', title: 'Hanuman Jayanti', description: 'Birth of Lord Hanuman', date: '2026-04-08', time: 'All Day', type: 'FESTIVAL' },
    
    // May 2026
    { id: 'f62', title: 'May Day', description: 'Labour Day', date: '2026-05-01', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f63', title: 'Buddha Purnima', description: 'Birth of Buddha', date: '2026-05-04', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f64', title: 'Mother\'s Day', description: 'Celebration of Mothers', date: '2026-05-10', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f65', title: 'Eid al-Fitr', description: 'Islamic Festival', date: '2026-05-24', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    
    // June 2026
    { id: 'f66', title: 'Father\'s Day', description: 'Celebration of Fathers', date: '2026-06-21', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f67', title: 'Rath Yatra', description: 'Jagannath Rath Yatra', date: '2026-06-23', time: 'All Day', type: 'FESTIVAL' },
    
    // July 2026
    { id: 'f68', title: 'Guru Purnima', description: 'Festival of Teachers', date: '2026-07-01', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f69', title: 'Muharram', description: 'Islamic New Year', date: '2026-07-18', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f70', title: 'Eid al-Adha', description: 'Islamic Festival of Sacrifice', date: '2026-07-31', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    
    // August 2026
    { id: 'f71', title: 'Raksha Bandhan', description: 'Brother-Sister Festival', date: '2026-08-01', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f72', title: 'Janmashtami', description: 'Birth of Lord Krishna', date: '2026-08-08', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f73', title: 'Independence Day', description: 'Public Holiday - National Day', date: '2026-08-15', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f74', title: 'Ganesh Chaturthi', description: 'Birth of Lord Ganesha', date: '2026-08-19', time: 'All Day', type: 'FESTIVAL' },
    
    // September 2026
    { id: 'f75', title: 'Onam', description: 'Kerala Harvest Festival', date: '2026-08-28', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f76', title: 'Ganesh Visarjan', description: 'Immersion of Ganesha Idols', date: '2026-08-29', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f77', title: 'Navratri Begins', description: 'Nine Nights Festival', date: '2026-09-15', time: 'All Day', type: 'FESTIVAL' },
    
    // October 2026
    { id: 'f78', title: 'Dussehra', description: 'Victory of Good over Evil', date: '2026-09-24', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    { id: 'f79', title: 'Gandhi Jayanti', description: 'Public Holiday - Birth of Mahatma Gandhi', date: '2026-10-02', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f80', title: 'Karva Chauth', description: 'Hindu Festival for Married Women', date: '2026-10-01', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f81', title: 'Dhanteras', description: 'Festival of Wealth', date: '2026-10-09', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f82', title: 'Diwali', description: 'Festival of Lights', date: '2026-10-11', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    { id: 'f83', title: 'Govardhan Puja', description: 'Day after Diwali', date: '2026-10-12', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f84', title: 'Bhai Dooj', description: 'Brother-Sister Festival', date: '2026-10-13', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f85', title: 'Halloween', description: 'Western Festival', date: '2026-10-31', time: 'All Day', type: 'FESTIVAL' },
    
    // November 2026
    { id: 'f86', title: 'Guru Nanak Jayanti', description: 'Birth of Guru Nanak', date: '2026-11-24', time: 'All Day', type: 'FESTIVAL', isPublicHoliday: true },
    { id: 'f87', title: 'Children\'s Day', description: 'Celebration of Children', date: '2026-11-14', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f88', title: 'Thanksgiving', description: 'Western Holiday', date: '2026-11-26', time: 'All Day', type: 'FESTIVAL' },
    
    // December 2026
    { id: 'f89', title: 'Christmas Eve', description: 'Christian Festival', date: '2026-12-24', time: 'All Day', type: 'FESTIVAL' },
    { id: 'f90', title: 'Christmas Day', description: 'Public Holiday - Birth of Jesus Christ', date: '2026-12-25', time: 'All Day', type: 'HOLIDAY', isPublicHoliday: true },
    { id: 'f91', title: 'New Year\'s Eve', description: 'Year End Celebration', date: '2026-12-31', time: 'All Day', type: 'FESTIVAL' },
  ];
  
  const [events] = useState<CalendarEvent[]>([
    ...festivalsAndHolidays,
    {
      id: '1',
      title: 'Team Standup Meeting',
      description: 'Daily standup meeting with the development team',
      date: '2025-01-15',
      time: '09:00',
      type: 'MEETING',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      location: 'Conference Room A'
    },
    {
      id: '2',
      title: 'Project Deadline',
      description: 'Mobile App Development Phase 1 deadline',
      date: '2025-01-20',
      time: '17:00',
      type: 'DEADLINE'
    },
    {
      id: '3',
      title: 'Client Presentation',
      description: 'Present project progress to client stakeholders',
      date: '2025-01-22',
      time: '14:00',
      type: 'MEETING',
      attendees: ['Sarah Wilson', 'Alex Brown'],
      location: 'Virtual Meeting'
    },
    {
      id: '4',
      title: 'Sprint Planning',
      description: 'Plan tasks for the next development sprint',
      date: '2025-01-25',
      time: '10:00',
      type: 'MEETING',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      location: 'Conference Room B'
    }
  ]);

  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'MEETING':
        return 'bg-blue-100 text-blue-800';
      case 'DEADLINE':
        return 'bg-red-100 text-red-800';
      case 'MILESTONE':
        return 'bg-green-100 text-green-800';
      case 'REMINDER':
        return 'bg-yellow-100 text-yellow-800';
      case 'FESTIVAL':
        return 'bg-purple-100 text-purple-800';
      case 'HOLIDAY':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const allEvents = [...events, ...customEvents];
    return allEvents.filter(event => event.date === dateStr);
  };

  const upcomingEvents = [...events, ...customEvents]
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const handleAddEvent = (newEvent: CalendarEvent) => {
    if (editingEvent) {
      // Update existing event
      setCustomEvents(prev => prev.map(e => e.id === newEvent.id ? newEvent : e));
      console.log('✅ Event updated:', newEvent);
      setEditingEvent(null);
    } else {
      // Add new event
      setCustomEvents(prev => [...prev, newEvent]);
      console.log('✅ Event added to calendar:', newEvent);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsAddEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== eventId));
    console.log('✅ Event deleted:', eventId);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsModalOpen(true);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setEditingEvent(null);
    setIsAddEventModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddEventModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
        <div className="p-6">
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Enhanced Calendar</h1>
                <p className="text-gray-600 mt-1">Manage your schedule, events, and festivals</p>
              </div>
              <Button 
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedDate('');
                  setEditingEvent(null);
                  setIsAddEventModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </div>

            {/* Legend */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Event Types:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                    <span className="text-sm text-gray-600">Meetings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
                    <span className="text-sm text-gray-600">Deadlines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></div>
                    <span className="text-sm text-gray-600">🎉 Festivals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></div>
                    <span className="text-sm text-gray-600">🏖️ Public Holidays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                    <span className="text-sm text-gray-600">Milestones</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {formatDate(currentDate)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth().map((day, index) => {
                      const dayEvents = day ? getEventsForDate(day) : [];
                      const hasHoliday = dayEvents.some(e => e.type === 'HOLIDAY' && e.isPublicHoliday);
                      const hasFestival = dayEvents.some(e => e.type === 'FESTIVAL');
                      const isToday = day && 
                        new Date().getDate() === day && 
                        new Date().getMonth() === currentDate.getMonth() && 
                        new Date().getFullYear() === currentDate.getFullYear();
                      
                      return (
                        <div
                          key={index}
                          className={`min-h-[80px] p-1 border border-gray-200 ${
                            day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                          } ${isToday ? 'bg-blue-50 border-blue-300' : ''} ${
                            hasHoliday ? 'bg-orange-50 border-orange-200' : ''
                          } ${hasFestival && !hasHoliday ? 'bg-purple-50 border-purple-200' : ''}`}
                          onClick={() => day && handleDayClick(day)}
                        >
                          {day && (
                            <>
                              <div className={`text-sm font-medium mb-1 ${
                                isToday ? 'text-blue-600' : 
                                hasHoliday ? 'text-orange-600' : 
                                hasFestival ? 'text-purple-600' : 
                                'text-gray-900'
                              }`}>
                                {day}
                              </div>
                              <div className="space-y-1">
                                {dayEvents.slice(0, 2).map(event => (
                                  <div
                                    key={event.id}
                                    className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
                                      event.type === 'HOLIDAY' ? 'bg-orange-100 text-orange-800 font-semibold' :
                                      event.type === 'FESTIVAL' ? 'bg-purple-100 text-purple-800 font-semibold' :
                                      event.type === 'DEADLINE' ? 'bg-red-100 text-red-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}
                                    title={event.title}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEventClick(event);
                                    }}
                                  >
                                    {event.type === 'HOLIDAY' && '🏖️ '}
                                    {event.type === 'FESTIVAL' && '🎉 '}
                                    {event.title}
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{dayEvents.length - 2} more
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  <CardDescription>Your next scheduled events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div 
                      key={event.id} 
                      className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer animate-scale-in ${
                        event.type === 'HOLIDAY' ? 'border-orange-200 bg-orange-50' :
                        event.type === 'FESTIVAL' ? 'border-purple-200 bg-purple-50' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          {event.type === 'HOLIDAY' && '🏖️'}
                          {event.type === 'FESTIVAL' && '🎉'}
                          {event.title}
                        </h4>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        {event.time !== 'All Day' && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.attendees && (
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            <span>{event.attendees.length} attendees</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {upcomingEvents.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No upcoming events</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Event Modal */}
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleAddEvent}
        selectedDate={selectedDate}
        editEvent={editingEvent}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onClose={() => setIsEventDetailsModalOpen(false)}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        canEdit={selectedEvent?.type !== 'FESTIVAL' && selectedEvent?.type !== 'HOLIDAY'}
        canDelete={selectedEvent?.type !== 'FESTIVAL' && selectedEvent?.type !== 'HOLIDAY'}
      />
    </div>
  );
}