import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { Typography } from "./ui/Typography";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return (
      <Typography variant="body">
        Loading posts...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="body" className="text-st_dark_red">
        Error: {error.message}
      </Typography>
    );
  }

  return (
    <div className="space-y-6">
      <Typography variant="h1" className="mb-6 text-center text-st_light_blue">
        {data?.title}
      </Typography>
      
      {data?.image_url && (
        <img
          src={data.image_url}
          alt={data?.title}
          className="mt-4 rounded-lg object-cover w-full h-64"
        />
      )}
      
      <Typography variant="body" className="text-st_black">
        {data?.content}
      </Typography>
      
      <Typography variant="caption" className="text-st_taupe">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </Typography>

      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
};