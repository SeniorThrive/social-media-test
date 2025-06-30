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
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
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

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.origin + `/post/${post.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
    }
  };

  return (
    <>
      <Card variant="glass" className="group card-hover overflow-hidden bg-white/90 backdrop-blur-sm border border-white/20 shadow-modern">
        <Link to={`/post/${post.id}`} className="block">
          {/* Post Image */}
          {post.image_url && (
            <div className="relative overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating action buttons on image */}
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {user && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowReportModal(true);
                    }}
                    className="p-2.5 glass text-gray-700 hover:text-red-500 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-200 hover:scale-110"
                    title="Report this post"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={handleBookmark}
                  className={`p-2.5 glass rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-200 hover:scale-110 ${
                    isBookmarked ? 'text-blue-600 bg-blue-50/80' : 'text-gray-700 hover:text-blue-500'
                  }`}
                  title="Bookmark this post"
                >
                  <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              {/* Gradient overlay for better text readability */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          <div className="p-6">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={post.avatar_url}
                  alt="User Avatar"
                  size="sm"
                  className="ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <Typography variant="body" className="font-semibold text-gray-900 text-sm">
                    Community Member
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 text-xs">
                    {formatDate(post.created_at)}
                  </Typography>
                </div>
              </div>
              
              {/* Enhanced community badge */}
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                Community
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <Typography variant="h3" className="mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors font-bold leading-tight text-lg">
                {post.title}
              </Typography>
              <Typography variant="body" className="text-gray-600 line-clamp-3 leading-relaxed">
                {post.content}
              </Typography>
            </div>

            {/* Enhanced Engagement Actions */}
            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-all duration-200 hover:scale-110 btn-hover-glow ${
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <div className={`p-2 rounded-full transition-all duration-200 ${isLiked ? 'bg-red-50' : 'hover:bg-red-50'}`}>
                    <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <Typography variant="caption" className="font-bold">
                    {(post.like_count ?? 0) + (isLiked ? 1 : 0)}
                  </Typography>
                </button>
                
                <div className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-all duration-200 cursor-pointer hover:scale-110">
                  <div className="p-2 rounded-full hover:bg-blue-50 transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <Typography variant="caption" className="font-bold">
                    {post.comment_count ?? 0}
                  </Typography>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-all duration-200 hover:scale-110 btn-hover-glow"
                >
                  <div className="p-2 rounded-full hover:bg-green-50 transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                </button>
              </div>
              
              <div className="flex items-center space-x-2 text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
                <Typography variant="caption" className="font-bold text-sm">
                  Read more
                </Typography>
                <div className="p-1 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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