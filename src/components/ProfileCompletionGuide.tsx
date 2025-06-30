import { UserProfile } from '../types/auth';
import { Card } from './ui/Card';
import { Typography } from './ui/Typography';

interface ProfileCompletionGuideProps {
  profile: UserProfile | null;
}

export const ProfileCompletionGuide = ({ profile }: ProfileCompletionGuideProps) => {
  const calculateCompletionScore = (): { score: number; total: number; missing: string[] } => {
    if (!profile) return { score: 0, total: 8, missing: [] };

    const fields = [
      { key: 'username', label: 'Username', value: profile.username },
      { key: 'bio', label: 'Bio', value: profile.bio },
      { key: 'location', label: 'Location', value: profile.location },
      { key: 'website', label: 'Website', value: profile.website },
      { key: 'birth_date', label: 'Birth Date', value: profile.birth_date },
      { key: 'phone', label: 'Phone Number', value: profile.phone },
      { key: 'avatar_url', label: 'Profile Photo', value: profile.avatar_url },
      { key: 'social', label: 'Social Media Links', value: profile.twitter_url || profile.linkedin_url || profile.instagram_url || profile.facebook_url },
    ];

    const completed = fields.filter(field => field.value && field.value.trim() !== '');
    const missing = fields.filter(field => !field.value || field.value.trim() === '').map(field => field.label);

    return {
      score: completed.length,
      total: fields.length,
      missing
    };
  };

  const { score, total, missing } = calculateCompletionScore();
  const percentage = Math.round((score / total) * 100);

  const getCompletionColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCompletionMessage = () => {
    if (percentage === 100) return "🎉 Your profile is complete! You're all set to make the most of SeniorThrive.";
    if (percentage >= 80) return "Almost there! Just a few more details to complete your profile.";
    if (percentage >= 60) return "Good progress! Adding more information helps others connect with you.";
    if (percentage >= 40) return "You're on your way! Complete more sections to unlock full features.";
    return "Let's get started! Complete your profile to connect with the community.";
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h3" className="text-gray-900 font-semibold">
          Profile Completion
        </Typography>
        <div className="text-right">
          <Typography variant="h3" className="text-2xl font-bold text-blue-600">
            {percentage}%
          </Typography>
          <Typography variant="caption" className="text-gray-600">
            {score} of {total} completed
          </Typography>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${getCompletionColor()}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Completion Message */}
      <Typography variant="body" className="text-gray-700 mb-4">
        {getCompletionMessage()}
      </Typography>

      {/* Missing Fields */}
      {missing.length > 0 && (
        <div>
          <Typography variant="body" className="font-medium text-gray-900 mb-2">
            Complete these sections:
          </Typography>
          <div className="flex flex-wrap gap-2">
            {missing.map((field, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {percentage < 100 && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
          <Typography variant="caption" className="text-blue-700 font-medium">
            💡 Complete your profile to:
          </Typography>
          <ul className="mt-1 text-xs text-blue-600 space-y-1">
            <li>• Help others find and connect with you</li>
            <li>• Build trust within the community</li>
            <li>• Unlock personalized recommendations</li>
            <li>• Access exclusive community features</li>
          </ul>
        </div>
      )}
    </Card>
  );
};