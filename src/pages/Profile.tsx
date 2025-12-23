import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import Header from '@/components/layout/Header';
import EventCard from '@/components/events/EventCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Heart, 
  CalendarCheck, 
  Sparkles
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, profile, isLoading } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const interestedEvents = useMemo(() => {
    return events.filter(event => event.userInterested);
  }, [events]);

  const goingEvents = useMemo(() => {
    return events.filter(event => event.userGoing);
  }, [events]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  if (!user) return null;

  const displayName = profile?.name || user.email?.split('@')[0] || 'User';
  const displayEmail = profile?.email || user.email || '';
  const displayRole = profile?.role || 'student';

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-primary/30 shadow-xl shadow-primary/20">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-primary shadow-lg animate-float">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {displayName}
          </h1>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{displayEmail}</span>
          </div>
          
          <Badge className="bg-gradient-primary text-primary-foreground border-0 capitalize px-4 py-1">
            {displayRole}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
          <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="p-2 rounded-xl bg-info shadow-lg group-hover:scale-110 transition-transform">
                  <Heart className="h-4 w-4 text-info-foreground" />
                </div>
                Interested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{interestedEvents.length}</p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="p-2 rounded-xl bg-success shadow-lg group-hover:scale-110 transition-transform">
                  <CalendarCheck className="h-4 w-4 text-success-foreground" />
                </div>
                Going
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{goingEvents.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="interested" className="animate-fade-in">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="interested" className="gap-2">
              <Heart className="h-4 w-4" />
              Interested ({interestedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="going" className="gap-2">
              <CalendarCheck className="h-4 w-4" />
              Going ({goingEvents.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="interested">
            {interestedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-muted to-info/10 flex items-center justify-center mb-4 shadow-xl animate-float">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  No interested events yet
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Browse events and mark ones you're interested in to see them here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interestedEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="going">
            {goingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-muted to-success/10 flex items-center justify-center mb-4 shadow-xl animate-float">
                  <CalendarCheck className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  No events you're attending
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  RSVP to events to see your confirmed attendance here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goingEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
