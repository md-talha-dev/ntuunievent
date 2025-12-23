import React from 'react';
import { Event, getCategoryColor, isEventPast } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Heart, Check, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface AdminEventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const AdminEventCard: React.FC<AdminEventCardProps> = ({ event, onEdit, onDelete }) => {
  const isPast = isEventPast(event.date);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-card-hover animate-fade-in",
      isPast && "opacity-70"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn("font-medium", getCategoryColor(event.category))}>
              {event.category}
            </Badge>
            <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
              {event.status}
            </Badge>
            {isPast && (
              <Badge variant="outline">Past</Badge>
            )}
          </div>
        </div>
        <h3 className="font-display text-lg font-semibold leading-tight text-foreground line-clamp-2">
          {event.title}
        </h3>
        <p className="text-xs text-muted-foreground">{event.organizer}</p>
      </CardHeader>
      
      <CardContent className="pb-3">
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

        <div className="flex items-center gap-4 mt-4 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-info" />
            <span className="font-semibold">{event.interestedCount}</span>
            <span className="text-xs text-muted-foreground">interested</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" />
            <span className="font-semibold">{event.goingCount}</span>
            <span className="text-xs text-muted-foreground">going</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-3 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit(event)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="flex-1">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{event.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(event.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default AdminEventCard;
