import React from 'react';
import { Event, getCategoryColor, isEventPast } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Heart, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onViewDetails?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  const { user } = useAuth();
  const { toggleInterested, toggleGoing } = useEvents();
  
  const isPast = isEventPast(event.date);
  const isInterested = user ? event.interestedUsers.includes(user.id) : false;
  const isGoing = user ? event.goingUsers.includes(user.id) : false;

  const handleInterested = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleGoing = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-card-hover cursor-pointer animate-fade-in",
        isPast && "opacity-60"
      )}
      onClick={() => onViewDetails?.(event)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Badge className={cn("font-medium", getCategoryColor(event.category))}>
              {event.category}
            </Badge>
            {isPast && (
              <Badge variant="secondary" className="ml-2">Past Event</Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{event.organizer}</span>
        </div>
        <h3 className="font-display text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDate(event.date)}</span>
            <Clock className="h-4 w-4 text-primary ml-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-4 w-4 text-info" />
              <span className="font-medium">{event.interestedCount}</span> interested
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Check className="h-4 w-4 text-success" />
              <span className="font-medium">{event.goingCount}</span> going
            </span>
          </div>
        </div>
        
        {!isPast && user?.role === 'student' && (
          <div className="flex gap-2 w-full">
            <Button 
              variant={isInterested ? "interested-active" : "interested"}
              size="sm"
              className="flex-1"
              onClick={handleInterested}
            >
              <Heart className="h-4 w-4" />
              {isInterested ? 'Interested' : 'Interested'}
            </Button>
            <Button 
              variant={isGoing ? "going-active" : "going"}
              size="sm"
              className="flex-1"
              onClick={handleGoing}
            >
              <Check className="h-4 w-4" />
              {isGoing ? 'Going' : 'Going'}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
