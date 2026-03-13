/*
  # Add Review Rating Trigger and Streak Update Trigger

  1. New Functions
    - `update_profile_rating_on_review()` - Automatically recalculates a user's
      average rating and total_reviews count whenever a new review is inserted.
    - `update_streak_on_session_complete()` - Automatically updates current_streak,
      longest_streak, and last_session_date when a session is completed.

  2. New Triggers
    - `on_review_inserted` on reviews table (AFTER INSERT)
    - `on_session_completed` on sessions table (AFTER UPDATE of status)

  3. Security
    - Both functions use SECURITY DEFINER with explicit search_path
    - Error handling included to prevent cascading failures
*/

-- Function to recalculate profile rating when a review is submitted
CREATE OR REPLACE FUNCTION public.update_profile_rating_on_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating numeric;
  review_count integer;
BEGIN
  SELECT AVG(rating)::numeric(3,2), COUNT(*)
  INTO avg_rating, review_count
  FROM public.reviews
  WHERE reviewed_user_id = NEW.reviewed_user_id;

  UPDATE public.profiles
  SET rating = COALESCE(avg_rating, 0),
      total_reviews = COALESCE(review_count, 0),
      updated_at = now()
  WHERE id = NEW.reviewed_user_id;

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error in update_profile_rating_on_review: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger: fire after every review insert
DROP TRIGGER IF EXISTS on_review_inserted ON public.reviews;
CREATE TRIGGER on_review_inserted
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_rating_on_review();

-- Function to update streaks when a session is marked completed
CREATE OR REPLACE FUNCTION public.update_streak_on_session_complete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_ids uuid[];
  uid uuid;
  last_date date;
  cur_streak integer;
  max_streak integer;
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    user_ids := ARRAY[NEW.provider_id, NEW.requester_id];

    FOREACH uid IN ARRAY user_ids LOOP
      SELECT last_session_date, current_streak, longest_streak
      INTO last_date, cur_streak, max_streak
      FROM public.profiles
      WHERE id = uid;

      IF last_date IS NULL OR (CURRENT_DATE - last_date) > 1 THEN
        cur_streak := 1;
      ELSIF (CURRENT_DATE - last_date) = 1 THEN
        cur_streak := cur_streak + 1;
      END IF;

      IF cur_streak > max_streak THEN
        max_streak := cur_streak;
      END IF;

      UPDATE public.profiles
      SET current_streak = cur_streak,
          longest_streak = max_streak,
          last_session_date = CURRENT_DATE,
          updated_at = now()
      WHERE id = uid;
    END LOOP;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error in update_streak_on_session_complete: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger: fire after session status changes
DROP TRIGGER IF EXISTS on_session_completed ON public.sessions;
CREATE TRIGGER on_session_completed
  AFTER UPDATE OF status ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_streak_on_session_complete();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.update_profile_rating_on_review() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_profile_rating_on_review() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_streak_on_session_complete() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_streak_on_session_complete() TO authenticated;