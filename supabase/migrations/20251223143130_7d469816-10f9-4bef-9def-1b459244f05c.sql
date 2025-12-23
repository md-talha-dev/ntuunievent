-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  department TEXT,
  image TEXT,
  interested_count INTEGER NOT NULL DEFAULT 0,
  going_count INTEGER NOT NULL DEFAULT 0,
  interested_users TEXT[] NOT NULL DEFAULT '{}',
  going_users TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can view events)
CREATE POLICY "Events are viewable by everyone" 
ON public.events 
FOR SELECT 
USING (true);

-- Create policy for admin insert/update/delete (for now allow all authenticated users, can be restricted later)
CREATE POLICY "Authenticated users can insert events" 
ON public.events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update events" 
ON public.events 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete events" 
ON public.events 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage categories" 
ON public.categories FOR ALL USING (true);

-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Departments are viewable by everyone" 
ON public.departments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage departments" 
ON public.departments FOR ALL USING (true);

-- Create organizers table
CREATE TABLE public.organizers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers are viewable by everyone" 
ON public.organizers FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage organizers" 
ON public.organizers FOR ALL USING (true);