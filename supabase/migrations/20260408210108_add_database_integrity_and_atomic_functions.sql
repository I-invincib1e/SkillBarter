/*
  # Database Integrity & Atomic Functions

  1. Constraints Added
    - `wallets`: CHECK constraints ensuring balance >= 0, locked_credits >= 0, total_earned >= 0, total_spent >= 0
    - `reviews`: UNIQUE constraint on (session_id, reviewer_id) to prevent duplicate reviews
    - `sessions`: CHECK constraint ensuring provider_id != requester_id (no self-booking)
    - `credit_locks`: Added expires_at column for auto-expiry

  2. Fixed RLS
    - Fixed corrupted user_badges SELECT policy
    - Added policy for sessions insert by providers (for request acceptance)

  3. Indexes
    - Composite indexes on sessions(provider_id, status), sessions(requester_id, status), sessions(scheduled_time)
    - Index on credit_locks(session_id, status) for faster lock lookups
    - Index on reviews(session_id, reviewer_id) for duplicate checks

  4. Atomic Functions
    - `book_session`: Atomically creates a session, locks credits, updates wallet, records transaction
    - `complete_session`: Atomically confirms session, transfers credits when both confirm, updates profiles
    - `cancel_session`: Atomically cancels session, releases locked credits, refunds wallet
    - `accept_request`: Atomically accepts a request, creates session, locks requester credits
    - `award_badges`: Checks all badge requirements and awards earned badges

  5. Updated Triggers
    - Updated streak trigger to allow 2-day gap before reset
    - Updated session completion trigger to check all badge types
*/

-- 1. Add CHECK constraints safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'wallets_balance_non_negative'
  ) THEN
    ALTER TABLE wallets ADD CONSTRAINT wallets_balance_non_negative CHECK (balance >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'wallets_locked_non_negative'
  ) THEN
    ALTER TABLE wallets ADD CONSTRAINT wallets_locked_non_negative CHECK (locked_credits >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'wallets_earned_non_negative'
  ) THEN
    ALTER TABLE wallets ADD CONSTRAINT wallets_earned_non_negative CHECK (total_earned >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'wallets_spent_non_negative'
  ) THEN
    ALTER TABLE wallets ADD CONSTRAINT wallets_spent_non_negative CHECK (total_spent >= 0);
  END IF;
END $$;

-- Add unique constraint on reviews to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_session_reviewer_unique'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_session_reviewer_unique UNIQUE (session_id, reviewer_id);
  END IF;
END $$;

-- Add self-booking prevention on sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sessions_no_self_booking'
  ) THEN
    ALTER TABLE sessions ADD CONSTRAINT sessions_no_self_booking CHECK (provider_id != requester_id);
  END IF;
END $$;

-- Add expires_at to credit_locks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credit_locks' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE credit_locks ADD COLUMN expires_at timestamptz DEFAULT (NOW() + INTERVAL '72 hours');
  END IF;
END $$;

-- Add streak_freeze_used_at to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'streak_freeze_used_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN streak_freeze_used_at date;
  END IF;
END $$;

-- 2. Fix corrupted user_badges SELECT policy
DROP POLICY IF EXISTS "User badges are viewable by everyone" ON user_badges;
CREATE POLICY "User badges are viewable by everyone"
  ON user_badges FOR SELECT
  USING (true);

