import { CreatePost } from "../components/CreatePost";
import { Typography } from "../components/ui/Typography";

export const CreatePostPage = () => {
  return (
    <div className="pt-20">
      <Typography variant="h1" className="mb-6 text-center text-st_light_blue">
        Create New Post
      </Typography>
      <CreatePost />
    </div>
  );
};