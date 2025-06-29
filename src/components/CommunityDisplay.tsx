import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
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

// Mock data for community posts
const mockCommunityPosts: { [key: number]: PostWithCommunity[] } = {
  1: [ // Health & Wellness
    {
      id: 1,
      title: "Tips for Fall Prevention at Home",
      content: "I wanted to share some simple modifications I made to my home that have really helped me feel more secure. Installing grab bars in the bathroom and removing throw rugs made a huge difference.",
      created_at: "2024-01-15T10:30:00Z",
      image_url: "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400",
      avatar_url: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100",
      like_count: 12,
      comment_count: 5,
      communities: { name: "Health & Wellness" }
    },
    {
      id: 5,
      title: "Simple Exercises for Joint Health",
      content: "My physical therapist recommended these gentle exercises that I can do at home. They've really helped with my morning stiffness and overall mobility.",
      created_at: "2024-01-11T11:30:00Z",
      image_url: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400",
      avatar_url: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
      like_count: 21,
      comment_count: 9,
      communities: { name: "Health & Wellness" }
    }
  ],
  2: [ // Technology Help
    {
      id: 4,
      title: "Technology Tips for Staying Connected",
      content: "Learning to use video calls has been a game-changer for staying in touch with family. Here are some simple tips that made it easier for me to get started.",
      created_at: "2024-01-12T16:45:00Z",
      image_url: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400",
      avatar_url: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100",
      like_count: 15,
      comment_count: 7,
      communities: { name: "Technology Help" }
    }
  ],
  3: [ // Hobbies & Crafts
    {
      id: 2,
      title: "My Indoor Herb Garden Success Story",
      content: "After months of trial and error, I finally have a thriving herb garden on my windowsill! Here's what worked for me: consistent watering schedule and the right soil mix.",
      created_at: "2024-01-14T14:20:00Z",
      image_url: "https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=400",
      avatar_url: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
      like_count: 18,
      comment_count: 8,
      communities: { name: "Hobbies & Crafts" }
    }
  ],
  4: [ // Family & Relationships
    {
      id: 3,
      title: "Caregiver Self-Care: What I Wish I Knew Earlier",
      content: "Being a caregiver for my mother has taught me so much about the importance of taking care of myself too. Here are some strategies that have helped me maintain my well-being.",
      created_at: "2024-01-13T09:15:00Z",
      image_url: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=400",
      avatar_url: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
      like_count: 24,
      comment_count: 12,
      communities: { name: "Family & Relationships" }
    }
  ],
  5: [ // Financial Planning
    {
      id: 6,
      title: "Budget-Friendly Meal Planning for Seniors",
      content: "Eating well on a fixed income can be challenging, but I've found some great strategies for meal planning that save money and ensure good nutrition.",
      created_at: "2024-01-10T13:20:00Z",
      image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
      avatar_url: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100",
      like_count: 19,
      comment_count: 11,
      communities: { name: "Financial Planning" }
    }
  ]
};

export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCommunityPosts[communityId] || [];
};

export const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading)
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-gray-500">
          Loading community posts...
        </Typography>
      </div>
    );
  
  if (error)
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-red-600">
          Error loading community posts
        </Typography>
      </div>
    );

  const communityNames: { [key: number]: string } = {
    1: "Health & Wellness",
    2: "Technology Help", 
    3: "Hobbies & Crafts",
    4: "Family & Relationships",
    5: "Financial Planning",
    6: "Travel & Adventures",
    7: "Caregiving Support",
    8: "Home & Living"
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Typography variant="h1" className="mb-6 text-center text-blue-600">
        {communityNames[communityId]} Community
      </Typography>

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Typography variant="body" className="text-gray-500">
            No posts in this community yet. Be the first to share something!
          </Typography>
        </div>
      )}
    </div>
  );
};