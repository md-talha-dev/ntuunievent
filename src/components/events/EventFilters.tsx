import React from 'react';
import { CATEGORIES, ORGANIZERS, EventCategory } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';

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
  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || organizerFilter !== 'all' || showPastEvents;

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setOrganizerFilter('all');
    setShowPastEvents(false);
  };

  return (
    <div className="space-y-4 p-4 rounded-xl bg-card border border-border shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4 text-primary" />
        <span>Filter Events</span>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as EventCategory | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={organizerFilter} onValueChange={setOrganizerFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Organizer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizers</SelectItem>
            {ORGANIZERS.map((organizer) => (
              <SelectItem key={organizer} value={organizer}>
                {organizer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showPastEvents ? "secondary" : "outline"}
          onClick={() => setShowPastEvents(!showPastEvents)}
          className="w-full"
        >
          {showPastEvents ? 'Showing Past Events' : 'Show Past Events'}
        </Button>
      </div>
    </div>
  );
};

export default EventFilters;
