import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, EventCategory } from '@/lib/data';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: Event[];
  categories: EventCategory[];
  departments: string[];
  organizers: string[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id' | 'interestedCount' | 'goingCount' | 'createdAt' | 'userInterested' | 'userGoing'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleInterested: (eventId: string) => Promise<void>;
  toggleGoing: (eventId: string) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  addCategory: (category: string) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  addDepartment: (department: string) => Promise<void>;
  deleteDepartment: (department: string) => Promise<void>;
  addOrganizer: (organizer: string) => Promise<void>;
  deleteOrganizer: (organizer: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [organizers, setOrganizers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all data from database
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch user's participation if logged in
      let userParticipation: { event_id: string; status: string }[] = [];
      if (user) {
        const { data: participationData, error: participationError } = await supabase
          .from('event_participants')
          .select('event_id, status')
          .eq('user_id', user.id);

        if (!participationError && participationData) {
          userParticipation = participationData;
        }
      }

      // Transform database events to app format
      const transformedEvents: Event[] = (eventsData || []).map(e => {
        const participation = userParticipation.find(p => p.event_id === e.id);
        return {
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date,
          time: e.time,
          category: e.category as EventCategory,
          location: e.location,
          organizer: e.organizer,
          department: e.department || undefined,
          image: e.image || undefined,
          interestedCount: e.interested_count,
          goingCount: e.going_count,
          status: e.status as 'active' | 'closed',
          createdAt: e.created_at,
          userInterested: participation?.status === 'interested',
          userGoing: participation?.status === 'going'
        };
      });

      setEvents(transformedEvents);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('name')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories((categoriesData || []).map(c => c.name as EventCategory));

      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('name')
        .order('name');

      if (departmentsError) throw departmentsError;
      setDepartments((departmentsData || []).map(d => d.name));

      // Fetch organizers
      const { data: organizersData, error: organizersError } = await supabase
        .from('organizers')
        .select('name')
        .order('name');

      if (organizersError) throw organizersError;
      setOrganizers((organizersData || []).map(o => o.name));

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const refreshEvents = async () => {
    await fetchData();
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'interestedCount' | 'goingCount' | 'createdAt' | 'userInterested' | 'userGoing'>) => {
    try {
      // Check for duplicate
      const duplicate = events.find(
        e => e.title.toLowerCase() === eventData.title.toLowerCase() && e.date === eventData.date
      );
      
      if (duplicate) {
        toast.error('An event with the same title and date already exists.');
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          category: eventData.category,
          location: eventData.location,
          organizer: eventData.organizer,
          department: eventData.department || null,
          image: eventData.image || null,
          status: eventData.status,
          interested_count: 0,
          going_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newEvent: Event = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        category: data.category as EventCategory,
        location: data.location,
        organizer: data.organizer,
        department: data.department || undefined,
        image: data.image || undefined,
        interestedCount: data.interested_count,
        goingCount: data.going_count,
        status: data.status as 'active' | 'closed',
        createdAt: data.created_at,
        userInterested: false,
        userGoing: false
      };

      setEvents(prev => [newEvent, ...prev]);
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to create event');
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      const updateData: Record<string, unknown> = {};
      
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.date !== undefined) updateData.date = eventData.date;
      if (eventData.time !== undefined) updateData.time = eventData.time;
      if (eventData.category !== undefined) updateData.category = eventData.category;
      if (eventData.location !== undefined) updateData.location = eventData.location;
      if (eventData.organizer !== undefined) updateData.organizer = eventData.organizer;
      if (eventData.department !== undefined) updateData.department = eventData.department;
      if (eventData.image !== undefined) updateData.image = eventData.image;
      if (eventData.status !== undefined) updateData.status = eventData.status;
      if (eventData.interestedCount !== undefined) updateData.interested_count = eventData.interestedCount;
      if (eventData.goingCount !== undefined) updateData.going_count = eventData.goingCount;

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => 
        prev.map(event => 
          event.id === id ? { ...event, ...eventData } : event
        )
      );
      toast.success('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const toggleInterested = async (eventId: string) => {
    if (!user) {
      toast.error('Please login to mark interest');
      return;
    }

    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const isCurrentlyInterested = event.userInterested;
      const wasGoing = event.userGoing;

      if (isCurrentlyInterested) {
        // Remove interest
        await supabase
          .from('event_participants')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);

        // Update count
        await supabase
          .from('events')
          .update({ interested_count: Math.max(0, event.interestedCount - 1) })
          .eq('id', eventId);

        setEvents(prev => prev.map(e => 
          e.id === eventId 
            ? { ...e, userInterested: false, interestedCount: Math.max(0, e.interestedCount - 1) }
            : e
        ));
      } else {
        // If was going, update to interested
        if (wasGoing) {
          await supabase
            .from('event_participants')
            .update({ status: 'interested' })
            .eq('event_id', eventId)
            .eq('user_id', user.id);

          // Update counts
          await supabase
            .from('events')
            .update({ 
              interested_count: event.interestedCount + 1,
              going_count: Math.max(0, event.goingCount - 1)
            })
            .eq('id', eventId);

          setEvents(prev => prev.map(e => 
            e.id === eventId 
              ? { 
                  ...e, 
                  userInterested: true, 
                  userGoing: false,
                  interestedCount: e.interestedCount + 1,
                  goingCount: Math.max(0, e.goingCount - 1)
                }
              : e
          ));
        } else {
          // Add new interest
          await supabase
            .from('event_participants')
            .insert({ event_id: eventId, user_id: user.id, status: 'interested' });

          // Update count
          await supabase
            .from('events')
            .update({ interested_count: event.interestedCount + 1 })
            .eq('id', eventId);

          setEvents(prev => prev.map(e => 
            e.id === eventId 
              ? { ...e, userInterested: true, interestedCount: e.interestedCount + 1 }
              : e
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling interested:', error);
      toast.error('Failed to update interest');
    }
  };

  const toggleGoing = async (eventId: string) => {
    if (!user) {
      toast.error('Please login to mark attendance');
      return;
    }

    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const isCurrentlyGoing = event.userGoing;
      const wasInterested = event.userInterested;

      if (isCurrentlyGoing) {
        // Remove going
        await supabase
          .from('event_participants')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);

        // Update count
        await supabase
          .from('events')
          .update({ going_count: Math.max(0, event.goingCount - 1) })
          .eq('id', eventId);

        setEvents(prev => prev.map(e => 
          e.id === eventId 
            ? { ...e, userGoing: false, goingCount: Math.max(0, e.goingCount - 1) }
            : e
        ));
      } else {
        // If was interested, update to going
        if (wasInterested) {
          await supabase
            .from('event_participants')
            .update({ status: 'going' })
            .eq('event_id', eventId)
            .eq('user_id', user.id);

          // Update counts
          await supabase
            .from('events')
            .update({ 
              going_count: event.goingCount + 1,
              interested_count: Math.max(0, event.interestedCount - 1)
            })
            .eq('id', eventId);

          setEvents(prev => prev.map(e => 
            e.id === eventId 
              ? { 
                  ...e, 
                  userGoing: true, 
                  userInterested: false,
                  goingCount: e.goingCount + 1,
                  interestedCount: Math.max(0, e.interestedCount - 1)
                }
              : e
          ));
        } else {
          // Add new going
          await supabase
            .from('event_participants')
            .insert({ event_id: eventId, user_id: user.id, status: 'going' });

          // Update count
          await supabase
            .from('events')
            .update({ going_count: event.goingCount + 1 })
            .eq('id', eventId);

          setEvents(prev => prev.map(e => 
            e.id === eventId 
              ? { ...e, userGoing: true, goingCount: e.goingCount + 1 }
              : e
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling going:', error);
      toast.error('Failed to update attendance');
    }
  };

  const getEventById = (id: string) => events.find(e => e.id === id);

  // Category Management
  const addCategory = async (category: string) => {
    try {
      if (categories.includes(category as EventCategory)) {
        toast.error('Category already exists!');
        return;
      }

      const { error } = await supabase
        .from('categories')
        .insert({ name: category });

      if (error) throw error;

      setCategories(prev => [...prev, category as EventCategory]);
      toast.success('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const deleteCategory = async (category: string) => {
    try {
      const eventsWithCategory = events.filter(e => e.category === category);
      if (eventsWithCategory.length > 0) {
        toast.error(`Cannot delete category. ${eventsWithCategory.length} event(s) are using it.`);
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', category);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c !== category));
      toast.success('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Department Management
  const addDepartment = async (department: string) => {
    try {
      if (departments.includes(department)) {
        toast.error('Department already exists!');
        return;
      }

      const { error } = await supabase
        .from('departments')
        .insert({ name: department });

      if (error) throw error;

      setDepartments(prev => [...prev, department]);
      toast.success('Department added successfully!');
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error('Failed to add department');
    }
  };

  const deleteDepartment = async (department: string) => {
    try {
      const eventsWithDepartment = events.filter(e => e.department === department);
      if (eventsWithDepartment.length > 0) {
        toast.error(`Cannot delete department. ${eventsWithDepartment.length} event(s) are using it.`);
        return;
      }

      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('name', department);

      if (error) throw error;

      setDepartments(prev => prev.filter(d => d !== department));
      toast.success('Department deleted successfully!');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  // Organizer Management
  const addOrganizer = async (organizer: string) => {
    try {
      if (organizers.includes(organizer)) {
        toast.error('Organizer/Society already exists!');
        return;
      }

      const { error } = await supabase
        .from('organizers')
        .insert({ name: organizer });

      if (error) throw error;

      setOrganizers(prev => [...prev, organizer]);
      toast.success('Organizer added successfully!');
    } catch (error) {
      console.error('Error adding organizer:', error);
      toast.error('Failed to add organizer');
    }
  };

  const deleteOrganizer = async (organizer: string) => {
    try {
      const eventsWithOrganizer = events.filter(e => e.organizer === organizer);
      if (eventsWithOrganizer.length > 0) {
        toast.error(`Cannot delete organizer. ${eventsWithOrganizer.length} event(s) are using it.`);
        return;
      }

      const { error } = await supabase
        .from('organizers')
        .delete()
        .eq('name', organizer);

      if (error) throw error;

      setOrganizers(prev => prev.filter(o => o !== organizer));
      toast.success('Organizer deleted successfully!');
    } catch (error) {
      console.error('Error deleting organizer:', error);
      toast.error('Failed to delete organizer');
    }
  };

  return (
    <EventContext.Provider value={{ 
      events,
      categories,
      departments,
      organizers,
      loading,
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
      deleteOrganizer,
      refreshEvents
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
