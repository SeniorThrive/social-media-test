import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { Typography } from "./ui/Typography";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);

  return data as Post[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-st_taupe">
          Loading posts...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-st_dark_red">
          Error: {error.message}
        </Typography>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-st_taupe">
          No posts available yet.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  );
};