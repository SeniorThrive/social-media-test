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

  4. Functions
    - Add get_posts_with_counts function for fetching posts with vote/comment counts
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

-- Create comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create votes table if it doesn't exist
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 for downvote, 1 for upvote
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

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

-- Comments policies
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Anyone can read votes"
  ON votes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communities_created_at ON communities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_votes_post_id ON votes(post_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_post ON votes(user_id, post_id);

-- Create the get_posts_with_counts function
CREATE OR REPLACE FUNCTION get_posts_with_counts()
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  content TEXT,
  community_id INTEGER,
  user_id UUID,
  created_at TIMESTAMPTZ,
  community_name TEXT,
  vote_count BIGINT,
  comment_count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    p.title,
    p.content,
    p.community_id,
    p.user_id,
    p.created_at,
    c.name as community_name,
    COALESCE(SUM(v.vote_type), 0) as vote_count,
    COUNT(DISTINCT cm.id) as comment_count
  FROM posts p
  LEFT JOIN communities c ON p.community_id = c.id
  LEFT JOIN votes v ON p.id = v.post_id
  LEFT JOIN comments cm ON p.id = cm.post_id
  GROUP BY p.id, p.title, p.content, p.community_id, p.user_id, p.created_at, c.name
  ORDER BY p.created_at DESC;
$$;