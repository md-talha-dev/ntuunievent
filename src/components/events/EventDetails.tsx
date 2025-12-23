import React from 'react';
import { Event, getCategoryColor, isEventPast } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Users, Heart, Check, Building } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EventDetailsProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, open, onClose }) => {
  const { user } = useAuth();
  const { toggleInterested, toggleGoing } = useEvents();

  if (!event) return null;

  const isPast = isEventPast(event.date);
  const isInterested = user ? event.interestedUsers.includes(user.id) : false;
  const isGoing = user ? event.goingUsers.includes(user.id) : false;

  const handleInterested = () => {
    if (!user) {
      toast.error('Please login to mark interest');
      return;
    }
    if (isPast) {
      toast.error('This event has already passed');
      return;
    }
    toggleInterested(event.id, user.id);
    if (!isInterested) {
      toast.success('Marked as interested!');
    }
  };

  const handleGoing = () => {
    if (!user) {
      toast.error('Please login to mark attendance');
      return;
    }
    if (isPast) {
      toast.error('This event has already passed');
      return;
    }
    toggleGoing(event.id, user.id);
    if (!isGoing) {
      toast.success('Marked as going!');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-2 mb-2">
            <Badge className={cn("font-medium", getCategoryColor(event.category))}>
              {event.category}
            </Badge>
            {isPast && (
              <Badge variant="secondary">Past Event</Badge>
            )}
            {event.status === 'closed' && (
              <Badge variant="outline">Closed</Badge>
            )}
          </div>
          <DialogTitle className="font-display text-2xl font-bold text-foreground">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <p className="text-muted-foreground leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Building className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Organizer</p>
                <p className="font-medium">{event.organizer}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-info/10">
                <Heart className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{event.interestedCount}</p>
                <p className="text-xs text-muted-foreground">Interested</p>
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success/10">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{event.goingCount}</p>
                <p className="text-xs text-muted-foreground">Going</p>
              </div>
            </div>
          </div>

          {!isPast && user?.role === 'student' && (
            <div className="flex gap-3">
              <Button 
                variant={isInterested ? "interested-active" : "interested"}
                size="lg"
                className="flex-1"
                onClick={handleInterested}
              >
                <Heart className="h-5 w-5" />
                {isInterested ? 'Interested' : 'Mark Interested'}
              </Button>
              <Button 
                variant={isGoing ? "going-active" : "going"}
                size="lg"
                className="flex-1"
                onClick={handleGoing}
              >
                <Check className="h-5 w-5" />
                {isGoing ? 'Going' : 'Mark Going'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetails;
