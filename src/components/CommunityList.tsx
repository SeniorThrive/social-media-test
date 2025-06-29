import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";
import { Card } from "./ui/Card";
import { Typography } from "./ui/Typography";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading)
    return (
      <Typography variant="body" className="text-center py-4">
        Loading communities...
      </Typography>
    );
  
  if (error)
    return (
      <Typography variant="body" className="text-center text-st_dark_red py-4">
        Error: {error.message}
      </Typography>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community) => (
        <Card key={community.id} className="hover:shadow-lg transition-shadow duration-200">
          <Link
            to={`/community/${community.id}`}
            className="block"
          >
            <Typography variant="h2" className="text-st_light_blue hover:underline mb-2">
              {community.name}
            </Typography>
            <Typography variant="body" className="text-st_taupe">
              {community.description}
            </Typography>
          </Link>
        </Card>
      ))}
    </div>
  );
};