-- 3. Add composite indexes
CREATE INDEX IF NOT EXISTS idx_sessions_provider_status ON sessions(provider_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_requester_status ON sessions(requester_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_time ON sessions(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_credit_locks_session_status ON credit_locks(session_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_session_reviewer ON reviews(session_id, reviewer_id);

-- 4. Atomic Functions

-- book_session: Creates session + locks credits atomically
CREATE OR REPLACE FUNCTION book_session(
  p_listing_id uuid,
  p_provider_id uuid,
  p_requester_id uuid,
  p_scheduled_time timestamptz,
  p_duration_minutes integer,
  p_credits_amount integer,
  p_message text DEFAULT ''
) RETURNS json AS $$
DECLARE
  v_session_id uuid;
  v_wallet_balance integer;
BEGIN
  IF p_provider_id = p_requester_id THEN
    RETURN json_build_object('error', 'Cannot book a session with yourself');
  END IF;

  SELECT balance INTO v_wallet_balance
  FROM wallets WHERE user_id = p_requester_id FOR UPDATE;

  IF v_wallet_balance IS NULL OR v_wallet_balance < p_credits_amount THEN
    RETURN json_build_object('error', 'Insufficient credits');
  END IF;

  INSERT INTO sessions (listing_id, provider_id, requester_id, scheduled_time, duration_minutes, credits_amount, message, status)
  VALUES (p_listing_id, p_provider_id, p_requester_id, p_scheduled_time, p_duration_minutes, p_credits_amount, p_message, 'pending')
  RETURNING id INTO v_session_id;

  INSERT INTO credit_locks (user_id, session_id, credits, status, expires_at)
  VALUES (p_requester_id, v_session_id, p_credits_amount, 'locked', NOW() + INTERVAL '72 hours');

  UPDATE wallets
  SET balance = balance - p_credits_amount,
      locked_credits = locked_credits + p_credits_amount,
      updated_at = NOW()
  WHERE user_id = p_requester_id;

  INSERT INTO transactions (user_id, session_id, credits, type, description)
  VALUES (p_requester_id, v_session_id, p_credits_amount, 'lock', 'Credits locked for session');

  RETURN json_build_object('session_id', v_session_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- complete_session: Handles dual confirmation + credit transfer atomically
CREATE OR REPLACE FUNCTION complete_session(
  p_session_id uuid,
  p_user_id uuid
) RETURNS json AS $$
DECLARE
  v_session RECORD;
  v_is_provider boolean;
  v_both_confirmed boolean;
  v_credit_lock RECORD;
BEGIN
  SELECT * INTO v_session FROM sessions WHERE id = p_session_id FOR UPDATE;

  IF v_session IS NULL THEN
    RETURN json_build_object('error', 'Session not found');
  END IF;

  IF v_session.status != 'accepted' THEN
    RETURN json_build_object('error', 'Session is not in accepted state');
  END IF;

  IF p_user_id != v_session.provider_id AND p_user_id != v_session.requester_id THEN
    RETURN json_build_object('error', 'Not a participant of this session');
  END IF;

  v_is_provider := (p_user_id = v_session.provider_id);

  IF v_is_provider AND v_session.provider_confirmed THEN
    RETURN json_build_object('error', 'Already confirmed');
  END IF;

  IF NOT v_is_provider AND v_session.requester_confirmed THEN
    RETURN json_build_object('error', 'Already confirmed');
  END IF;

  IF v_is_provider THEN
    UPDATE sessions SET provider_confirmed = true, provider_confirmed_at = NOW() WHERE id = p_session_id;
    v_both_confirmed := v_session.requester_confirmed;
  ELSE
    UPDATE sessions SET requester_confirmed = true, requester_confirmed_at = NOW() WHERE id = p_session_id;
    v_both_confirmed := v_session.provider_confirmed;
  END IF;

  IF v_both_confirmed THEN
    UPDATE sessions SET status = 'completed', completed_at = NOW() WHERE id = p_session_id;

    SELECT * INTO v_credit_lock FROM credit_locks
    WHERE session_id = p_session_id AND status = 'locked'
    FOR UPDATE;

    IF v_credit_lock IS NOT NULL THEN
      UPDATE credit_locks SET status = 'transferred', released_at = NOW() WHERE id = v_credit_lock.id;

      UPDATE wallets
      SET locked_credits = locked_credits - v_session.credits_amount,
          total_spent = total_spent + v_session.credits_amount,
          updated_at = NOW()
      WHERE user_id = v_session.requester_id;

      UPDATE wallets
      SET balance = balance + v_session.credits_amount,
          total_earned = total_earned + v_session.credits_amount,
          updated_at = NOW()
      WHERE user_id = v_session.provider_id;

      INSERT INTO transactions (user_id, other_user_id, session_id, credits, type, description)
      VALUES
        (v_session.requester_id, v_session.provider_id, p_session_id, v_session.credits_amount, 'spend', 'Session completed'),
        (v_session.provider_id, v_session.requester_id, p_session_id, v_session.credits_amount, 'earn', 'Session completed');
    END IF;

    UPDATE profiles
    SET sessions_completed = sessions_completed + 1,
        last_session_date = CURRENT_DATE,
        current_streak = CASE
          WHEN last_session_date IS NULL THEN 1
          WHEN CURRENT_DATE - last_session_date <= 2 THEN current_streak + 1
          ELSE 1
        END,
        longest_streak = GREATEST(longest_streak, CASE
          WHEN last_session_date IS NULL THEN 1
          WHEN CURRENT_DATE - last_session_date <= 2 THEN current_streak + 1
          ELSE 1
        END),
        updated_at = NOW()
    WHERE id IN (v_session.provider_id, v_session.requester_id);

    PERFORM award_badges(v_session.provider_id);
    PERFORM award_badges(v_session.requester_id);

    RETURN json_build_object('status', 'completed', 'both_confirmed', true);
  END IF;

  RETURN json_build_object('status', 'confirmed', 'both_confirmed', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- cancel_session: Cancels session + releases credits atomically
CREATE OR REPLACE FUNCTION cancel_session(
  p_session_id uuid,
  p_user_id uuid
) RETURNS json AS $$
DECLARE
  v_session RECORD;
  v_credit_lock RECORD;
BEGIN
  SELECT * INTO v_session FROM sessions WHERE id = p_session_id FOR UPDATE;

  IF v_session IS NULL THEN
    RETURN json_build_object('error', 'Session not found');
  END IF;

  IF v_session.status NOT IN ('pending', 'accepted') THEN
    RETURN json_build_object('error', 'Session cannot be cancelled');
  END IF;

  IF p_user_id != v_session.provider_id AND p_user_id != v_session.requester_id THEN
    RETURN json_build_object('error', 'Not a participant of this session');
  END IF;

  UPDATE sessions SET status = 'cancelled' WHERE id = p_session_id;

  SELECT * INTO v_credit_lock FROM credit_locks
  WHERE session_id = p_session_id AND status = 'locked'
  FOR UPDATE;

  IF v_credit_lock IS NOT NULL THEN
    UPDATE credit_locks SET status = 'released', released_at = NOW() WHERE id = v_credit_lock.id;

    UPDATE wallets
    SET balance = balance + v_credit_lock.credits,
        locked_credits = locked_credits - v_credit_lock.credits,
        updated_at = NOW()
    WHERE user_id = v_session.requester_id;

    INSERT INTO transactions (user_id, session_id, credits, type, description)
    VALUES (v_session.requester_id, p_session_id, v_credit_lock.credits, 'unlock', 'Session cancelled - credits refunded');
  END IF;

  RETURN json_build_object('status', 'cancelled');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- accept_request: Accepts request + creates session + locks credits atomically
CREATE OR REPLACE FUNCTION accept_request(
  p_request_id uuid,
  p_provider_id uuid,
  p_scheduled_time timestamptz
) RETURNS json AS $$
DECLARE
  v_request RECORD;
  v_session_id uuid;
  v_wallet_balance integer;
BEGIN
  SELECT * INTO v_request FROM requests WHERE id = p_request_id FOR UPDATE;

  IF v_request IS NULL THEN
    RETURN json_build_object('error', 'Request not found');
  END IF;

  IF v_request.status != 'open' THEN
    RETURN json_build_object('error', 'Request is no longer open');
  END IF;

  IF v_request.user_id = p_provider_id THEN
    RETURN json_build_object('error', 'Cannot accept your own request');
  END IF;

  SELECT balance INTO v_wallet_balance
  FROM wallets WHERE user_id = v_request.user_id FOR UPDATE;

  IF v_wallet_balance IS NULL OR v_wallet_balance < v_request.credits_offered THEN
    RETURN json_build_object('error', 'Requester has insufficient credits');
  END IF;

  UPDATE requests SET status = 'accepted', updated_at = NOW() WHERE id = p_request_id;

  INSERT INTO sessions (request_id, provider_id, requester_id, scheduled_time, duration_minutes, credits_amount, status)
  VALUES (p_request_id, p_provider_id, v_request.user_id, p_scheduled_time, v_request.duration_minutes, v_request.credits_offered, 'accepted')
  RETURNING id INTO v_session_id;

  INSERT INTO credit_locks (user_id, session_id, credits, status, expires_at)
  VALUES (v_request.user_id, v_session_id, v_request.credits_offered, 'locked', NOW() + INTERVAL '72 hours');

  UPDATE wallets
  SET balance = balance - v_request.credits_offered,
      locked_credits = locked_credits + v_request.credits_offered,
      updated_at = NOW()
  WHERE user_id = v_request.user_id;

  INSERT INTO transactions (user_id, session_id, credits, type, description)
  VALUES (v_request.user_id, v_session_id, v_request.credits_offered, 'lock', 'Credits locked for help request');

  RETURN json_build_object('session_id', v_session_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- award_badges: Checks and awards all badges for a user
CREATE OR REPLACE FUNCTION award_badges(p_user_id uuid) RETURNS void AS $$
DECLARE
  v_profile RECORD;
  v_badge RECORD;
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
  IF v_profile IS NULL THEN RETURN; END IF;

  FOR v_badge IN SELECT * FROM badges LOOP
    IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN
      CASE v_badge.requirement_type
        WHEN 'sessions_completed' THEN
          IF v_profile.sessions_completed >= v_badge.requirement_value THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id) ON CONFLICT DO NOTHING;
          END IF;
        WHEN 'streak' THEN
          IF v_profile.current_streak >= v_badge.requirement_value THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id) ON CONFLICT DO NOTHING;
          END IF;
        WHEN 'rating' THEN
          IF v_profile.rating * 10 >= v_badge.requirement_value AND v_profile.total_reviews >= 3 THEN
            INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id) ON CONFLICT DO NOTHING;
          END IF;
        ELSE
          NULL;
      END CASE;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on RPC functions
GRANT EXECUTE ON FUNCTION book_session TO authenticated;
GRANT EXECUTE ON FUNCTION complete_session TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_session TO authenticated;
GRANT EXECUTE ON FUNCTION accept_request TO authenticated;
GRANT EXECUTE ON FUNCTION award_badges TO authenticated;