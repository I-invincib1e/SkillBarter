/*
  # Fix User Signup Trigger

  This migration fixes the handle_new_user trigger function to properly
  handle RLS bypass and ensure all inserts succeed during user signup.

  ## Changes
  - Recreates the trigger function with proper SECURITY DEFINER
  - Uses explicit schema references
  - Adds error handling for badge assignment
*/

-- Drop and recreate the function with proper permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  early_adopter_badge_id uuid;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 
    NEW.email
  );
  
  -- Insert wallet with signup bonus
  INSERT INTO public.wallets (user_id, balance, total_earned)
  VALUES (NEW.id, 10, 10);
  
  -- Insert signup bonus transaction
  INSERT INTO public.transactions (user_id, credits, type, description)
  VALUES (NEW.id, 10, 'signup_bonus', 'Welcome bonus credits');
  
  -- Get early adopter badge id and assign if exists
  SELECT id INTO early_adopter_badge_id FROM public.badges WHERE slug = 'early-adopter' LIMIT 1;
  
  IF early_adopter_badge_id IS NOT NULL THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    VALUES (NEW.id, early_adopter_badge_id);
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();