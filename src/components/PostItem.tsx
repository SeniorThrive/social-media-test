import { Link } from "react-router";
import { Post } from "./PostList";
import { Avatar } from "./ui/Avatar";
import { Typography } from "./ui/Typography";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
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
    <div className="relative group">
      <div className="absolute -inset-1 rounded-card bg-gradient-to-r from-st_light_purple to-st_light_blue blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="bg-white border border-st_taupe/20 rounded-card text-st_black flex flex-col overflow-hidden transition-all duration-300 group-hover:bg-gray-50 group-hover:shadow-lg group-hover:border-st_light_blue/30 h-full">
          
          {/* Image Banner */}
          <div className="relative overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Header: Avatar and Meta */}
            <div className="flex items-center space-x-3 mb-3">
              <Avatar
                src={post.avatar_url}
                alt="User Avatar"
                size="sm"
              />
              <div className="flex-1">
                <Typography variant="caption" className="text-st_taupe">
                  {formatDate(post.created_at)}
                </Typography>
              </div>
            </div>

            {/* Title */}
            <Typography variant="h2" className="text-st_black mb-2 line-clamp-2 group-hover:text-st_light_blue transition-colors duration-200">
              {post.title}
            </Typography>

            {/* Content Preview */}
            <Typography variant="body" className="text-st_taupe mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
              {post.content}
            </Typography>
            
            {/* Engagement Stats */}
            <div className="flex justify-between items-center pt-3 border-t border-st_taupe/10">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-st_taupe hover:text-st_light_blue transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <Typography variant="caption" className="font-medium">
                    {post.like_count ?? 0}
                  </Typography>
                </span>
                <span className="flex items-center space-x-1 text-st_taupe hover:text-st_light_blue transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <Typography variant="caption" className="font-medium">
                    {post.comment_count ?? 0}
                  </Typography>
                </span>
              </div>
              <Typography variant="caption" className="text-st_light_blue font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Read more →
              </Typography>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};