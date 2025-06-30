export interface UserProfile {
  id: string;
  username: string | null;
  is_moderator: boolean;
  created_at: string;
  updated_at: string;
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