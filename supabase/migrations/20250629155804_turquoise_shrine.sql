/*
  # Create communities and posts tables

  1. New Tables
    - `communities`
      - `id` (integer, primary key, auto-increment)
      - `name` (text, not null)
      - `description` (text)
      - `created_at` (timestamp with timezone, default now())
    - `posts` (if not exists)
      - `id` (integer, primary key, auto-increment)
      - `title` (text, not null)
      - `content` (text)
      - `community_id` (integer, foreign key to communities)
      - `created_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read and create data
    - Add policy for users to update/delete their own posts

  3. Indexes
    - Add index on community_id for posts table for better query performance
*/

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Communities policies
CREATE POLICY "Anyone can read communities"
  ON communities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create communities"
  ON communities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Posts policies
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communities_created_at ON communities(created_at DESC);