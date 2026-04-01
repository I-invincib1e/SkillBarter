/*
  # Add profile foreign keys for requests and listings

  1. Changes
    - Add FK from `requests.user_id` to `profiles.id` so PostgREST can resolve
      joins like `profiles!requests_user_id_fkey(*)`
    - Add FK from `listings.user_id` to `profiles.id` so PostgREST can resolve
      joins like `profiles!listings_user_id_fkey(*)`

  2. Notes
    - Mirrors the pattern used in the sessions table migration
      (20260318072923_add_sessions_profile_fkeys.sql)
    - These are additional FKs alongside the existing auth.users FKs
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'requests_user_id_profiles_fkey'
      AND table_name = 'requests'
  ) THEN
    ALTER TABLE requests
      ADD CONSTRAINT requests_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'listings_user_id_profiles_fkey'
      AND table_name = 'listings'
  ) THEN
    ALTER TABLE listings
      ADD CONSTRAINT listings_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id);
  END IF;
END $$;
