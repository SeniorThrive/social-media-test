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

// Mock data for development
const mockPosts: Post[] = [
  {
    id: 1,
    title: "Tips for Fall Prevention at Home",
    content: "I wanted to share some simple modifications I made to my home that have really helped me feel more secure. Installing grab bars in the bathroom and removing throw rugs made a huge difference.",
    created_at: "2024-01-15T10:30:00Z",
    image_url: "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400",
    avatar_url: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100",
    like_count: 12,
    comment_count: 5
  },
  {
    id: 2,
    title: "My Indoor Herb Garden Success Story",
    content: "After months of trial and error, I finally have a thriving herb garden on my windowsill! Here's what worked for me: consistent watering schedule and the right soil mix.",
    created_at: "2024-01-14T14:20:00Z",
    image_url: "https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=400",
    avatar_url: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
    like_count: 18,
    comment_count: 8
  },
  {
    id: 3,
    title: "Caregiver Self-Care: What I Wish I Knew Earlier",
    content: "Being a caregiver for my mother has taught me so much about the importance of taking care of myself too. Here are some strategies that have helped me maintain my well-being.",
    created_at: "2024-01-13T09:15:00Z",
    image_url: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=400",
    avatar_url: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
    like_count: 24,
    comment_count: 12
  },
  {
    id: 4,
    title: "Technology Tips for Staying Connected",
    content: "Learning to use video calls has been a game-changer for staying in touch with family. Here are some simple tips that made it easier for me to get started.",
    created_at: "2024-01-12T16:45:00Z",
    image_url: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400",
    avatar_url: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100",
    like_count: 15,
    comment_count: 7
  },
  {
    id: 5,
    title: "Simple Exercises for Joint Health",
    content: "My physical therapist recommended these gentle exercises that I can do at home. They've really helped with my morning stiffness and overall mobility.",
    created_at: "2024-01-11T11:30:00Z",
    image_url: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400",
    avatar_url: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
    like_count: 21,
    comment_count: 9
  },
  {
    id: 6,
    title: "Budget-Friendly Meal Planning for Seniors",
    content: "Eating well on a fixed income can be challenging, but I've found some great strategies for meal planning that save money and ensure good nutrition.",
    created_at: "2024-01-10T13:20:00Z",
    image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    avatar_url: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100",
    like_count: 19,
    comment_count: 11
  }
];

const fetchPosts = async (): Promise<Post[]> => {
  // Always return mock data for now since we're focusing on frontend
  return mockPosts;
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <Typography variant="body" className="text-gray-500">
            Loading posts...
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Typography variant="body" className="text-red-600 mb-6">
          Unable to load posts
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <PostItem post={post} key={post.id} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <Typography variant="body" className="text-gray-500 mb-6">
          No posts available yet.
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <PostItem post={post} key={post.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  );
};