import { useState } from "react";
import { Link } from "react-router";
import { Post } from "./PostList";
import { Avatar } from "./ui/Avatar";
import { Typography } from "./ui/Typography";
import { Card } from "./ui/Card";
import { ReportModal } from "./ReportModal";
import { useAuth } from "../context/AuthContext";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <>
      <Card variant="interactive" className="max-w-sm mx-auto group overflow-hidden">
        <Link to={`/post/${post.id}`} className="block">
          {/* Post Image */}
          {post.image_url && (
            <div className="relative overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}

          <div className="p-5">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={post.avatar_url}
                  alt="User Avatar"
                  size="sm"
                  className="ring-2 ring-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <Typography variant="body" className="font-medium text-gray-900 text-sm">
                    Community Member
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 text-xs">
                    {formatDate(post.created_at)}
                  </Typography>
                </div>
              </div>
              
              {/* Report Button */}
              {user && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowReportModal(true);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Report this post"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <Typography variant="h3" className="mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors font-semibold leading-snug">
                {post.title}
              </Typography>
              <Typography variant="body" className="text-gray-600 line-clamp-3 leading-relaxed text-sm">
                {post.content}
              </Typography>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 text-gray-500 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <Typography variant="caption" className="font-medium text-xs">
                    {post.like_count ?? 0}
                  </Typography>
                </div>
                <div className="flex items-center space-x-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <Typography variant="caption" className="font-medium text-xs">
                    {post.comment_count ?? 0}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
                <Typography variant="caption" className="font-medium text-xs">
                  Read more
                </Typography>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </Card>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        itemId={post.id}
        itemType="post"
        itemTitle={post.title}
      />
    </>
  );
};