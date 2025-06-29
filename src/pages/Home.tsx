import { PostList } from "../components/PostList";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { Link } from "react-router";

export const Home = () => {
  return (
    <div className="pt-6">
      {/* Hero Section */}
      <div className="text-center mb-16 px-4">
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-st_light_purple/10 to-st_light_blue/10 blur-3xl -z-10"></div>
          <Typography variant="h1" className="mb-6 text-st_light_blue text-5xl md:text-6xl font-bold leading-tight">
            Welcome to SeniorThrive Community
          </Typography>
          <Typography variant="body" className="text-st_taupe max-w-3xl mx-auto text-xl leading-relaxed">
            Connect with others, share your wisdom, and discover new ways to thrive at every stage of life. 
            Join a supportive community where every story matters.
          </Typography>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-16">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-st_light_blue/10 min-w-[200px] hover:shadow-xl transition-shadow duration-300">
            <Typography variant="h1" className="text-4xl font-bold text-st_light_blue mb-2">
              1,200+
            </Typography>
            <Typography variant="body" className="text-st_taupe font-medium">
              Community Members
            </Typography>
          </div>
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-st_light_purple/10 min-w-[200px] hover:shadow-xl transition-shadow duration-300">
            <Typography variant="h1" className="text-4xl font-bold text-st_light_purple mb-2">
              350+
            </Typography>
            <Typography variant="body" className="text-st_taupe font-medium">
              Stories Shared
            </Typography>
          </div>
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-st_light_orange/10 min-w-[200px] hover:shadow-xl transition-shadow duration-300">
            <Typography variant="h1" className="text-4xl font-bold text-st_light_orange mb-2">
              2,800+
            </Typography>
            <Typography variant="body" className="text-st_taupe font-medium">
              Helpful Comments
            </Typography>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <Typography variant="h1" className="text-3xl font-semibold text-st_black mb-4">
            Latest Community Stories
          </Typography>
          <Typography variant="body" className="text-st_taupe text-lg max-w-2xl mx-auto">
            Discover inspiring stories and helpful tips from our community members
          </Typography>
        </div>
        <PostList />
      </div>

      {/* Call to Action */}
      <div className="text-center mt-20 mb-16">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-st_light_purple/20 to-st_light_blue/20 blur-2xl -z-10"></div>
            <Card className="bg-gradient-to-br from-white to-gray-50 border border-st_light_blue/20 relative overflow-hidden p-12">
              <div className="relative z-10">
                <Typography variant="h1" className="mb-4 text-st_light_blue text-2xl font-semibold">
                  Ready to Share Your Story?
                </Typography>
                <Typography variant="body" className="text-st_taupe mb-8 leading-relaxed text-lg">
                  Your experiences and wisdom can help others in our community. 
                  Join the conversation and make a difference today.
                </Typography>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/create">
                    <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg">
                      Share Your Story
                    </Button>
                  </Link>
                  <Link to="/communities">
                    <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg">
                      Explore Communities
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Community Features */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card className="text-center hover:shadow-xl transition-all duration-300 p-8 bg-gradient-to-br from-white to-st_light_blue/5 border-st_light_blue/20">
          <div className="w-16 h-16 bg-st_light_blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-st_light_blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <Typography variant="h2" className="mb-3 text-st_black text-xl">
            Connect
          </Typography>
          <Typography variant="body" className="text-st_taupe leading-relaxed">
            Build meaningful relationships with people who understand your journey
          </Typography>
        </Card>

        <Card className="text-center hover:shadow-xl transition-all duration-300 p-8 bg-gradient-to-br from-white to-st_light_purple/5 border-st_light_purple/20">
          <div className="w-16 h-16 bg-st_light_purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-st_light_purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <Typography variant="h2" className="mb-3 text-st_black text-xl">
            Learn
          </Typography>
          <Typography variant="body" className="text-st_taupe leading-relaxed">
            Discover new tips, resources, and insights from experienced community members
          </Typography>
        </Card>

        <Card className="text-center hover:shadow-xl transition-all duration-300 p-8 bg-gradient-to-br from-white to-st_light_orange/5 border-st_light_orange/20">
          <div className="w-16 h-16 bg-st_light_orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-st_light_orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <Typography variant="h2" className="mb-3 text-st_black text-xl">
            Support
          </Typography>
          <Typography variant="body" className="text-st_taupe leading-relaxed">
            Give and receive encouragement in a safe, welcoming environment
          </Typography>
        </Card>
      </div>
    </div>
  );
};