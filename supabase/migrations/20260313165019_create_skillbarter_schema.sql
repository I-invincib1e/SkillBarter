/*
  # SkillBarter Database Schema

  ## Overview
  Complete schema for a credit-based student skill exchange platform.
  Students can offer help, request help, and exchange credits for sessions.

  ## Tables Created

  1. `profiles` - Extended user profiles
    - Links to Supabase auth.users
    - Stores name, bio, university, skills, ratings, streak data

  2. `wallets` - User credit balances
    - Tracks available, locked, earned, and spent credits
    - Auto-created on user signup with 10 credit bonus

  3. `categories` - Skill categories with credit ranges
    - Predefined categories like Quick Help, Teaching Session, etc.

  4. `listings` - Help offerings by users
    - Tied to categories with pricing within allowed ranges

  5. `requests` - Help requests from users
    - Open requests that others can accept

  6. `sessions` - Booked sessions between users
    - Tracks status, dual confirmation, credits

  7. `credit_locks` - Locked credits during pending sessions
    - Ensures credits are reserved until session completes

  8. `reviews` - Post-session ratings and comments

  9. `badges` - Available achievement badges

  10. `user_badges` - Earned badges by users

  11. `transactions` - Credit transaction history

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Public read access for listings, requests, profiles
*/

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  email text,
  bio text DEFAULT '',
  university text DEFAULT '',
  avatar_url text DEFAULT '',
  skills_offered text[] DEFAULT '{}',
  rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  sessions_completed integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_session_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance integer NOT NULL DEFAULT 10,
  locked_credits integer NOT NULL DEFAULT 0,
  total_earned integer NOT NULL DEFAULT 10,
  total_spent integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert wallets"
  ON wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  min_credits integer NOT NULL DEFAULT 1,
  max_credits integer NOT NULL DEFAULT 20,
  icon_name text DEFAULT 'HelpCircle',
  color text DEFAULT '#4F46E5',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Seed categories
INSERT INTO categories (name, slug, description, min_credits, max_credits, icon_name, color) VALUES
  ('Quick Help', 'quick-help', 'Fast answers and quick assistance', 2, 5, 'Zap', '#FB923C'),
  ('Teaching Session', 'teaching-session', 'In-depth teaching and tutoring', 8, 12, 'GraduationCap', '#4F46E5'),
  ('Notes Creation', 'notes-creation', 'Study notes and summaries', 10, 15, 'FileText', '#22C55E'),
  ('Resume Review', 'resume-review', 'CV and resume feedback', 4, 7, 'FileCheck', '#3B82F6'),
  ('Mock Interview', 'mock-interview', 'Practice interviews with feedback', 6, 10, 'Users', '#8B5CF6'),
  ('Project Collaboration', 'project-collaboration', 'Work together on projects', 5, 10, 'Code', '#EC4899')
ON CONFLICT (slug) DO NOTHING;

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text DEFAULT '',
  price_credits integer NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  location_type text NOT NULL DEFAULT 'online' CHECK (location_type IN ('online', 'offline', 'both')),
  availability text DEFAULT '',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'deleted')),
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are viewable by everyone"
  ON listings FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can insert own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text DEFAULT '',
  credits_offered integer NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Open requests are viewable by everyone"
  ON requests FOR SELECT
  USING (status = 'open' OR auth.uid() = user_id);

CREATE POLICY "Users can insert own requests"
  ON requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests"
  ON requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own requests"
  ON requests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  request_id uuid REFERENCES requests(id) ON DELETE SET NULL,
  provider_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_time timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  credits_amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  provider_confirmed boolean DEFAULT false,
  requester_confirmed boolean DEFAULT false,
  provider_confirmed_at timestamptz,
  requester_confirmed_at timestamptz,
  message text DEFAULT '',
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = provider_id OR auth.uid() = requester_id);

CREATE POLICY "Users can insert sessions as requester"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Session participants can update"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = provider_id OR auth.uid() = requester_id)
  WITH CHECK (auth.uid() = provider_id OR auth.uid() = requester_id);

-- Credit locks table
CREATE TABLE IF NOT EXISTS credit_locks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  credits integer NOT NULL,
  status text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'released', 'transferred')),
  created_at timestamptz DEFAULT now(),
  released_at timestamptz
);

ALTER TABLE credit_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit locks"
  ON credit_locks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit locks"
  ON credit_locks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit locks"
  ON credit_locks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert reviews for completed sessions"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  icon text DEFAULT 'Award',
  color text DEFAULT '#FB923C',
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (true);

-- Seed badges
INSERT INTO badges (name, slug, description, icon, color, requirement_type, requirement_value) VALUES
  ('First Session', 'first-session', 'Completed your first session', 'Star', '#FB923C', 'sessions_completed', 1),
  ('Helper 10', 'helper-10', 'Completed 10 sessions', 'Award', '#4F46E5', 'sessions_completed', 10),
  ('Helper 50', 'helper-50', 'Completed 50 sessions', 'Trophy', '#22C55E', 'sessions_completed', 50),
  ('7 Day Streak', '7-day-streak', 'Maintained a 7 day streak', 'Flame', '#F97316', 'streak', 7),
  ('30 Day Streak', '30-day-streak', 'Maintained a 30 day streak', 'Flame', '#EF4444', 'streak', 30),
  ('Rising Star', 'rising-star', 'Achieved 4.5+ rating', 'TrendingUp', '#8B5CF6', 'rating', 45),
  ('Top Rated', 'top-rated', 'Achieved 4.8+ rating', 'Crown', '#EAB308', 'rating', 48),
  ('Early Adopter', 'early-adopter', 'Joined in the early days', 'Rocket', '#EC4899', 'early_adopter', 1)
ON CONFLICT (slug) DO NOTHING;

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User badges are viewable by everyone"
  ON user_badges FOR SELECT
  USING (true);

CREATE POLICY "System can insert user badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  other_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  credits integer NOT NULL,
  type text NOT NULL CHECK (type IN ('signup_bonus', 'earn', 'spend', 'refund', 'lock', 'unlock')),
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), NEW.email);
  
  INSERT INTO wallets (user_id, balance, total_earned)
  VALUES (NEW.id, 10, 10);
  
  INSERT INTO transactions (user_id, credits, type, description)
  VALUES (NEW.id, 10, 'signup_bonus', 'Welcome bonus credits');
  
  INSERT INTO user_badges (user_id, badge_id)
  SELECT NEW.id, id FROM badges WHERE slug = 'early-adopter';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user rating after review
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviewed_user_id = NEW.reviewed_user_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviewed_user_id = NEW.reviewed_user_id)
  WHERE id = NEW.reviewed_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for rating update
DROP TRIGGER IF EXISTS on_review_created ON reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_sessions_provider_id ON sessions(provider_id);
CREATE INDEX IF NOT EXISTS idx_sessions_requester_id ON sessions(requester_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);