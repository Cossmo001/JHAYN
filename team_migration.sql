-- Run this snippet in Supabase SQL editor to add the team_name column:
ALTER TABLE public.profiles ADD COLUMN team_name text;

-- Update the new_user trigger to save the team name:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, team_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'team_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
