'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '../../admin/_components/Sidebar_A';
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Users,
  MapPin
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'REMINDER';
  attendees?: string[];
  location?: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Standup Meeting',
      description: 'Daily standup meeting with the development team',
      date: '2024-12-18',
      time: '09:00',
      type: 'MEETING',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      location: 'Conference Room A'
    },
    {
      id: '2',
      title: 'Project Deadline',
      description: 'Mobile App Development Phase 1 deadline',
      date: '2024-12-20',
      time: '17:00',
      type: 'DEADLINE'
    },
    {
      id: '3',
      title: 'Client Presentation',
      description: 'Present project progress to client stakeholders',
      date: '2024-12-22',
      time: '14:00',
      type: 'MEETING',
      attendees: ['Sarah Wilson', 'Alex Brown'],
      location: 'Virtual Meeting'
    },
    {
      id: '4',
      title: 'Sprint Planning',
      description: 'Plan tasks for the next development sprint',
      date: '2024-12-25',
      time: '10:00',
      type: 'MEETING',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      location: 'Conference Room B'
    }
  ]);

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
    return events.filter(event => event.date === dateStr);
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
                <p className="text-gray-600 mt-1">Manage your schedule and upcoming events</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </div>

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
                      const isToday = day && 
                        new Date().getDate() === day && 
                        new Date().getMonth() === currentDate.getMonth() && 
                        new Date().getFullYear() === currentDate.getFullYear();
                      
                      return (
                        <div
                          key={index}
                          className={`min-h-[80px] p-1 border border-gray-200 ${
                            day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                          } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                        >
                          {day && (
                            <>
                              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                                {day}
                              </div>
                              <div className="space-y-1">
                                {dayEvents.slice(0, 2).map(event => (
                                  <div
                                    key={event.id}
                                    className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                                  >
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
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer animate-scale-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{event.title}</h4>
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
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
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
    </div>
  );
}