import { PostList } from "../components/PostList";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { Link } from "react-router";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Typography variant="h1" className="mb-4 text-4xl font-bold text-gray-900">
            Welcome to SeniorThrive Community
          </Typography>
          <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
            Connect with others, share your wisdom, and discover new ways to thrive at every stage of life. 
            Join a supportive community where every story matters.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button variant="primary" size="lg">
                Share Your Story
              </Button>
            </Link>
            <Link to="/communities">
              <Button variant="outline" size="lg">
                Explore Communities
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <Typography variant="h1" className="text-3xl font-bold text-blue-600 mb-2">
              1,200+
            </Typography>
            <Typography variant="body" className="text-gray-600 font-medium">
              Community Members
            </Typography>
          </Card>
          <Card className="text-center">
            <Typography variant="h1" className="text-3xl font-bold text-green-600 mb-2">
              350+
            </Typography>
            <Typography variant="body" className="text-gray-600 font-medium">
              Stories Shared
            </Typography>
          </Card>
          <Card className="text-center">
            <Typography variant="h1" className="text-3xl font-bold text-purple-600 mb-2">
              2,800+
            </Typography>
            <Typography variant="body" className="text-gray-600 font-medium">
              Helpful Comments
            </Typography>
          </Card>
        </div>

        {/* Featured Posts Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Typography variant="h2" className="mb-2">
              Latest Community Stories
            </Typography>
            <Typography variant="body" className="text-gray-600">
              Discover inspiring stories and helpful tips from our community members
            </Typography>
          </div>
          <PostList />
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <Typography variant="h3" className="mb-2">
              Connect
            </Typography>
            <Typography variant="body" className="text-gray-600">
              Build meaningful relationships with people who understand your journey
            </Typography>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <Typography variant="h3" className="mb-2">
              Learn
            </Typography>
            <Typography variant="body" className="text-gray-600">
              Discover new tips, resources, and insights from experienced community members
            </Typography>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <Typography variant="h3" className="mb-2">
              Support
            </Typography>
            <Typography variant="body" className="text-gray-600">
              Give and receive encouragement in a safe, welcoming environment
            </Typography>
          </Card>
        </div>
      </div>
    </div>
  );
};