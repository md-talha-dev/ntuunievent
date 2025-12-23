import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, INITIAL_EVENTS, EventCategory } from '@/lib/data';
import { toast } from 'sonner';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'interestedCount' | 'goingCount' | 'interestedUsers' | 'goingUsers' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  toggleInterested: (eventId: string, userId: string) => void;
  toggleGoing: (eventId: string, userId: string) => void;
  getEventById: (id: string) => Event | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);

  const addEvent = (eventData: Omit<Event, 'id' | 'interestedCount' | 'goingCount' | 'interestedUsers' | 'goingUsers' | 'createdAt'>) => {
    // Check for duplicate event
    const duplicate = events.find(
      e => e.title.toLowerCase() === eventData.title.toLowerCase() && e.date === eventData.date
    );
    
    if (duplicate) {
      toast.error('An event with the same title and date already exists.');
      return;
    }

    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      interestedCount: 0,
      goingCount: 0,
      interestedUsers: [],
      goingUsers: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setEvents(prev => [newEvent, ...prev]);
    toast.success('Event created successfully!');
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      )
    );
    toast.success('Event updated successfully!');
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast.success('Event deleted successfully!');
  };

  const toggleInterested = (eventId: string, userId: string) => {
    setEvents(prev => 
      prev.map(event => {
        if (event.id !== eventId) return event;
        
        const isInterested = event.interestedUsers.includes(userId);
        
        if (isInterested) {
          return {
            ...event,
            interestedUsers: event.interestedUsers.filter(id => id !== userId),
            interestedCount: event.interestedCount - 1
          };
        } else {
          // Remove from going if switching
          const wasGoing = event.goingUsers.includes(userId);
          return {
            ...event,
            interestedUsers: [...event.interestedUsers, userId],
            interestedCount: event.interestedCount + 1,
            goingUsers: wasGoing ? event.goingUsers.filter(id => id !== userId) : event.goingUsers,
            goingCount: wasGoing ? event.goingCount - 1 : event.goingCount
          };
        }
      })
    );
  };

  const toggleGoing = (eventId: string, userId: string) => {
    setEvents(prev => 
      prev.map(event => {
        if (event.id !== eventId) return event;
        
        const isGoing = event.goingUsers.includes(userId);
        
        if (isGoing) {
          return {
            ...event,
            goingUsers: event.goingUsers.filter(id => id !== userId),
            goingCount: event.goingCount - 1
          };
        } else {
          // Remove from interested if switching
          const wasInterested = event.interestedUsers.includes(userId);
          return {
            ...event,
            goingUsers: [...event.goingUsers, userId],
            goingCount: event.goingCount + 1,
            interestedUsers: wasInterested ? event.interestedUsers.filter(id => id !== userId) : event.interestedUsers,
            interestedCount: wasInterested ? event.interestedCount - 1 : event.interestedCount
          };
        }
      })
    );
  };

  const getEventById = (id: string) => events.find(e => e.id === id);

  return (
    <EventContext.Provider value={{ 
      events, 
      addEvent, 
      updateEvent, 
      deleteEvent, 
      toggleInterested, 
      toggleGoing,
      getEventById 
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
