import { Link } from "react-router";
import { Post } from "./PostList";
import { Avatar } from "./ui/Avatar";
import { Typography } from "./ui/Typography";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-card bg-gradient-to-r from-st_light_purple to-st_light_blue blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-76 bg-white border border-st_taupe/20 rounded-card text-st_black flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-100">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-2">
            <Avatar
              src={post.avatar_url}
              alt="User Avatar"
              size="sm"
            />
            <div className="flex flex-col flex-1">
              <Typography variant="h2" className="text-st_black mt-2">
                {post.title}
              </Typography>
            </div>
          </div>

          {/* Image Banner */}
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-lg object-cover max-h-[150px] mx-auto"
            />
          </div>
          
          <div className="flex justify-around items-center">
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              ❤️ 
              <Typography variant="caption" className="ml-2 text-st_taupe">
                {post.like_count ?? 0}
              </Typography>
            </span>
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              💬 
              <Typography variant="caption" className="ml-2 text-st_taupe">
                {post.comment_count ?? 0}
              </Typography>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};