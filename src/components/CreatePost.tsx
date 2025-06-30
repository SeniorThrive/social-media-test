import { ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { Community, fetchCommunities } from "./CommunityList";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Typography } from "./ui/Typography";
import { Card } from "./ui/Card";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setContent(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Typography variant="h1" className="mb-4 text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Share Your Story ✨
          </Typography>
          <Typography variant="body" className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create a post that inspires, helps, or connects with the community. Your voice matters!
          </Typography>
        </div>

        <Card variant="glass" className="p-8 shadow-modern-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Input */}
            <div>
              <Typography variant="body" className="block mb-3 font-semibold text-gray-900 text-lg">
                Post Title
              </Typography>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your story about?"
                required
                className="text-lg p-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            {/* Content Input with Emoji Picker */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Typography variant="body" className="font-semibold text-gray-900 text-lg">
                  Your Story
                </Typography>
                <div className="flex items-center space-x-2">
                  <Typography variant="caption" className="text-gray-500">
                    {content.length}/2000
                  </Typography>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-xl transition-all duration-200 hover:scale-110"
                    title="Add emoji"
                  >
                    😊
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your experience, tips, or thoughts with the community... 💭"
                  rows={6}
                  required
                  className="text-base p-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 resize-none"
                  maxLength={2000}
                />
                
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 z-50 mt-2 shadow-modern-xl rounded-2xl overflow-hidden">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={350}
                      height={400}
                      searchDisabled={false}
                      skinTonesDisabled={false}
                      previewConfig={{
                        showPreview: false
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Community Selection */}
            <div>
              <Typography variant="body" className="block mb-3 font-semibold text-gray-900 text-lg">
                Choose Community
              </Typography>
              <select 
                id="community" 
                onChange={handleCommunityChange}
                className="w-full border-2 border-gray-200 rounded-2xl py-4 px-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">-- Select a Community --</option>
                {communities?.map((community, key) => (
                  <option key={key} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <Typography variant="body" className="block mb-3 font-semibold text-gray-900 text-lg">
                Add Image (Optional)
              </Typography>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Post preview"
                    className="w-full h-64 object-cover rounded-2xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors bg-gradient-to-br from-gray-50 to-white">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <Typography variant="body" className="text-gray-600 mb-2 text-lg">
                    Upload an image to make your post shine ✨
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </Typography>
                </div>
              )}
              
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-4 w-full text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-purple-50 file:text-blue-700 hover:file:from-blue-100 hover:file:to-purple-100 transition-all duration-200"
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                variant="primary"
                disabled={isPending || !title.trim() || !content.trim()}
                className="flex-1 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Magic... ✨
                  </div>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Share Your Story 🚀
                  </>
                )}
              </Button>
            </div>
            
            {/* Error Message */}
            {isError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                <Typography variant="body" className="text-red-700 font-semibold">
                  Oops! Something went wrong. Please try again. 😔
                </Typography>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};