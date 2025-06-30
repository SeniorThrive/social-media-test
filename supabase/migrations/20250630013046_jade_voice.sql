/*
  # Extend profiles table for comprehensive user profiles

  1. Schema Changes
    - Add additional profile fields: bio, location, website, birth_date, phone
    - Add avatar_url for profile photos
    - Add privacy settings: privacy_email, privacy_profile
    - Add notification preferences: notifications_email, notifications_push

  2. Security
    - Maintain existing RLS policies
    - Ensure users can only update their own extended profile data

  3. Storage
    - This assumes an 'avatars' storage bucket exists for profile photos
*/

-- Add new columns to profiles table
DO $$
BEGIN
  -- Basic profile information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
    ALTER TABLE profiles ADD COLUMN bio TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
    ALTER TABLE profiles ADD COLUMN location TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website') THEN
    ALTER TABLE profiles ADD COLUMN website TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'birth_date') THEN
    ALTER TABLE profiles ADD COLUMN birth_date DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
  
  -- Privacy settings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'privacy_email') THEN
    ALTER TABLE profiles ADD COLUMN privacy_email BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'privacy_profile') THEN
    ALTER TABLE profiles ADD COLUMN privacy_profile BOOLEAN DEFAULT false;
  END IF;
  
  -- Notification preferences
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notifications_email') THEN
    ALTER TABLE profiles ADD COLUMN notifications_email BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notifications_push') THEN
    ALTER TABLE profiles ADD COLUMN notifications_push BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add constraints for data validation
DO $$
BEGIN
  -- Website URL validation (basic check)
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_website_format') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_website_format 
    CHECK (website IS NULL OR website ~ '^https?://.*');
  END IF;
  
  -- Bio length limit
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_bio_length') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_bio_length 
    CHECK (bio IS NULL OR length(bio) <= 500);
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_privacy_profile ON profiles(privacy_profile);