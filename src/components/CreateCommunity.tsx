import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Typography } from "./ui/Typography";
import { Card } from "./ui/Card";

interface CommunityInput {
  name: string;
  description: string;
  image_url: string;
}

const createCommunity = async (community: CommunityInput, imageFile?: File) => {
  let imageUrl = '';

  // Upload image if provided
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${community.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
    const filePath = `community-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('community-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('community-images')
      .getPublicUrl(filePath);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error, data } = await supabase
    .from("communities")
    .insert({
      ...community,
      image_url: imageUrl
    })
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  // Redirect non-moderators
  if (!profile?.is_moderator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <Typography variant="h2" className="mb-4 text-gray-900">
            Access Restricted
          </Typography>
          <Typography variant="body" className="text-gray-600 mb-6">
            Only moderators can create new communities. If you believe you should have moderator access, please contact an administrator.
          </Typography>
          <Button variant="primary" onClick={() => navigate("/communities")}>
            Browse Communities
          </Button>
        </Card>
      </div>
    );
  }

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { community: CommunityInput; imageFile?: File }) =>
      createCommunity(data.community, data.imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      community: { name, description, image_url: "" },
      imageFile: selectedFile || undefined,
    });
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

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Typography variant="h1" className="mb-4 text-4xl font-bold text-gray-900">
            Create New Community
          </Typography>
          <Typography variant="body" className="text-gray-600 text-lg max-w-2xl mx-auto">
            Start a new community and bring together people who share your interests and experiences.
          </Typography>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Community Image Upload */}
            <div>
              <Typography variant="body" className="block mb-3 font-medium text-gray-900">
                Community Image
              </Typography>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Community preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <Typography variant="body" className="text-gray-600 mb-2">
                    Upload a community image
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
                className="mt-3 w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
              />
            </div>
            
            {/* Community Name */}
            <div>
              <Typography variant="body" className="block mb-3 font-medium text-gray-900">
                Community Name *
              </Typography>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter community name"
                required
                className="text-base"
              />
            </div>
            
            {/* Community Description */}
            <div>
              <Typography variant="body" className="block mb-3 font-medium text-gray-900">
                Description
              </Typography>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your community is about..."
                rows={4}
                className="text-base"
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isPending || !name.trim()}
                className="flex-1 py-3 text-base font-semibold"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Community...
                  </div>
                ) : (
                  "Create Community"
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/communities")}
                className="px-6 py-3 text-base"
              >
                Cancel
              </Button>
            </div>
            
            {/* Error Message */}
            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Typography variant="body" className="text-red-700">
                  Error creating community: {error?.message || "Please try again."}
                </Typography>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};