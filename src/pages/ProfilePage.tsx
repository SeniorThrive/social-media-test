import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Typography } from "../components/ui/Typography";
import { Avatar } from "../components/ui/Avatar";
import { ImageCropModal } from "../components/ImageCropModal";
import { ProfileCompletionGuide } from "../components/ProfileCompletionGuide";

interface ProfileFormData {
  username: string;
  bio: string;
  location: string;
  website: string;
  birth_date: string;
  phone: string;
  privacy_email: boolean;
  privacy_profile: boolean;
  notifications_email: boolean;
  notifications_push: boolean;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  facebook_url: string;
  role_age_range: string;
  fun_introduction: string;
}

interface ProfileUpdateData extends ProfileFormData {
  avatar_url?: string;
}

const updateProfile = async (profileData: ProfileUpdateData, avatarFile?: File) => {
  let avatarUrl = profileData.avatar_url;

  // Upload avatar if provided
  if (avatarFile) {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);

    if (uploadError) {
      throw new Error(`Avatar upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    avatarUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw new Error(error.message);
};

export const ProfilePage = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    bio: '',
    location: '',
    website: '',
    birth_date: '',
    phone: '',
    privacy_email: true,
    privacy_profile: false,
    notifications_email: true,
    notifications_push: false,
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
    facebook_url: '',
    role_age_range: '',
    fun_introduction: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('');

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: (profile as any).bio || '',
        location: (profile as any).location || '',
        website: (profile as any).website || '',
        birth_date: (profile as any).birth_date || '',
        phone: (profile as any).phone || '',
        privacy_email: (profile as any).privacy_email ?? true,
        privacy_profile: (profile as any).privacy_profile ?? false,
        notifications_email: (profile as any).notifications_email ?? true,
        notifications_push: (profile as any).notifications_push ?? false,
        twitter_url: (profile as any).twitter_url || '',
        linkedin_url: (profile as any).linkedin_url || '',
        instagram_url: (profile as any).instagram_url || '',
        facebook_url: (profile as any).facebook_url || '',
        role_age_range: (profile as any).role_age_range || '',
        fun_introduction: (profile as any).fun_introduction || '',
      });
      setAvatarPreview((profile as any).avatar_url || '');
    }
  }, [profile]);

  const { mutate: updateProfileMutation, isPending, isError, error } = useMutation({
    mutationFn: (data: { profileData: ProfileUpdateData; avatarFile?: File }) =>
      updateProfile(data.profileData, data.avatarFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setHasChanges(false);
      setAvatarFile(null);
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    },
  });

  // Auto-save functionality with debounce
  useEffect(() => {
    if (!hasChanges || !validateForm()) return;

    setAutoSaveStatus('saving');
    const timeoutId = setTimeout(() => {
      updateProfileMutation({
        profileData: { ...formData, avatar_url: avatarPreview },
        avatarFile: avatarFile || undefined,
      });
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, hasChanges, avatarFile, avatarPreview]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    // Required field validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // URL validation for website and social media
    const urlFields = ['website', 'twitter_url', 'linkedin_url', 'instagram_url', 'facebook_url'] as const;
    urlFields.forEach(field => {
      if (formData[field] && !formData[field].match(/^https?:\/\/.+/)) {
        newErrors[field] = 'Must be a valid URL (include http:// or https://)';
      }
    });

    if (formData.phone && !formData.phone.match(/^[\+]?[1-9][\d]{0,15}$/)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.fun_introduction && formData.fun_introduction.length > 200) {
      newErrors.fun_introduction = 'Fun introduction must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Avatar image must be less than 5MB' }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file' }));
        return;
      }

      // Create preview for cropping
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImageSrc(e.target?.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = useCallback((croppedImageBlob: Blob) => {
    // Convert blob to file
    const file = new File([croppedImageBlob], 'avatar.jpg', { type: 'image/jpeg' });
    setAvatarFile(file);
    setHasChanges(true);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(croppedImageBlob);
    setAvatarPreview(previewUrl);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateProfileMutation({
      profileData: { ...formData, avatar_url: avatarPreview },
      avatarFile: avatarFile || undefined,
    });
  };

  const handleCancel = () => {
    // Reset form to original values
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: (profile as any).bio || '',
        location: (profile as any).location || '',
        website: (profile as any).website || '',
        birth_date: (profile as any).birth_date || '',
        phone: (profile as any).phone || '',
        privacy_email: (profile as any).privacy_email ?? true,
        privacy_profile: (profile as any).privacy_profile ?? false,
        notifications_email: (profile as any).notifications_email ?? true,
        notifications_push: (profile as any).notifications_push ?? false,
        twitter_url: (profile as any).twitter_url || '',
        linkedin_url: (profile as any).linkedin_url || '',
        instagram_url: (profile as any).instagram_url || '',
        facebook_url: (profile as any).facebook_url || '',
        role_age_range: (profile as any).role_age_range || '',
        fun_introduction: (profile as any).fun_introduction || '',
      });
      setAvatarPreview((profile as any).avatar_url || '');
    }
    setAvatarFile(null);
    setHasChanges(false);
    setErrors({});
  };

  const exportProfileData = () => {
    if (!profile) return;

    const exportData = {
      ...profile,
      exported_at: new Date().toISOString(),
      export_version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importProfileData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate imported data structure
        const requiredFields = ['username'];
        const hasRequiredFields = requiredFields.every(field => 
          importedData.hasOwnProperty(field)
        );

        if (!hasRequiredFields) {
          alert('Invalid profile data file. Missing required fields.');
          return;
        }

        // Confirm import
        if (window.confirm('This will replace your current profile data. Are you sure?')) {
          setFormData({
            username: importedData.username || '',
            bio: importedData.bio || '',
            location: importedData.location || '',
            website: importedData.website || '',
            birth_date: importedData.birth_date || '',
            phone: importedData.phone || '',
            privacy_email: importedData.privacy_email ?? true,
            privacy_profile: importedData.privacy_profile ?? false,
            notifications_email: importedData.notifications_email ?? true,
            notifications_push: importedData.notifications_push ?? false,
            twitter_url: importedData.twitter_url || '',
            linkedin_url: importedData.linkedin_url || '',
            instagram_url: importedData.instagram_url || '',
            facebook_url: importedData.facebook_url || '',
            role_age_range: importedData.role_age_range || '',
            fun_introduction: importedData.fun_introduction || '',
          });
          setHasChanges(true);
        }
      } catch (error) {
        alert('Invalid JSON file. Please select a valid profile data file.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Fun Header */}
      <div className="text-center mb-12">
        <Typography variant="h1" className="mb-4 text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create Your Thrive Nation Profile ✨
        </Typography>
        <Typography variant="body" className="text-gray-600 text-xl max-w-3xl mx-auto">
          Your voice matters here! Take a minute to build your profile so others can find you, learn from you, and encourage you 🌟
        </Typography>
      </div>

      {/* Profile Completion Guide */}
      <ProfileCompletionGuide profile={profile} />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card variant="glass" className="p-8 shadow-modern-lg">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <Typography variant="h2" className="text-2xl font-bold text-gray-900">
                  Basic Information 📝
                </Typography>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-bold text-gray-900 mb-3">
                    Username ⭐
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    error={!!errors.username}
                    placeholder="GoldenGuru55"
                    className="rounded-xl border-2 p-4"
                    aria-describedby={errors.username ? "username-error" : "username-help"}
                  />
                  {errors.username ? (
                    <Typography variant="caption" className="text-red-600 mt-2 font-semibold" id="username-error">
                      {errors.username}
                    </Typography>
                  ) : (
                    <Typography variant="caption" className="text-gray-500 mt-2" id="username-help">
                      Choose a handle that shows who you are—feel free to get creative or keep it simple.
                    </Typography>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-bold text-gray-900 mb-3">
                    Location 📍
                  </label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State or Region"
                    className="rounded-xl border-2 p-4"
                  />
                  <Typography variant="caption" className="text-gray-500 mt-2">
                    Let folks know where you're thriving from.
                  </Typography>
                </div>

                <div>
                  <label htmlFor="role_age_range" className="block text-sm font-bold text-gray-900 mb-3">
                    Role & Age Range 👥
                  </label>
                  <select
                    id="role_age_range"
                    value={formData.role_age_range}
                    onChange={(e) => handleInputChange('role_age_range', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl py-4 px-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="">-- Select your role --</option>
                    <option value="Older Adult (55+)">Older Adult (55+)</option>
                    <option value="Family Member">Family Member</option>
                    <option value="Caregiver">Caregiver</option>
                  </select>
                  <Typography variant="caption" className="text-gray-500 mt-2">
                    Helps match you with the right conversations and resources.
                  </Typography>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-bold text-gray-900 mb-3">
                    Website 🌐
                  </label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    error={!!errors.website}
                    placeholder="https://yourawesome.website"
                    className="rounded-xl border-2 p-4"
                    aria-describedby={errors.website ? "website-error" : undefined}
                  />
                  {errors.website && (
                    <Typography variant="caption" className="text-red-600 mt-2 font-semibold" id="website-error">
                      {errors.website}
                    </Typography>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-3">
                    Phone Number 📱
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!errors.phone}
                    placeholder="+1 (555) 123-4567"
                    className="rounded-xl border-2 p-4"
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <Typography variant="caption" className="text-red-600 mt-2 font-semibold" id="phone-error">
                      {errors.phone}
                    </Typography>
                  )}
                </div>

                <div>
                  <label htmlFor="birth_date" className="block text-sm font-bold text-gray-900 mb-3">
                    Birth Date 🎂
                  </label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange('birth_date', e.target.value)}
                    className="rounded-xl border-2 p-4"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="bio" className="block text-sm font-bold text-gray-900 mb-3">
                  Bio ✍️
                </label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  error={!!errors.bio}
                  placeholder="Tell us about yourself in one sentence."
                  rows={4}
                  className="rounded-xl border-2 p-4"
                  aria-describedby={errors.bio ? "bio-error" : "bio-help"}
                />
                <div className="flex justify-between mt-2">
                  {errors.bio ? (
                    <Typography variant="caption" className="text-red-600 font-semibold" id="bio-error">
                      {errors.bio}
                    </Typography>
                  ) : (
                    <Typography variant="caption" className="text-gray-500" id="bio-help">
                      Share your passion or purpose—why you're here in Thrive Nation.
                    </Typography>
                  )}
                  <Typography variant="caption" className={`font-semibold ${formData.bio.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.bio.length}/500
                  </Typography>
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="fun_introduction" className="block text-sm font-bold text-gray-900 mb-3">
                  Fun Introduction 🎭
                </label>
                <Textarea
                  id="fun_introduction"
                  value={formData.fun_introduction}
                  onChange={(e) => handleInputChange('fun_introduction', e.target.value)}
                  error={!!errors.fun_introduction}
                  placeholder="If I had one superpower…"
                  rows={3}
                  className="rounded-xl border-2 p-4"
                  aria-describedby={errors.fun_introduction ? "fun-intro-error" : "fun-intro-help"}
                />
                <div className="flex justify-between mt-2">
                  {errors.fun_introduction ? (
                    <Typography variant="caption" className="text-red-600 font-semibold" id="fun-intro-error">
                      {errors.fun_introduction}
                    </Typography>
                  ) : (
                    <Typography variant="caption" className="text-gray-500" id="fun-intro-help">
                      Break the ice with a quip, hobby, or dream.
                    </Typography>
                  )}
                  <Typography variant="caption" className={`font-semibold ${formData.fun_introduction.length > 180 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.fun_introduction.length}/200
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Social Media Links */}
            <Card variant="glass" className="p-8 shadow-modern-lg">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <Typography variant="h2" className="text-2xl font-bold text-gray-900">
                  Social Media Links 🔗
                </Typography>
              </div>
              
              <Typography variant="body" className="text-gray-600 mb-6">
                Want to keep the conversation going elsewhere? Drop your links so we can stay connected.
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="twitter_url" className="block text-sm font-bold text-gray-900 mb-3">
                    Twitter/X Profile 🐦
                  </label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    error={!!errors.twitter_url}
                    placeholder="https://twitter.com/yourusername"
                    className="rounded-xl border-2 p-4"
                  />
                  {errors.twitter_url && (
                    <Typography variant="caption" className="text-red-600 mt-2 font-semibold">
                      {errors.twitter_url}
                    </Typography>
                  )}
                </div>

                <div>
                  <label htmlFor="linkedin_url" className="block text-sm font-bold text-gray-900 mb-3">
                    LinkedIn Profile 💼
                  </label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    error={!!errors.linkedin_url}
                    placeholder="https://linkedin.com/in/yourusername"
                    className="rounded-xl border-2 p-4"
                  />
                  {errors.linkedin_url && (
                    <Typography variant="caption" className="text-red-600 mt-2 font-semibold">
                      {errors.linkedin_url}
                    </Typography>
                  )}
                </div>

                <div>
                  <label htmlFor="instagram_url" className="block text-sm font-bold text-gray-900 mb-3">
                    Instagram Profile 📸
                  </label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={formData.instagram_url}
                    onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                    error={!!errors.instagram_url}
                    placeholder="https://instagram.com/yourusername"
                    className="rounded-xl border-2 p-4"
                  />
                  {errors.instagram_url && (
                    <Typography variant="caption" className="text-red-600 mt-2 font-semibold">
                      {errors.instagram_url}
                    </Typography>
                  )}
                </div>

                <div>
                  <label htmlFor="facebook_url" className="block text-sm font-bold text-gray-900 mb-3">
                    Facebook Profile 👥
                  </label>
                  <Input
                    id="facebook_url"
                    type="url"
                    value={formData.facebook_url}
                    onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                    error={!!errors.facebook_url}
                    placeholder="https://facebook.com/yourusername"
                    className="rounded-xl border-2 p-4"
                  />
                  {errors.facebook_url && (
                    <Typography variant="caption" className="text-red-600 mt-2 font-semibold">
                      {errors.facebook_url}
                    </Typography>
                  )}
                </div>
              </div>
            </Card>

            {/* Privacy Settings */}
            <Card variant="glass" className="p-8 shadow-modern-lg">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Typography variant="h2" className="text-2xl font-bold text-gray-900">
                  Privacy Settings 🔒
                </Typography>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100">
                  <div>
                    <Typography variant="body" className="font-bold text-gray-900 text-lg">
                      Hide Email Address 📧
                    </Typography>
                    <Typography variant="caption" className="text-gray-600 text-base">
                      Keep your email address private from other users
                    </Typography>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.privacy_email}
                      onChange={(e) => handleInputChange('privacy_email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100">
                  <div>
                    <Typography variant="body" className="font-bold text-gray-900 text-lg">
                      Private Profile 🔐
                    </Typography>
                    <Typography variant="caption" className="text-gray-600 text-base">
                      Only approved followers can see your posts and profile
                    </Typography>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.privacy_profile}
                      onChange={(e) => handleInputChange('privacy_profile', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
                  </label>
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card variant="glass" className="p-8 shadow-modern-lg">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 19.718l8.485-8.485a2 2 0 012.829 0l1.414 1.414a2 2 0 010 2.829l-8.485 8.485A2 2 0 017.697 24H4a1 1 0 01-1-1v-3.697a2 2 0 01.586-1.414z" />
                  </svg>
                </div>
                <Typography variant="h2" className="text-2xl font-bold text-gray-900">
                  Notification Preferences 🔔
                </Typography>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-2 border-green-100">
                  <div>
                    <Typography variant="body" className="font-bold text-gray-900 text-lg">
                      Email Notifications 📬
                    </Typography>
                    <Typography variant="caption" className="text-gray-600 text-base">
                      Receive notifications via email
                    </Typography>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications_email}
                      onChange={(e) => handleInputChange('notifications_email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-600 peer-checked:to-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-100">
                  <div>
                    <Typography variant="body" className="font-bold text-gray-900 text-lg">
                      Push Notifications 📱
                    </Typography>
                    <Typography variant="caption" className="text-gray-600 text-base">
                      Receive push notifications in your browser
                    </Typography>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications_push}
                      onChange={(e) => handleInputChange('notifications_push', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-600 peer-checked:to-orange-600"></div>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Avatar and Actions */}
          <div className="space-y-8">
            {/* Profile Photo */}
            <Card variant="glass" className="p-8 text-center shadow-modern-lg">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <Typography variant="h2" className="text-xl font-bold text-gray-900">
                  Profile Photo 📸
                </Typography>
              </div>
              
              <Typography variant="body" className="text-gray-600 mb-6">
                A great photo helps others recognize and trust you.
              </Typography>
              
              <div className="mb-8">
                <div className="relative inline-block">
                  <Avatar
                    src={avatarPreview}
                    alt="Profile photo"
                    size="xl"
                    fallback={formData.username}
                    className="mx-auto ring-4 ring-gradient-to-r from-blue-200 to-purple-200 shadow-modern-lg hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                aria-describedby="avatar-help"
              />
              <label
                htmlFor="avatar"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl font-bold cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Photo ✨
              </label>
              
              <Typography variant="caption" className="text-gray-500 block mt-4 text-sm" id="avatar-help">
                Upload a clear, friendly headshot. JPG, PNG or GIF. Max size 5MB. 📏
              </Typography>
              
              {(errors as any).avatar && (
                <Typography variant="caption" className="text-red-600 block mt-2 font-semibold">
                  {(errors as any).avatar}
                </Typography>
              )}
            </Card>

            {/* Action Buttons */}
            <Card variant="glass" className="p-8 shadow-modern-lg">
              <div className="space-y-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isPending || !hasChanges}
                  className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Magic... ✨
                    </div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes 🚀
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending || !hasChanges}
                  className="w-full py-4 text-lg font-bold rounded-2xl border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  Cancel Changes 🔄
                </Button>
              </div>

              {/* Auto-save status */}
              {autoSaveStatus !== 'idle' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
                  <Typography variant="caption" className="text-blue-800 font-bold text-center block">
                    {autoSaveStatus === 'saving' ? '💾 Auto-saving your awesome changes...' : '✅ All changes saved perfectly!'}
                  </Typography>
                </div>
              )}

              {hasChanges && autoSaveStatus === 'idle' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl">
                  <Typography variant="caption" className="text-yellow-800 font-bold text-center block">
                    ⚠️ You have unsaved changes
                  </Typography>
                </div>
              )}

              {isError && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl">
                  <Typography variant="caption" className="text-red-800 font-bold text-center block">
                    😔 Error saving profile: {error?.message || 'Please try again.'}
                  </Typography>
                </div>
              )}
            </Card>

            {/* Data Management */}
            <Card variant="glass" className="p-8 shadow-modern-lg">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <Typography variant="h2" className="text-xl font-bold text-gray-900">
                  Data Management 📊
                </Typography>
              </div>
              
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={exportProfileData}
                  className="w-full py-3 rounded-2xl border-2 border-green-300 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all duration-200 font-bold"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Profile Data 📤
                </Button>
                
                <div>
                  <input
                    type="file"
                    id="import-profile"
                    accept=".json"
                    onChange={importProfileData}
                    className="hidden"
                  />
                  <label
                    htmlFor="import-profile"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-blue-300 rounded-2xl shadow-sm text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Import Profile Data 📥
                  </label>
                </div>
              </div>
              
              <Typography variant="caption" className="text-gray-500 block mt-4 text-center text-sm">
                Export your profile as JSON or import from a backup! 💾✨
              </Typography>
            </Card>
          </div>
        </div>
      </form>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        imageSrc={selectedImageSrc}
        onClose={() => setShowCropModal(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};