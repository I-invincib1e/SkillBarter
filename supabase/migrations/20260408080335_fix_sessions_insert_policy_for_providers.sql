/*
  # Fix sessions INSERT policy to allow providers

  1. Changes
    - Drop the existing INSERT policy that only allows requester inserts
    - Create a new INSERT policy allowing inserts when the user is either
      the requester OR the provider

  2. Reason
    - When a user accepts a skill request, they become the provider
      and need to insert a session where provider_id = auth.uid()
    - The old policy only checked requester_id, blocking provider-initiated sessions
*/

DROP POLICY IF EXISTS "Users can insert sessions as requester" ON sessions;

CREATE POLICY "Users can insert sessions as participant"
  ON sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    requester_id = auth.uid() OR provider_id = auth.uid()
  );
