-- Update events table to allow 'upcoming' status
ALTER TABLE public.events 
DROP CONSTRAINT IF EXISTS events_status_check;

-- No constraint needed as we're using text type, just update any documentation