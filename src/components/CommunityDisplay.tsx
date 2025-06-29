import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { Typography } from "./ui/Typography";

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithCommunity[];
};

export const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading)
    return (
      <Typography variant="body" className="text-center py-4">
        Loading communities...
      </Typography>
    );
  
  if (error)
    return (
      <Typography variant="body" className="text-center text-st_dark_red py-4">
        Error: {error.message}
      </Typography>
    );

  return (
    <div>
      <Typography variant="h1" className="mb-6 text-center text-st_light_blue">
        {data && data[0].communities.name} Community Posts
      </Typography>

      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Typography variant="body" className="text-center text-st_taupe">
          No posts in this community yet.
        </Typography>
      )}
    </div>
  );
};