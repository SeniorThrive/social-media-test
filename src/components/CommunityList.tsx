import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Card } from "./ui/Card";
import { Typography } from "./ui/Typography";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
  image_url: string;
  member_count: number;
  post_count: number;
  color: string;
}

// Mock data for frontend development with images and colors
const mockCommunities: Community[] = [
  {
    id: 1,
    name: "Health & Wellness",
    description: "Share tips, experiences, and support for maintaining physical and mental health as we age.",
    created_at: "2024-01-15T10:30:00Z",
    image_url: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=600",
    member_count: 1247,
    post_count: 89,
    color: "bg-emerald-500"
  },
  {
    id: 2,
    name: "Technology Help",
    description: "Get help with smartphones, computers, apps, and digital tools in a supportive environment.",
    created_at: "2024-01-14T14:20:00Z",
    image_url: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=600",
    member_count: 892,
    post_count: 156,
    color: "bg-blue-500"
  },
  {
    id: 3,
    name: "Hobbies & Crafts",
    description: "Share your creative projects and connect with others who enjoy gardening, crafts, and hobbies.",
    created_at: "2024-01-13T09:15:00Z",
    image_url: "https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=600",
    member_count: 1456,
    post_count: 203,
    color: "bg-purple-500"
  },
  {
    id: 4,
    name: "Family & Relationships",
    description: "Discuss family dynamics, grandparenting tips, and maintaining relationships with loved ones.",
    created_at: "2024-01-12T16:45:00Z",
    image_url: "https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=600",
    member_count: 2103,
    post_count: 178,
    color: "bg-pink-500"
  },
  {
    id: 5,
    name: "Financial Planning",
    description: "Share advice on retirement planning, budgeting, and making the most of your resources.",
    created_at: "2024-01-11T11:30:00Z",
    image_url: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=600",
    member_count: 743,
    post_count: 67,
    color: "bg-amber-500"
  },
  {
    id: 6,
    name: "Travel & Adventures",
    description: "Share travel experiences and inspire others to explore new places safely and affordably.",
    created_at: "2024-01-10T13:20:00Z",
    image_url: "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600",
    member_count: 1089,
    post_count: 134,
    color: "bg-orange-500"
  },
  {
    id: 7,
    name: "Caregiving Support",
    description: "A supportive community for caregivers and those receiving care. Share resources and experiences.",
    created_at: "2024-01-09T08:45:00Z",
    image_url: "https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&w=600",
    member_count: 567,
    post_count: 92,
    color: "bg-teal-500"
  },
  {
    id: 8,
    name: "Home & Living",
    description: "Discuss home modifications, downsizing, and creating comfortable living spaces for aging in place.",
    created_at: "2024-01-08T15:10:00Z",
    image_url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
    member_count: 934,
    post_count: 145,
    color: "bg-indigo-500"
  }
];

export const fetchCommunities = async (): Promise<Community[]> => {
  // Return mock data for frontend development
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
      <div className="text-center py-12">
        <div className="space-y-8 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <Card key={i} variant="glass" className="p-8 animate-shimmer">
              <div className="flex items-center space-x-6">
                <div className="skeleton w-24 h-24 rounded-2xl"></div>
                <div className="flex-1 space-y-4">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text w-3/4"></div>
                  <div className="flex space-x-4">
                    <div className="skeleton w-20 h-6 rounded-full"></div>
                    <div className="skeleton w-16 h-6 rounded-full"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  
  if (error)
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-red-600 mb-6">
          Error loading communities
        </Typography>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCommunities.map((community) => (
            <Card key={community.id} variant="glass" className="overflow-hidden group card-hover">
              <Link to={`/community/${community.id}`} className="block">
                <div className="relative">
                  <img 
                    src={community.image_url} 
                    alt={community.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                  <div className={`absolute top-4 left-4 w-4 h-4 rounded-full ${community.color} shadow-lg animate-pulse-glow`}></div>
                  
                  {/* Enhanced floating stats */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 glass rounded-full px-4 py-2 shadow-modern">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span className="text-sm font-bold">{community.member_count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 glass rounded-full px-4 py-2 shadow-modern">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm font-bold">{community.post_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <Typography variant="h3" className="text-gray-900 mb-3 font-bold text-xl group-hover:text-blue-600 transition-colors">
                    {community.name}
                  </Typography>
                  <Typography variant="body" className="text-gray-600 line-clamp-2 leading-relaxed mb-5">
                    {community.description}
                  </Typography>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <Typography variant="caption" className="font-semibold">
                        Active community
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full group-hover:translate-x-1 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Typography variant="caption" className="font-bold">
                        Join now
                      </Typography>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.map((community) => (
          <Card key={community.id} variant="glass" className="overflow-hidden group card-hover bg-white/90 backdrop-blur-sm border border-white/20 shadow-modern">
            <Link to={`/community/${community.id}`} className="block">
              <div className="relative">
                <img 
                  src={community.image_url} 
                  alt={community.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                <div className={`absolute top-4 left-4 w-4 h-4 rounded-full ${community.color} shadow-lg animate-pulse-glow`}></div>
                
                {/* Enhanced floating stats */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 glass rounded-full px-4 py-2 shadow-modern">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <span className="text-sm font-bold">{community.member_count.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 glass rounded-full px-4 py-2 shadow-modern">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm font-bold">{community.post_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <Typography variant="h3" className="text-gray-900 mb-3 font-bold text-xl group-hover:text-blue-600 transition-colors">
                  {community.name}
                </Typography>
                <Typography variant="body" className="text-gray-600 line-clamp-2 leading-relaxed mb-5">
                  {community.description}
                </Typography>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Typography variant="caption" className="font-semibold">
                      Active community
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full group-hover:translate-x-1 transition-all duration-200 shadow-lg hover:shadow-xl btn-hover-lift">
                    <Typography variant="caption" className="font-bold">
                      Join now
                    </Typography>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};