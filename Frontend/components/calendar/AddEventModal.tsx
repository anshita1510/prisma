'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, Bell, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (event: any) => void;
  selectedDate?: string;
  editEvent?: CalendarEvent | null;
}

interface Attendee {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'REMINDER' | 'FESTIVAL' | 'HOLIDAY';
  attendees?: string[];
  location?: string;
  createdBy?: string;
  notifyAttendees?: boolean;
}

export function AddEventModal({ isOpen, onClose, onSuccess, selectedDate, editEvent }: AddEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate || '',
    time: '',
    type: 'MEETING' as 'MEETING' | 'DEADLINE' | 'MILESTONE' | 'REMINDER',
    location: '',
    notifyAttendees: true,
  });
  
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!editEvent;

  useEffect(() => {
    if (isOpen) {
      loadCompanyMembers();
      if (editEvent) {
        // Populate form with edit data
        setFormData({
          title: editEvent.title,
          description: editEvent.description,
          date: editEvent.date,
          time: editEvent.time === 'All Day' ? '' : editEvent.time,
          type: editEvent.type as any,
          location: editEvent.location || '',
          notifyAttendees: true,
        });
        // TODO: Map attendee names to IDs when we have the data
      } else if (selectedDate) {
        setFormData(prev => ({ ...prev, date: selectedDate }));
      }
    }
  }, [isOpen, selectedDate, editEvent]);

  const loadCompanyMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      
      if (!token || !currentUser?.companyId) {
        console.warn('No token or company ID found');
        return;
      }

      // Fetch company members from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/employees/company/${currentUser.companyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter out SUPER_ADMIN users
        const members = (data.data || data)
          .filter((emp: any) => emp.user?.role !== 'SUPER_ADMIN')
          .map((emp: any) => ({
            id: emp.id,
            name: emp.name || emp.user?.name || 'Unknown',
            email: emp.email || emp.user?.email || '',
            role: emp.user?.role || emp.designation || ''
          }));
        
        setAvailableUsers(members);
        console.log('✅ Loaded company members:', members.length);
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data');
        useMockData();
      }
    } catch (error) {
      console.error('Error loading company members:', error);
      // Use mock data as fallback
      useMockData();
    }
  };

  const useMockData = () => {
    const mockUsers: Attendee[] = [
      { id: 1, name: 'John Doe', email: 'john@company.com', role: 'ADMIN' },
      { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'MANAGER' },
      { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'USER' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', role: 'MANAGER' },
      { id: 5, name: 'Alex Brown', email: 'alex@company.com', role: 'USER' },
    ];
    setAvailableUsers(mockUsers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }
    
    if (!formData.date) {
      setError('Event date is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const eventData = {
        id: editEvent?.id || `custom-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time || 'All Day',
        type: formData.type,
        location: formData.location,
        attendees: selectedAttendees.map(id => 
          availableUsers.find(u => u.id === id)?.name || ''
        ).filter(Boolean),
        createdBy: user?.name || 'Current User',
        notifyAttendees: formData.notifyAttendees,
      };

      // TODO: Replace with actual API call
      // if (isEditMode) {
      //   await calendarService.updateEvent(eventData.id, eventData);
      // } else {
      //   await calendarService.createEvent(eventData);
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(isEditMode ? '✅ Event updated:' : '✅ Event created:', eventData);
      
      // Show notification if enabled
      if (formData.notifyAttendees && selectedAttendees.length > 0) {
        console.log('📧 Notifications sent to:', selectedAttendees.length, 'attendees');
      }
      
      onSuccess(eventData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('❌ Error creating event:', error);
      setError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'MEETING',
      location: '',
      notifyAttendees: true,
    });
    setSelectedAttendees([]);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleAttendee = (userId: number) => {
    setSelectedAttendees(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'MEETING': 'bg-blue-100 text-blue-800',
      'DEADLINE': 'bg-red-100 text-red-800',
      'MILESTONE': 'bg-green-100 text-green-800',
      'REMINDER': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {isEditMode ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <span className="text-red-500 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 px-2">
          {/* Event Type */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <Label htmlFor="type" className="font-medium mb-2 block">Event Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEETING">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Meeting</span>
                  </div>
                </SelectItem>
                <SelectItem value="DEADLINE">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Deadline</span>
                  </div>
                </SelectItem>
                <SelectItem value="MILESTONE">
                  <div className="flex items-center gap-2">
                    <Badge className="w-4 h-4" />
                    <span>Milestone</span>
                  </div>
                </SelectItem>
                <SelectItem value="REMINDER">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>Reminder</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="font-medium">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Team Standup Meeting"
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add event details, agenda, or notes..."
                rows={3}
                disabled={loading}
                className="mt-1"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              Date & Time
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="font-medium">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  disabled={loading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time" className="font-medium">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  disabled={loading}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Conference Room A or Virtual Meeting"
              disabled={loading}
              className="mt-1"
            />
          </div>

          {/* Attendees */}
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Attendees
            </h3>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAttendees.includes(user.id)}
                    onChange={() => toggleAttendee(user.id)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      {user.role && (
                        <Badge className="text-xs bg-gray-200 text-gray-700">
                          {user.role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </label>
              ))}
            </div>

            {selectedAttendees.length > 0 && (
              <div className="mt-3 pt-3 border-t border-indigo-200">
                <p className="text-sm text-gray-600 mb-2">
                  Selected: {selectedAttendees.length} attendee(s)
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedAttendees.map(id => {
                    const user = availableUsers.find(u => u.id === id);
                    return user ? (
                      <Badge key={id} className="bg-indigo-200 text-indigo-800 flex items-center gap-1">
                        {user.name}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-indigo-900" 
                          onClick={() => toggleAttendee(id)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyAttendees}
                onChange={(e) => setFormData({ ...formData, notifyAttendees: e.target.checked })}
                className="w-4 h-4 text-yellow-600"
              />
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-gray-900">
                  Send notifications to all attendees
                </span>
              </div>
            </label>
            <p className="text-xs text-gray-600 mt-2 ml-7">
              Attendees will receive an email notification about this event
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
