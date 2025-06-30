import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Typography } from "../components/ui/Typography";
import { Avatar } from "../components/ui/Avatar";

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
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [hasChanges, setHasChanges] = useState(false);

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
    },
  });

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

    // Optional field validation
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Website must be a valid URL (include http:// or https://)';
    }

    if (formData.phone && !formData.phone.match(/^[\+]?[1-9][\d]{0,15}$/)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
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

      setAvatarFile(file);
      setHasChanges(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      });
      setAvatarPreview((profile as any).avatar_url || '');
    }
    setAvatarFile(null);
    setHasChanges(false);
    setErrors({});
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <Card className="p-8 max-w-md mx-auto text-center">
          <Typography variant="h2" className="mb-4">
            Please Sign In
          </Typography>
          <Typography variant="body" className="text-gray-600">
            You need to be signed in to access your profile.
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h1" className="mb-2 text-3xl font-bold text-gray-900">
            Profile Settings
          </Typography>
          <Typography variant="body" className="text-gray-600">
            Manage your profile information and privacy settings
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="p-6">
                <Typography variant="h2" className="mb-6 text-xl font-semibold text-gray-900">
                  Basic Information
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                      Username *
                    </label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      error={!!errors.username}
                      placeholder="Enter your username"
                      aria-describedby={errors.username ? "username-error" : undefined}
                    />
                    {errors.username && (
                      <Typography variant="caption" className="text-red-600 mt-1" id="username-error">
                        {errors.username}
                      </Typography>
                    )}
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
                      Location
                    </label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-900 mb-2">
                      Website
                    </label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      error={!!errors.website}
                      placeholder="https://yourwebsite.com"
                      aria-describedby={errors.website ? "website-error" : undefined}
                    />
                    {errors.website && (
                      <Typography variant="caption" className="text-red-600 mt-1" id="website-error">
                        {errors.website}
                      </Typography>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={!!errors.phone}
                      placeholder="+1 (555) 123-4567"
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && (
                      <Typography variant="caption" className="text-red-600 mt-1" id="phone-error">
                        {errors.phone}
                      </Typography>
                    )}
                  </div>

                  <div>
                    <label htmlFor="birth_date" className="block text-sm font-medium text-gray-900 mb-2">
                      Birth Date
                    </label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-900 mb-2">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    error={!!errors.bio}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    aria-describedby={errors.bio ? "bio-error" : "bio-help"}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.bio ? (
                      <Typography variant="caption" className="text-red-600" id="bio-error">
                        {errors.bio}
                      </Typography>
                    ) : (
                      <Typography variant="caption" className="text-gray-500" id="bio-help">
                        Optional. Tell others about yourself.
                      </Typography>
                    )}
                    <Typography variant="caption" className="text-gray-500">
                      {formData.bio.length}/500
                    </Typography>
                  </div>
                </div>
              </Card>

              {/* Privacy Settings */}
              <Card className="p-6">
                <Typography variant="h2" className="mb-6 text-xl font-semibold text-gray-900">
                  Privacy Settings
                </Typography>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body" className="font-medium text-gray-900">
                        Hide Email Address
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body" className="font-medium text-gray-900">
                        Private Profile
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </Card>

              {/* Notification Settings */}
              <Card className="p-6">
                <Typography variant="h2" className="mb-6 text-xl font-semibold text-gray-900">
                  Notification Preferences
                </Typography>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body" className="font-medium text-gray-900">
                        Email Notifications
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body" className="font-medium text-gray-900">
                        Push Notifications
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Avatar and Actions */}
            <div className="space-y-6">
              {/* Profile Photo */}
              <Card className="p-6">
                <Typography variant="h2" className="mb-6 text-xl font-semibold text-gray-900">
                  Profile Photo
                </Typography>
                
                <div className="text-center">
                  <div className="mb-4">
                    <Avatar
                      src={avatarPreview}
                      alt="Profile photo"
                      size="xl"
                      fallback={formData.username}
                      className="mx-auto ring-4 ring-gray-100"
                    />
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
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Change Photo
                  </label>
                  
                  <Typography variant="caption" className="text-gray-500 block mt-2" id="avatar-help">
                    JPG, PNG or GIF. Max size 5MB.
                  </Typography>
                  
                  {(errors as any).avatar && (
                    <Typography variant="caption" className="text-red-600 block mt-1">
                      {(errors as any).avatar}
                    </Typography>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <Card className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isPending || !hasChanges}
                    className="w-full"
                  >
                    {isPending ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isPending || !hasChanges}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>

                {hasChanges && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <Typography variant="caption" className="text-yellow-800">
                      You have unsaved changes
                    </Typography>
                  </div>
                )}

                {isError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <Typography variant="caption" className="text-red-800">
                      Error saving profile: {error?.message || 'Please try again.'}
                    </Typography>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};