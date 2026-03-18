/*
  # Add foreign keys from sessions to profiles

  1. Changes
    - Add foreign key constraint `sessions_provider_id_profiles_fkey` from `sessions.provider_id` to `profiles.id`
    - Add foreign key constraint `sessions_requester_id_profiles_fkey` from `sessions.requester_id` to `profiles.id`

  2. Purpose
    - Enables PostgREST (Supabase) to resolve joins like `profiles!sessions_provider_id_profiles_fkey(name, avatar_url)`
    - The Dashboard page needs these joins to display session participant names and avatars
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'sessions_provider_id_profiles_fkey'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.sessions
      ADD CONSTRAINT sessions_provider_id_profiles_fkey
      FOREIGN KEY (provider_id) REFERENCES public.profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'sessions_requester_id_profiles_fkey'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.sessions
      ADD CONSTRAINT sessions_requester_id_profiles_fkey
      FOREIGN KEY (requester_id) REFERENCES public.profiles(id);
  END IF;
END $$;