import { Link } from "react-router";
import { Post } from "./PostList";
import { Avatar } from "./ui/Avatar";
import { Typography } from "./ui/Typography";
import { Card } from "./ui/Card";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <Card variant="interactive" className="max-w-sm mx-auto">
      <Link to={`/post/${post.id}`} className="block">
        {/* Post Header */}
        <div className="flex items-center space-x-3 mb-3">
          <Avatar
            src={post.avatar_url}
            alt="User Avatar"
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <Typography variant="body" className="font-medium text-gray-900">
              Anonymous User
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {formatDate(post.created_at)}
            </Typography>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <Typography variant="h3" className="mb-2 line-clamp-2">
            {post.title}
          </Typography>
          <Typography variant="body" className="text-gray-600 line-clamp-3 mb-3">
            {post.content}
          </Typography>
        </div>

        {/* Post Image */}
        {post.image_url && (
          <div className="mb-3 -mx-4">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <Typography variant="caption" className="font-medium">
                {post.like_count ?? 0}
              </Typography>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <Typography variant="caption" className="font-medium">
                {post.comment_count ?? 0}
              </Typography>
            </div>
          </div>
          <Typography variant="caption" className="text-blue-600 font-medium">
            Read more
          </Typography>
        </div>
      </Link>
    </Card>
  );
};