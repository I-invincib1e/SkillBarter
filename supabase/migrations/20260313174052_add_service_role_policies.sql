/*
  # Add Service Role Policies for Trigger Operations

  The signup trigger needs to insert into profiles, wallets, transactions,
  and user_badges tables. Since SECURITY DEFINER functions run with the
  permissions of the function owner, we need policies that allow this.

  ## Changes
  - Add INSERT policies for service_role on all affected tables
  - These policies allow the trigger function to create records during signup
*/

-- Allow service role to insert profiles (for signup trigger)
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to insert wallets (for signup trigger)
DROP POLICY IF EXISTS "Service role can insert wallets" ON wallets;
CREATE POLICY "Service role can insert wallets"
  ON wallets FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to insert transactions (for signup trigger)
DROP POLICY IF EXISTS "Service role can insert transactions" ON transactions;
CREATE POLICY "Service role can insert transactions"
  ON transactions FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to insert user_badges (for signup trigger)
DROP POLICY IF EXISTS "Service role can insert user_badges" ON user_badges;
CREATE POLICY "Service role can insert user_badges"
  ON user_badges FOR INSERT
  TO service_role
  WITH CHECK (true);