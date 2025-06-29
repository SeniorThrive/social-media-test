import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    title: "Tips for Fall Prevention at Home",
    content: "I wanted to share some simple modifications I made to my home that have really helped me feel more secure...",
    author: "Grace M.",
    avatar: "",
    community: "Home Safety & DIY Fixes",
    timestamp: "2 hours ago",
    likes: 12,
    comments: 5,
    image: "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 2,
    title: "My Indoor Herb Garden Success Story",
    content: "After months of trial and error, I finally have a thriving herb garden on my windowsill! Here's what worked for me...",
    author: "Robert K.",
    avatar: "",
    community: "Gardening & Indoor Plants",
    timestamp: "4 hours ago",
    likes: 18,
    comments: 8,
    image: "https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 3,
    title: "Caregiver Self-Care: What I Wish I Knew Earlier",
    content: "Being a caregiver for my mother has taught me so much about the importance of taking care of myself too...",
    author: "Taylor S.",
    avatar: "",
    community: "Caregiver Self-Care & Resources",
    timestamp: "6 hours ago",
    likes: 24,
    comments: 12,
  }
];

export const Home = () => {
  return (
    <div className="pt-6">
      <div className="text-center mb-8">
        <Typography variant="h1" className="mb-2 text-st_light_blue">
          Welcome to SeniorThrive Community
        </Typography>
        <Typography variant="body" className="text-st_taupe max-w-2xl mx-auto">
          Connect with others, share your wisdom, and discover new ways to thrive at every stage of life.
        </Typography>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        {mockPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
            {/* Post Header */}
            <div className="flex items-start space-x-3 mb-3">
              <Avatar
                src={post.avatar}
                alt={post.author}
                fallback={post.author}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Typography variant="body" className="font-semibold">
                    {post.author}
                  </Typography>
                  <Typography variant="caption" className="text-st_taupe">
                    •
                  </Typography>
                  <Typography variant="caption" className="text-st_taupe">
                    {post.timestamp}
                  </Typography>
                </div>
                <Typography variant="caption" className="text-st_light_blue font-medium">
                  {post.community}
                </Typography>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <Typography variant="h2" className="mb-2">
                {post.title}
              </Typography>
              <Typography variant="body" className="text-st_taupe mb-3">
                {post.content}
              </Typography>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-st_taupe/20">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-st_taupe hover:text-st_light_blue transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <Typography variant="caption">{post.likes}</Typography>
                </button>
                <button className="flex items-center space-x-2 text-st_taupe hover:text-st_light_blue transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <Typography variant="caption">{post.comments}</Typography>
                </button>
              </div>
              <Button variant="outline" size="sm">
                Read More
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Card className="max-w-md mx-auto bg-gradient-to-br from-st_light_purple/10 to-st_light_blue/10 border border-st_light_blue/20">
          <Typography variant="h2" className="mb-2 text-st_light_blue">
            Ready to Share Your Story?
          </Typography>
          <Typography variant="body" className="text-st_taupe mb-4">
            Join the conversation and connect with your community.
          </Typography>
          <Button variant="primary" className="w-full">
            Create Your First Post
          </Button>
        </Card>
      </div>
    </div>
  );
};