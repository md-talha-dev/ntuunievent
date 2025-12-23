import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Event, EventCategory, CATEGORIES, isEventPast } from '@/lib/data';
import Header from '@/components/layout/Header';
import AdminEventCard from '@/components/admin/AdminEventCard';
import EventForm from '@/components/admin/EventForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Users, Heart, Check, Search } from 'lucide-react';

const Admin: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const stats = useMemo(() => {
    const totalEvents = events.length;
    const activeEvents = events.filter(e => e.status === 'active' && !isEventPast(e.date)).length;
    const totalInterested = events.reduce((sum, e) => sum + e.interestedCount, 0);
    const totalGoing = events.reduce((sum, e) => sum + e.goingCount, 0);

    return { totalEvents, activeEvents, totalInterested, totalGoing };
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [events, searchQuery, categoryFilter, statusFilter]);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, data);
    } else {
      addEvent(data);
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage campus events and view statistics
            </p>
          </div>
          <Button variant="hero" size="lg" onClick={handleAddEvent}>
            <Plus className="h-5 w-5" />
            Add Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.totalEvents}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-success" />
                Active Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.activeEvents}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="h-4 w-4 text-info" />
                Total Interested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.totalInterested}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Total Going
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.totalGoing}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as EventCategory | 'all')}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'active' | 'closed')}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No events found
            </h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              No events match your current filters. Try adjusting your search or create a new event.
            </p>
            <Button variant="hero" onClick={handleAddEvent}>
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AdminEventCard
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={deleteEvent}
                />
              </div>
            ))}
          </div>
        )}

        <EventForm
          event={editingEvent}
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingEvent(null);
          }}
          onSubmit={handleFormSubmit}
        />
      </main>
    </div>
  );
};

export default Admin;
