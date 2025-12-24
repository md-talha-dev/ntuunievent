import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Event, EventCategory, isEventPast } from '@/lib/data';
import Header from '@/components/layout/Header';
import EventCard from '@/components/events/EventCard';
import EventFilters from '@/components/events/EventFilters';
import EventDetails from '@/components/events/EventDetails';
import { Calendar } from 'lucide-react';

const Events: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [organizerFilter, setOrganizerFilter] = useState('all');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesOrganizer = organizerFilter === 'all' || event.organizer === organizerFilter;
      
      const isPast = isEventPast(event.date);
      const matchesPastFilter = showPastEvents ? isPast : !isPast;

      // Date range filter
      const eventDate = new Date(event.date);
      const matchesFromDate = !fromDate || eventDate >= fromDate;
      const matchesToDate = !toDate || eventDate <= toDate;

      return matchesSearch && matchesCategory && matchesOrganizer && matchesPastFilter && matchesFromDate && matchesToDate;
    }).sort((a, b) => {
      // Sort by date, upcoming first
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [events, searchQuery, categoryFilter, organizerFilter, showPastEvents, fromDate, toDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Campus Events
          </h1>
          <p className="text-muted-foreground">
            Discover and join exciting events happening at NTU
          </p>
        </div>

        <div className="mb-8">
          <EventFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            organizerFilter={organizerFilter}
            setOrganizerFilter={setOrganizerFilter}
            showPastEvents={showPastEvents}
            setShowPastEvents={setShowPastEvents}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        </div>

        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 icon-3d" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No events found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {showPastEvents 
                ? "No past events match your filters. Try adjusting your search criteria."
                : "No upcoming events match your filters. Try adjusting your search criteria or check past events."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventCard 
                  event={event} 
                  onViewDetails={setSelectedEvent}
                />
              </div>
            ))}
          </div>
        )}

        <EventDetails
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </main>
    </div>
  );
};

export default Events;
