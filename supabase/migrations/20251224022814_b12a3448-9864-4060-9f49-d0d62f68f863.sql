-- Create function to update event counts securely
CREATE OR REPLACE FUNCTION public.update_event_counts(
  _event_id uuid,
  _interested_delta integer DEFAULT 0,
  _going_delta integer DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET 
    interested_count = GREATEST(0, interested_count + _interested_delta),
    going_count = GREATEST(0, going_count + _going_delta)
  WHERE id = _event_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_event_counts TO authenticated;