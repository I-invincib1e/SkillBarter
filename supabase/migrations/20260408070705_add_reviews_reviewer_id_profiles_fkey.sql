/*
  # Add reviews -> profiles foreign key

  1. Changes
    - Add explicit FK `reviews_reviewer_id_profiles_fkey` from `reviews.reviewer_id` to `profiles.id`
    - Add explicit FK `reviews_reviewed_user_id_profiles_fkey` from `reviews.reviewed_user_id` to `profiles.id`
  2. Purpose
    - Enables PostgREST joins like `profiles!reviews_reviewer_id_profiles_fkey(name, avatar_url)`
    - Consistent with the pattern used for sessions, listings, and requests tables
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_reviewer_id_profiles_fkey'
  ) THEN
    ALTER TABLE reviews
      ADD CONSTRAINT reviews_reviewer_id_profiles_fkey
      FOREIGN KEY (reviewer_id) REFERENCES profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_reviewed_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE reviews
      ADD CONSTRAINT reviews_reviewed_user_id_profiles_fkey
      FOREIGN KEY (reviewed_user_id) REFERENCES profiles(id);
  END IF;
END $$;
