import { PostList } from "../components/PostList";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { Link } from "react-router";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-800 rounded-full text-sm font-semibold mb-8 border border-blue-100 shadow-sm">
              <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Join 5,000+ Community Members
            </div>
          </div>
          
          <div className="space-y-6 mb-12">
            <Typography variant="h1" className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              Welcome to <span className="text-blue-600">SeniorThrive</span>
            </Typography>
            <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
              Connect with others, share your wisdom, and discover new ways to thrive at every stage of life. 
              Join a supportive community where every story matters and every voice is valued.
            </Typography>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/create">
              <Button variant="primary" size="lg" className="px-10 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Share Your Story
              </Button>
            </Link>
            <Link to="/communities">
              <Button variant="outline" size="lg" className="px-10 py-4 text-lg font-bold rounded-2xl border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Explore Communities
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-sm font-medium">Trusted Community</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span className="text-sm font-medium">Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-sm font-medium">Verified Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card variant="glass" className="text-center p-10 group hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <Typography variant="h1" className="text-5xl font-bold text-blue-600 mb-3">
              5,200+
            </Typography>
            <Typography variant="body" className="text-gray-600 font-semibold text-lg">
              Community Members
            </Typography>
            <Typography variant="caption" className="text-gray-500 mt-2">
              Growing every day
            </Typography>
          </Card>
          
          <Card variant="glass" className="text-center p-10 group hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <Typography variant="h1" className="text-5xl font-bold text-green-600 mb-3">
              1,350+
            </Typography>
            <Typography variant="body" className="text-gray-600 font-semibold text-lg">
              Stories Shared
            </Typography>
            <Typography variant="caption" className="text-gray-500 mt-2">
              Inspiring experiences
            </Typography>
          </Card>
          
          <Card variant="glass" className="text-center p-10 group hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <Typography variant="h1" className="text-5xl font-bold text-purple-600 mb-3">
              8,900+
            </Typography>
            <Typography variant="body" className="text-gray-600 font-semibold text-lg">
              Helpful Comments
            </Typography>
            <Typography variant="caption" className="text-gray-500 mt-2">
              Meaningful conversations
            </Typography>
          </Card>
        </div>

        {/* Featured Posts Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-6 text-4xl font-bold text-gray-900">
              Latest Community Stories
            </Typography>
            <Typography variant="body" className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Discover inspiring stories and helpful tips from our community members. Every post is a window into someone's experience and wisdom.
            </Typography>
          </div>
          <PostList />
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="gradient" className="text-center p-10 group hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <Typography variant="h3" className="mb-4 text-2xl font-bold text-gray-900">
              Connect
            </Typography>
            <Typography variant="body" className="text-gray-600 leading-relaxed text-lg">
              Build meaningful relationships with people who understand your journey and share similar experiences.
            </Typography>
          </Card>

          <Card variant="gradient" className="text-center p-10 group hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <Typography variant="h3" className="mb-4 text-2xl font-bold text-gray-900">
              Learn
            </Typography>
            <Typography variant="body" className="text-gray-600 leading-relaxed text-lg">
              Discover new tips, resources, and insights from experienced community members who've been there.
            </Typography>
          </Card>

          <Card variant="gradient" className="text-center p-10 group hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <Typography variant="h3" className="mb-4 text-2xl font-bold text-gray-900">
              Support
            </Typography>
            <Typography variant="body" className="text-gray-600 leading-relaxed text-lg">
              Give and receive encouragement in a safe, welcoming environment where everyone's voice is valued.
            </Typography>
          </Card>
        </div>
      </div>
    </div>
  );
};