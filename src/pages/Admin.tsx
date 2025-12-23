import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Event, EventCategory, isEventPast } from '@/lib/data';
import Header from '@/components/layout/Header';
import AdminEventCard from '@/components/admin/AdminEventCard';
import EventForm from '@/components/admin/EventForm';
import ManagementCard from '@/components/admin/ManagementCard';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Calendar, 
  Users, 
  Heart, 
  Check, 
  Search, 
  LayoutGrid,
  Building2,
  Users2,
  Tag,
  Sparkles
} from 'lucide-react';

const Admin: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { 
    events, 
    categories,
    departments,
    organizers,
    addEvent, 
    updateEvent, 
    deleteEvent,
    addCategory,
    deleteCategory,
    addDepartment,
    deleteDepartment,
    addOrganizer,
    deleteOrganizer
  } = useEvents();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-primary animate-pulse shadow-glow" />
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-primary shadow-lg shadow-primary/30 animate-float">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Full control over events, categories, departments & societies
            </p>
          </div>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleAddEvent} 
            className="animate-slide-up shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Add Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Events', value: stats.totalEvents, icon: Calendar, gradient: 'bg-gradient-primary', delay: '0ms' },
            { label: 'Active Events', value: stats.activeEvents, icon: Users, gradient: 'bg-gradient-to-r from-success to-success/70', delay: '100ms' },
            { label: 'Total Interested', value: stats.totalInterested, icon: Heart, gradient: 'bg-gradient-to-r from-info to-info/70', delay: '200ms' },
            { label: 'Total Going', value: stats.totalGoing, icon: Check, gradient: 'bg-gradient-to-r from-accent to-accent/70', delay: '300ms' },
          ].map((stat, index) => (
            <Card 
              key={stat.label}
              className="group animate-slide-up overflow-hidden relative hover:shadow-2xl hover:-translate-y-1 transition-all duration-500" 
              style={{ animationDelay: stat.delay }}
            >
              {/* 3D shadow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${stat.gradient} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <stat.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-3xl font-bold text-foreground group-hover:text-gradient-primary transition-all duration-300">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for different management sections */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="bg-gradient-to-r from-muted via-muted/80 to-muted p-1.5 rounded-xl shadow-lg border border-border/30">
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="manage" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Manage
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6 animate-fade-in">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
                  {categories.map((category) => (
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
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-muted to-primary/10 flex items-center justify-center mb-4 shadow-xl animate-float">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  No events found
                </h3>
                <p className="text-muted-foreground max-w-sm mb-4">
                  No events match your current filters. Try adjusting your search or create a new event.
                </p>
                <Button variant="hero" onClick={handleAddEvent} className="shadow-xl">
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-slide-up"
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
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="manage" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ManagementCard
                title="Categories"
                description="Event types & categories"
                items={categories}
                onAdd={addCategory}
                onDelete={deleteCategory}
                icon={<Tag className="h-5 w-5 text-primary-foreground" />}
                gradient="bg-gradient-primary"
                placeholder="Enter category name..."
              />
              <ManagementCard
                title="Departments"
                description="University departments"
                items={departments}
                onAdd={addDepartment}
                onDelete={deleteDepartment}
                icon={<Building2 className="h-5 w-5 text-primary-foreground" />}
                gradient="bg-gradient-to-r from-info to-info/70"
                placeholder="Enter department name..."
              />
              <ManagementCard
                title="Societies"
                description="Clubs & student societies"
                items={organizers}
                onAdd={addOrganizer}
                onDelete={deleteOrganizer}
                icon={<Users2 className="h-5 w-5 text-primary-foreground" />}
                gradient="bg-gradient-to-r from-success to-success/70"
                placeholder="Enter society name..."
              />
            </div>
          </TabsContent>
        </Tabs>

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
