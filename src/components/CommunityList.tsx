import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Card } from "./ui/Card";
import { Typography } from "./ui/Typography";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

// Mock data for frontend development
const mockCommunities: Community[] = [
  {
    id: 1,
    name: "Health & Wellness",
    description: "Share tips, experiences, and support for maintaining physical and mental health as we age. Discuss exercise routines, nutrition, medical experiences, and wellness strategies.",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Technology Help",
    description: "Get help with smartphones, computers, apps, and digital tools. A supportive space for learning new technology and troubleshooting common issues.",
    created_at: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    name: "Hobbies & Crafts",
    description: "Share your creative projects, learn new skills, and connect with others who enjoy gardening, knitting, woodworking, painting, and other hobbies.",
    created_at: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    name: "Family & Relationships",
    description: "Discuss family dynamics, grandparenting tips, maintaining relationships, and navigating life changes with loved ones.",
    created_at: "2024-01-12T16:45:00Z"
  },
  {
    id: 5,
    name: "Financial Planning",
    description: "Share advice on retirement planning, budgeting on fixed income, estate planning, and making the most of your financial resources.",
    created_at: "2024-01-11T11:30:00Z"
  },
  {
    id: 6,
    name: "Travel & Adventures",
    description: "Share travel experiences, tips for senior-friendly destinations, and inspire others to explore new places safely and affordably.",
    created_at: "2024-01-10T13:20:00Z"
  },
  {
    id: 7,
    name: "Caregiving Support",
    description: "A supportive community for caregivers and those receiving care. Share resources, experiences, and emotional support.",
    created_at: "2024-01-09T08:45:00Z"
  },
  {
    id: 8,
    name: "Home & Living",
    description: "Discuss home modifications, downsizing, maintenance tips, and creating comfortable living spaces for aging in place.",
    created_at: "2024-01-08T15:10:00Z"
  }
];

export const fetchCommunities = async (): Promise<Community[]> => {
  // Return mock data for frontend development
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCommunities;
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading)
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-gray-500">
          Loading communities...
        </Typography>
      </div>
    );
  
  if (error)
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-red-600 mb-4">
          Error loading communities
        </Typography>
        <div className="max-w-5xl mx-auto space-y-4">
          {mockCommunities.map((community) => (
            <Card key={community.id} className="hover:shadow-lg transition-shadow duration-200">
              <Link
                to={`/community/${community.id}`}
                className="block"
              >
                <Typography variant="h2" className="text-blue-600 hover:underline mb-2">
                  {community.name}
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  {community.description}
                </Typography>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community) => (
        <Card key={community.id} className="hover:shadow-lg transition-shadow duration-200">
          <Link
            to={`/community/${community.id}`}
            className="block"
          >
            <Typography variant="h2" className="text-blue-600 hover:underline mb-2">
              {community.name}
            </Typography>
            <Typography variant="body" className="text-gray-600">
              {community.description}
            </Typography>
          </Link>
        </Card>
      ))}
    </div>
  );
};