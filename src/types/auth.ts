export interface UserProfile {
  id: string;
  username: string | null;
  is_moderator: boolean;
  created_at: string;
  updated_at: string;
  bio?: string;
  location?: string;
  website?: string;
  birth_date?: string;
  phone?: string;
  avatar_url?: string;
  privacy_email?: boolean;
  privacy_profile?: boolean;
  notifications_email?: boolean;
  notifications_push?: boolean;
  twitter_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  facebook_url?: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_item_id: number;
  reported_item_type: 'post' | 'comment';
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface ReportInput {
  reported_item_id: number;
  reported_item_type: 'post' | 'comment';
  reason: string;
}