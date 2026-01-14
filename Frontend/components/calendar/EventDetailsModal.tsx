'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, User, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  createdBy?: string;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function EventDetailsModal({ 
  isOpen, 
  onClose, 
  event, 
  onEdit, 
  onDelete,
  canEdit = true,
  canDelete = true 
}: EventDetailsModalProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!event) return null;

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'MEETING': 'bg-blue-100 text-blue-800',
      'DEADLINE': 'bg-red-100 text-red-800',
      'MILESTONE': 'bg-green-100 text-green-800',
      'REMINDER': 'bg-yellow-100 text-yellow-800',
      'FESTIVAL': 'bg-purple-100 text-purple-800',
      'HOLIDAY': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = () => {
    onEdit(event);
    onClose();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(event.id);
      setShowDeleteDialog(false);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setDeleting(false);
    }
  };

  const isSystemEvent = event.type === 'FESTIVAL' || event.type === 'HOLIDAY';
  const showEditDelete = !isSystemEvent && (canEdit || canDelete);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
            <div className="flex items-start justify-between">
              <DialogTitle className="text-white text-xl flex items-center gap-2 flex-1">
                <Calendar className="w-5 h-5" />
                Event Details
              </DialogTitle>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <div className="space-y-4 px-2 py-4">
            {/* Title & Type */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 flex-1">
                  {event.type === 'HOLIDAY' && '🏖️ '}
                  {event.type === 'FESTIVAL' && '🎉 '}
                  {event.title}
                </h2>
                <Badge className={getEventTypeColor(event.type)}>
                  {event.type}
                </Badge>
              </div>
              {event.description && (
                <p className="text-gray-700 mt-2">{event.description}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Date & Time
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                {event.time && event.time !== 'All Day' && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.time === 'All Day' && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>All Day Event</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Location
                </h3>
                <p className="text-gray-700">{event.location}</p>
              </div>
            )}

            {/* Attendees */}
            {event.attendees && event.attendees.length > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Attendees ({event.attendees.length})
                </h3>
                <div className="space-y-2">
                  {event.attendees.map((attendee, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span>{attendee}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Creator */}
            {event.createdBy && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" />
                  Created By
                </h3>
                <p className="text-gray-700">{event.createdBy}</p>
              </div>
            )}

            {/* Action Buttons */}
            {showEditDelete && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                {canDelete && (
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
                {canEdit && (
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Event
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
              {event.attendees && event.attendees.length > 0 && (
                <span className="block mt-2 text-orange-600 font-medium">
                  ⚠️ {event.attendees.length} attendee(s) will be notified about the cancellation.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </span>
              ) : (
                'Delete Event'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
