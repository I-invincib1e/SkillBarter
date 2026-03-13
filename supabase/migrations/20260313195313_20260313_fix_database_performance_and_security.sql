/*
  # Fix Database Performance and Security Issues

  1. Foreign Key Indexes
    - Add indexes for all unindexed foreign keys to improve query performance
    - Indexes on credit_locks (session_id, user_id)
    - Indexes on requests (category_id)
    - Indexes on reviews (reviewer_id, session_id)
    - Indexes on sessions (listing_id, request_id)
    - Indexes on transactions (other_user_id, session_id, user_id)
    - Indexes on user_badges (badge_id)

  2. RLS Policy Optimization
    - Replace direct auth.uid() calls with SELECT auth.uid() for better performance
    - Apply to all tables: profiles, wallets, listings, requests, sessions, credit_locks, reviews, user_badges, transactions
    - Prevents re-evaluation for each row

  3. Function Security
    - Remove search_path mutation from update_user_rating function
    - Set explicit search_path to prevent privilege escalation

  Security & Performance Impact:
    - Improved query performance on foreign key lookups
    - Optimized RLS evaluation at scale
    - Better security with immutable function search paths
    - All data integrity maintained
*/

CREATE INDEX IF NOT EXISTS idx_credit_locks_session_id ON credit_locks(session_id);
CREATE INDEX IF NOT EXISTS idx_credit_locks_user_id ON credit_locks(user_id);

CREATE INDEX IF NOT EXISTS idx_requests_category_id ON requests(category_id);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_session_id ON reviews(session_id);

CREATE INDEX IF NOT EXISTS idx_sessions_listing_id ON sessions(listing_id);
CREATE INDEX IF NOT EXISTS idx_sessions_request_id ON sessions(request_id);

CREATE INDEX IF NOT EXISTS idx_transactions_other_user_id ON transactions(other_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_session_id ON transactions(session_id);

CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own wallet" ON wallets;
  CREATE POLICY "Users can view own wallet"
    ON wallets FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can update own wallet" ON wallets;
  CREATE POLICY "Users can update own wallet"
    ON wallets FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "System can insert wallets" ON wallets;
  CREATE POLICY "System can insert wallets"
    ON wallets FOR INSERT
    TO authenticated, service_role
    WITH CHECK (user_id = (SELECT auth.uid()) OR current_user = 'service_role');

  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (id = (SELECT auth.uid()))
    WITH CHECK (id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Active listings are viewable by everyone" ON listings;
  CREATE POLICY "Active listings are viewable by everyone"
    ON listings FOR SELECT
    USING (status = 'active' OR user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can insert own listings" ON listings;
  CREATE POLICY "Users can insert own listings"
    ON listings FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can update own listings" ON listings;
  CREATE POLICY "Users can update own listings"
    ON listings FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can delete own listings" ON listings;
  CREATE POLICY "Users can delete own listings"
    ON listings FOR DELETE
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Open requests are viewable by everyone" ON requests;
  CREATE POLICY "Open requests are viewable by everyone"
    ON requests FOR SELECT
    USING (status = 'open' OR user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can insert own requests" ON requests;
  CREATE POLICY "Users can insert own requests"
    ON requests FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can update own requests" ON requests;
  CREATE POLICY "Users can update own requests"
    ON requests FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can delete own requests" ON requests;
  CREATE POLICY "Users can delete own requests"
    ON requests FOR DELETE
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can view own sessions" ON sessions;
  CREATE POLICY "Users can view own sessions"
    ON sessions FOR SELECT
    TO authenticated
    USING (provider_id = (SELECT auth.uid()) OR requester_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can insert sessions as requester" ON sessions;
  CREATE POLICY "Users can insert sessions as requester"
    ON sessions FOR INSERT
    TO authenticated
    WITH CHECK (requester_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Session participants can update" ON sessions;
  CREATE POLICY "Session participants can update"
    ON sessions FOR UPDATE
    TO authenticated
    USING (provider_id = (SELECT auth.uid()) OR requester_id = (SELECT auth.uid()))
    WITH CHECK (provider_id = (SELECT auth.uid()) OR requester_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can view own credit locks" ON credit_locks;
  CREATE POLICY "Users can view own credit locks"
    ON credit_locks FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can insert own credit locks" ON credit_locks;
  CREATE POLICY "Users can insert own credit locks"
    ON credit_locks FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can update own credit locks" ON credit_locks;
  CREATE POLICY "Users can update own credit locks"
    ON credit_locks FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can insert reviews for completed sessions" ON reviews;
  CREATE POLICY "Users can insert reviews for completed sessions"
    ON reviews FOR INSERT
    TO authenticated
    WITH CHECK (reviewer_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "System can insert user badges" ON user_badges;
  CREATE POLICY "System can insert user badges"
    ON user_badges FOR INSERT
    TO authenticated, service_role
    WITH CHECK (true);

  DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
  CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

  DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
  CREATE POLICY "Users can insert own transactions"
    ON transactions FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;

ALTER FUNCTION update_user_rating SET search_path = public, extensions;
