import { PostList } from "../components/PostList";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { Link } from "react-router";

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

      {/* Featured Posts Section */}
      <div className="mb-8">
        <Typography variant="h2" className="mb-4 text-center text-st_black">
          Latest Posts
        </Typography>
        <PostList />
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
          <Link to="/create">
            <Button variant="primary" className="w-full">
              Create Your First Post
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};