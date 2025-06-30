/*
  # Add profile onboarding fields

  1. Schema Changes
    - Add `role_age_range` column to profiles table for user role/age selection
    - Add `fun_introduction` column to profiles table for creative user introduction

  2. Security
    - Maintain existing RLS policies
    - Ensure users can update their own profile data including new fields

  3. Data Validation
    - Add constraint for role_age_range to ensure valid values
    - Add length constraint for fun_introduction
*/

-- Add new columns to profiles table
DO $$
BEGIN
  -- Role & Age Range field
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role_age_range') THEN
    ALTER TABLE profiles ADD COLUMN role_age_range TEXT;
  END IF;
  
  -- Fun Introduction field
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'fun_introduction') THEN
    ALTER TABLE profiles ADD COLUMN fun_introduction TEXT;
  END IF;
END $$;

-- Add constraints for data validation
DO $$
BEGIN
  -- Role & Age Range validation
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_role_age_range_check') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_age_range_check 
    CHECK (role_age_range IS NULL OR role_age_range IN ('Older Adult (55+)', 'Family Member', 'Caregiver'));
  END IF;
  
  -- Fun Introduction length limit
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_fun_introduction_length') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_fun_introduction_length 
    CHECK (fun_introduction IS NULL OR length(fun_introduction) <= 200);
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role_age_range ON profiles(role_age_range);