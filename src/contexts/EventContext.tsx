import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, INITIAL_EVENTS, EventCategory, INITIAL_CATEGORIES, INITIAL_DEPARTMENTS, INITIAL_ORGANIZERS } from '@/lib/data';
import { toast } from 'sonner';

interface EventContextType {
  events: Event[];
  categories: EventCategory[];
  departments: string[];
  organizers: string[];
  addEvent: (event: Omit<Event, 'id' | 'interestedCount' | 'goingCount' | 'interestedUsers' | 'goingUsers' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  toggleInterested: (eventId: string, userId: string) => void;
  toggleGoing: (eventId: string, userId: string) => void;
  getEventById: (id: string) => Event | undefined;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  addDepartment: (department: string) => void;
  deleteDepartment: (department: string) => void;
  addOrganizer: (organizer: string) => void;
  deleteOrganizer: (organizer: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [categories, setCategories] = useState<EventCategory[]>(INITIAL_CATEGORIES);
  const [departments, setDepartments] = useState<string[]>(INITIAL_DEPARTMENTS);
  const [organizers, setOrganizers] = useState<string[]>(INITIAL_ORGANIZERS);

  const addEvent = (eventData: Omit<Event, 'id' | 'interestedCount' | 'goingCount' | 'interestedUsers' | 'goingUsers' | 'createdAt'>) => {
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

  // Category Management
  const addCategory = (category: string) => {
    if (categories.includes(category as EventCategory)) {
      toast.error('Category already exists!');
      return;
    }
    setCategories(prev => [...prev, category as EventCategory]);
    toast.success('Category added successfully!');
  };

  const deleteCategory = (category: string) => {
    const eventsWithCategory = events.filter(e => e.category === category);
    if (eventsWithCategory.length > 0) {
      toast.error(`Cannot delete category. ${eventsWithCategory.length} event(s) are using it.`);
      return;
    }
    setCategories(prev => prev.filter(c => c !== category));
    toast.success('Category deleted successfully!');
  };

  // Department Management
  const addDepartment = (department: string) => {
    if (departments.includes(department)) {
      toast.error('Department already exists!');
      return;
    }
    setDepartments(prev => [...prev, department]);
    toast.success('Department added successfully!');
  };

  const deleteDepartment = (department: string) => {
    const eventsWithDepartment = events.filter(e => e.department === department);
    if (eventsWithDepartment.length > 0) {
      toast.error(`Cannot delete department. ${eventsWithDepartment.length} event(s) are using it.`);
      return;
    }
    setDepartments(prev => prev.filter(d => d !== department));
    toast.success('Department deleted successfully!');
  };

  // Organizer Management
  const addOrganizer = (organizer: string) => {
    if (organizers.includes(organizer)) {
      toast.error('Organizer/Society already exists!');
      return;
    }
    setOrganizers(prev => [...prev, organizer]);
    toast.success('Organizer added successfully!');
  };

  const deleteOrganizer = (organizer: string) => {
    const eventsWithOrganizer = events.filter(e => e.organizer === organizer);
    if (eventsWithOrganizer.length > 0) {
      toast.error(`Cannot delete organizer. ${eventsWithOrganizer.length} event(s) are using it.`);
      return;
    }
    setOrganizers(prev => prev.filter(o => o !== organizer));
    toast.success('Organizer deleted successfully!');
  };

  return (
    <EventContext.Provider value={{ 
      events,
      categories,
      departments,
      organizers,
      addEvent, 
      updateEvent, 
      deleteEvent, 
      toggleInterested, 
      toggleGoing,
      getEventById,
      addCategory,
      deleteCategory,
      addDepartment,
      deleteDepartment,
      addOrganizer,
      deleteOrganizer
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
