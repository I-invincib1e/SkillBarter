/*
  # Add Extended Profile Fields for Settings Hub

  1. New Columns on `profiles`
    - `tagline` (text, max 60 chars) - Short hook displayed publicly
    - `skills_wanted` (text[]) - Skills the user wants to learn (wishlist)
    - `github_url` (text) - GitHub profile link
    - `linkedin_url` (text) - LinkedIn profile link
    - `website_url` (text) - Personal website link
    - `timezone` (text) - User's timezone
    - `preferred_communication` (text) - Preferred session communication method
    - `availability_status` (text) - Whether user is active for barter or busy

  2. Important Notes
    - All columns have sensible defaults
    - No data is deleted or modified
    - CHECK constraints on preferred_communication and availability_status
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'tagline'
  ) THEN
    ALTER TABLE profiles ADD COLUMN tagline text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'skills_wanted'
  ) THEN
    ALTER TABLE profiles ADD COLUMN skills_wanted text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'github_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN github_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'linkedin_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN linkedin_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN website_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN timezone text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'preferred_communication'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_communication text DEFAULT 'in_platform'
      CHECK (preferred_communication IN ('discord', 'zoom', 'in_platform'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'availability_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN availability_status text DEFAULT 'active'
      CHECK (availability_status IN ('active', 'busy'));
  END IF;
END $$;
