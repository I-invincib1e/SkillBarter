/*
  # Fix mutable search_path on security-sensitive functions

  1. Security
    - Sets an immutable `search_path = public, pg_temp` on the five
      SECURITY DEFINER / business-logic functions flagged by the Supabase
      linter. This prevents a low-privileged caller from creating shadow
      objects in another schema (e.g. `pg_temp.profiles`) and having the
      function resolve to those objects instead of the intended public ones.

  2. Functions hardened
    - public.book_session(uuid, uuid, uuid, timestamptz, int, int, text)
    - public.complete_session(uuid, uuid)
    - public.cancel_session(uuid, uuid)
    - public.accept_request(uuid, uuid, timestamptz)
    - public.award_badges(uuid)

  3. Notes
    - Uses ALTER FUNCTION ... SET search_path, which is non-destructive:
      function bodies, signatures, ownership and grants are unchanged.
    - The "Leaked Password Protection" warning must be toggled in the
      Supabase Dashboard (Authentication → Policies → Password strength
      → "Prevent use of leaked passwords"). It cannot be enabled via SQL.
*/

ALTER FUNCTION public.book_session(uuid, uuid, uuid, timestamptz, integer, integer, text)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.complete_session(uuid, uuid)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.cancel_session(uuid, uuid)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.accept_request(uuid, uuid, timestamptz)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.award_badges(uuid)
  SET search_path = public, pg_temp;
