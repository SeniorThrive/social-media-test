import { UserProfile } from '../types/auth';
import { Card } from './ui/Card';
import { Typography } from './ui/Typography';

interface ProfileCompletionGuideProps {
  profile: UserProfile | null;
}

export const ProfileCompletionGuide = ({ profile }: ProfileCompletionGuideProps) => {
  const calculateCompletionScore = (): { score: number; total: number; missing: string[] } => {
    if (!profile) return { score: 0, total: 10, missing: [] };

    const fields = [
      { key: 'username', label: 'Username', value: profile.username },
      { key: 'bio', label: 'Bio', value: profile.bio },
      { key: 'location', label: 'Location', value: profile.location },
      { key: 'website', label: 'Website', value: profile.website },
      { key: 'birth_date', label: 'Birth Date', value: profile.birth_date },
      { key: 'phone', label: 'Phone Number', value: profile.phone },
      { key: 'avatar_url', label: 'Profile Photo', value: profile.avatar_url },
      { key: 'social', label: 'Social Media Links', value: profile.twitter_url || profile.linkedin_url || profile.instagram_url || profile.facebook_url },
      { key: 'role_age_range', label: 'Role & Age Range', value: profile.role_age_range },
      { key: 'fun_introduction', label: 'Fun Introduction', value: profile.fun_introduction },
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
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    if (percentage >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getCompletionMessage = () => {
    if (percentage === 100) return "🎉 Your profile is absolutely perfect! You're all set to make the most of Thrive Nation and connect with amazing people!";
    if (percentage >= 80) return "🌟 Almost there! Just a few more details to make your profile shine even brighter!";
    if (percentage >= 60) return "✨ Great progress! Adding more information helps others connect with your awesome personality!";
    if (percentage >= 40) return "🚀 You're on your way! Complete more sections to unlock the full magic of our community!";
    return "🎯 Let's get started on your amazing journey! Complete your profile to connect with our wonderful community!";
  };

  const getCompletionEmoji = () => {
    if (percentage === 100) return "🏆";
    if (percentage >= 80) return "🌟";
    if (percentage >= 60) return "✨";
    if (percentage >= 40) return "🚀";
    return "🎯";
  };

  return (
    <Card variant="glass" className="p-8 mb-8 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 border-2 border-blue-200/50 shadow-modern-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">{getCompletionEmoji()}</span>
          </div>
          <div>
            <Typography variant="h3" className="text-gray-900 font-bold text-2xl">
              Profile Completion
            </Typography>
            <Typography variant="caption" className="text-gray-600 text-base">
              Make your profile amazing!
            </Typography>
          </div>
        </div>
        <div className="text-right">
          <Typography variant="h3" className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {percentage}%
          </Typography>
          <Typography variant="caption" className="text-gray-600 font-semibold">
            {score} of {total} completed
          </Typography>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ease-out bg-gradient-to-r ${getCompletionColor()} shadow-lg`}
            style={{ width: `${percentage}%` }}
          >
            <div className="h-full bg-white/20 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Completion Message */}
      <div className="mb-6 p-6 bg-gradient-to-r from-white/60 to-blue-50/60 rounded-2xl border border-blue-200/50">
        <Typography variant="body" className="text-gray-700 text-lg font-semibold text-center">
          {getCompletionMessage()}
        </Typography>
      </div>

      {/* Missing Fields */}
      {missing.length > 0 && (
        <div className="mb-6">
          <Typography variant="body" className="font-bold text-gray-900 mb-4 text-lg">
            ✨ Complete these sections to unlock your full potential:
          </Typography>
          <div className="flex flex-wrap gap-3">
            {missing.map((field, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <span className="mr-2">📝</span>
                {field}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {percentage < 100 && (
        <div className="p-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-2xl border-2 border-purple-200/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💡</span>
            </div>
            <Typography variant="caption" className="text-purple-700 font-bold text-lg">
              Amazing benefits await you:
            </Typography>
          </div>
          <ul className="space-y-2 text-sm text-purple-600">
            <li className="flex items-center space-x-3">
              <span className="text-lg">🤝</span>
              <span className="font-semibold">Help others find and connect with your awesome personality</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-lg">🛡️</span>
              <span className="font-semibold">Build trust and credibility within our amazing community</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-lg">🎯</span>
              <span className="font-semibold">Unlock personalized recommendations just for you</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-lg">🌟</span>
              <span className="font-semibold">Access exclusive community features and special events</span>
            </li>
          </ul>
        </div>
      )}

      {/* Celebration for 100% completion */}
      {percentage === 100 && (
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <Typography variant="h3" className="text-green-800 font-bold text-xl mb-2">
            Congratulations! Your profile is perfect!
          </Typography>
          <Typography variant="body" className="text-green-700 font-semibold">
            You're now ready to make the most amazing connections in our community! 🌟
          </Typography>
        </div>
      )}
    </Card>
  );
};