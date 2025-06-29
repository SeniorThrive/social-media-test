import { CommunityList } from "../components/CommunityList";
import { Typography } from "../components/ui/Typography";

export const CommunitiesPage = () => {
  return (
    <div className="pt-20">
      <Typography variant="h1" className="mb-6 text-center text-st_light_blue">
        Communities
      </Typography>
      <CommunityList />
    </div>
  );
};