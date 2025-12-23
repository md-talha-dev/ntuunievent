import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { isEventPast } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import EventCard from '@/components/events/EventCard';
import { Calendar, Users, Star, ArrowRight, Sparkles } from 'lucide-react';

const Index: React.FC = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();

  // Get featured events (top 3 upcoming events with most interest)
  const featuredEvents = events
    .filter(e => !isEventPast(e.date) && e.status === 'active')
    .sort((a, b) => (b.interestedCount + b.goingCount) - (a.interestedCount + a.goingCount))
    .slice(0, 3);

  const stats = {
    totalEvents: events.filter(e => !isEventPast(e.date)).length,
    totalStudents: 4500,
    totalOrganizers: 15
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Discover Campus Events
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
              Your Gateway to
              <span className="text-gradient-primary"> Campus Life</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Discover, join, and create memorable experiences at National Textile University. 
              From workshops to cultural nights, find events that match your interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              {user ? (
                <Link to="/events">
                  <Button variant="hero" size="xl">
                    Browse Events
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="hero" size="xl">
                      Get Started
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="xl">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalEvents}+</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-success/10 mb-3">
                <Users className="h-6 w-6 text-success" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalStudents.toLocaleString()}+</p>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/20 mb-3">
                <Star className="h-6 w-6 text-accent-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalOrganizers}+</p>
              <p className="text-sm text-muted-foreground">Organizers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Featured Events
                </h2>
                <p className="text-muted-foreground">
                  Don't miss out on these popular upcoming events
                </p>
              </div>
              <Link to={user ? "/events" : "/login"}>
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, index) => (
                <div 
                  key={event.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-slide-up"
                >
                  <EventCard 
                    event={event} 
                    onViewDetails={() => navigate(user ? '/events' : '/login')}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero border-t border-border">
        <div className="container">
          <Card className="bg-gradient-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
              <div className="relative">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  Ready to Explore Campus Events?
                </h2>
                <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                  Join thousands of NTU students discovering and participating in amazing campus events every week.
                </p>
                <Link to={user ? "/events" : "/login"}>
                  <Button variant="accent" size="xl">
                    {user ? 'Browse Events' : 'Sign In Now'}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-gradient-hero">
        <div className="container">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">UniEvent</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 UniEvent - National Textile University. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              VibeCoded/Developed by Talha AR
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
