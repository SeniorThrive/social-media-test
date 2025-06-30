/*
  # Add image_url column to communities table

  1. Schema Changes
    - Add `image_url` column to `communities` table
    - Set default value to empty string for consistency

  2. Security
    - Update existing RLS policies to allow image_url updates
    - Ensure authenticated users can update community images

  3. Storage
    - This migration assumes a 'community-images' storage bucket exists
    - The bucket should be configured with appropriate policies for public read access
*/

-- Add image_url column to communities table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'communities' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE communities ADD COLUMN image_url TEXT DEFAULT '';
  END IF;
END $$;

-- Update the existing policy to allow image_url updates
DROP POLICY IF EXISTS "Authenticated users can create communities" ON communities;
CREATE POLICY "Authenticated users can create communities"
  ON communities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add policy for updating communities (including image_url)
CREATE POLICY "Authenticated users can update communities"
  ON communities
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);