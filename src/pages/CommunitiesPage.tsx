import { CommunityList } from "../components/CommunityList";
import { Typography } from "../components/ui/Typography";

export const CommunitiesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Typography variant="h1" className="mb-4 text-4xl font-bold text-gray-900">
            Explore Communities
          </Typography>
          <Typography variant="body" className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find your perfect community and connect with like-minded people who share your interests and experiences.
          </Typography>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <CommunityList />
      </div>
    </div>
  );
};