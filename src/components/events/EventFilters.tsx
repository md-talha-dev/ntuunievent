import React from 'react';
import { EventCategory } from '@/lib/data';
import { useEvents } from '@/contexts/EventContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: EventCategory | 'all';
  setCategoryFilter: (category: EventCategory | 'all') => void;
  organizerFilter: string;
  setOrganizerFilter: (organizer: string) => void;
  showPastEvents: boolean;
  setShowPastEvents: (show: boolean) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  organizerFilter,
  setOrganizerFilter,
  showPastEvents,
  setShowPastEvents,
}) => {
  const { categories, organizers } = useEvents();
  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || organizerFilter !== 'all' || showPastEvents;

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setOrganizerFilter('all');
    setShowPastEvents(false);
  };

  return (
    <div className={cn(
      "space-y-4 p-5 rounded-2xl",
      "bg-gradient-to-br from-card via-card to-muted/30",
      "border border-border/50 shadow-xl",
      "transition-all duration-300 hover:shadow-2xl",
      "animate-fade-in"
    )}>
      <div className="flex items-center gap-3 text-sm font-medium text-foreground">
        <div className="p-2 rounded-lg bg-gradient-primary shadow-lg">
          <Filter className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold">Filter Events</span>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className={cn(
              "ml-auto text-muted-foreground hover:text-foreground",
              "hover:bg-destructive/10 hover:text-destructive",
              "transition-all duration-300"
            )}
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as EventCategory | 'all')}>
          <SelectTrigger className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={organizerFilter} onValueChange={setOrganizerFilter}>
          <SelectTrigger className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <SelectValue placeholder="Organizer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Societies</SelectItem>
            {organizers.map((organizer) => (
              <SelectItem key={organizer} value={organizer}>
                {organizer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showPastEvents ? "secondary" : "outline"}
          onClick={() => setShowPastEvents(!showPastEvents)}
          className={cn(
            "w-full shadow-sm hover:shadow-md transition-all duration-300",
            showPastEvents && "bg-gradient-to-r from-secondary to-secondary/80"
          )}
        >
          <Sparkles className={cn(
            "h-4 w-4 mr-2 transition-transform duration-300",
            showPastEvents && "animate-pulse"
          )} />
          {showPastEvents ? 'Showing Past' : 'Show Past Events'}
        </Button>
      </div>
    </div>
  );
};

export default EventFilters;
