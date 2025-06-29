import { PostList } from "../components/PostList";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { Link } from "react-router";

export const Home = () => {
  return (
    <div className="pt-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-st_light_purple/10 to-st_light_blue/10 blur-3xl -z-10"></div>
          <Typography variant="h1" className="mb-4 text-st_light_blue text-4xl font-bold">
            Welcome to SeniorThrive Community
          </Typography>
          <Typography variant="body" className="text-st_taupe max-w-2xl mx-auto text-lg leading-relaxed">
            Connect with others, share your wisdom, and discover new ways to thrive at every stage of life. 
            Join a supportive community where every story matters.
          </Typography>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
        <Card className="text-center bg-gradient-to-br from-st_light_blue/5 to-st_light_purple/5 border-st_light_blue/20">
          <Typography variant="h2" className="text-2xl font-bold text-st_light_blue mb-1">
            1,200+
          </Typography>
          <Typography variant="body" className="text-st_taupe">
            Community Members
          </Typography>
        </Card>
        <Card className="text-center bg-gradient-to-br from-st_light_purple/5 to-st_light_orange/5 border-st_light_purple/20">
          <Typography variant="h2" className="text-2xl font-bold text-st_light_purple mb-1">
            350+
          </Typography>
          <Typography variant="body" className="text-st_taupe">
            Stories Shared
          </Typography>
        </Card>
        <Card className="text-center bg-gradient-to-br from-st_light_orange/5 to-st_light_blue/5 border-st_light_orange/20">
          <Typography variant="h2" className="text-2xl font-bold text-st_light_orange mb-1">
            2,800+
          </Typography>
          <Typography variant="body" className="text-st_taupe">
            Helpful Comments
          </Typography>
        </Card>
      </div>

      {/* Featured Posts Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <Typography variant="h2" className="text-2xl font-semibold text-st_black mb-2">
            Latest Community Stories
          </Typography>
          <Typography variant="body" className="text-st_taupe">
            Discover inspiring stories and helpful tips from our community members
          </Typography>
        </div>
        <PostList />
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <Card className="max-w-lg mx-auto bg-gradient-to-br from-st_light_purple/10 to-st_light_blue/10 border border-st_light_blue/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-st_light_purple/5 to-st_light_blue/5"></div>
          <div className="relative z-10">
            <Typography variant="h2" className="mb-3 text-st_light_blue text-xl font-semibold">
              Ready to Share Your Story?
            </Typography>
            <Typography variant="body" className="text-st_taupe mb-6 leading-relaxed">
              Your experiences and wisdom can help others in our community. 
              Join the conversation and make a difference today.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/create">
                <Button variant="primary" className="w-full sm:w-auto px-6 py-3">
                  Share Your Story
                </Button>
              </Link>
              <Link to="/communities">
                <Button variant="outline" className="w-full sm:w-auto px-6 py-3">
                  Explore Communities
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Community Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-st_light_blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-st_light_blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <Typography variant="h2" className="mb-2 text-st_black">
            Connect
          </Typography>
          <Typography variant="body" className="text-st_taupe text-sm">
            Build meaningful relationships with people who understand your journey
          </Typography>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-st_light_purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-st_light_purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <Typography variant="h2" className="mb-2 text-st_black">
            Learn
          </Typography>
          <Typography variant="body" className="text-st_taupe text-sm">
            Discover new tips, resources, and insights from experienced community members
          </Typography>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow duration-200">
          <div className="w-12 h-12 bg-st_light_orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-st_light_orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <Typography variant="h2" className="mb-2 text-st_black">
            Support
          </Typography>
          <Typography variant="body" className="text-st_taupe text-sm">
            Give and receive encouragement in a safe, welcoming environment
          </Typography>
        </Card>
      </div>
    </div>
  );
};