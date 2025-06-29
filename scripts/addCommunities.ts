import { supabase } from "./supabase-script-client.js";

const communities = [
  {
    name: "Technology",
    description: "Discuss the latest in tech, programming, and innovation"
  },
  {
    name: "Gaming",
    description: "Share your gaming experiences, reviews, and discussions"
  },
  {
    name: "Science",
    description: "Explore scientific discoveries, research, and theories"
  },
  {
    name: "Art & Design",
    description: "Showcase creative work and discuss design principles"
  },
  {
    name: "Music",
    description: "Share and discuss all genres of music"
  }
];

async function addCommunities() {
  try {
    console.log("Adding sample communities...");
    
    const { data, error } = await supabase
      .from("communities")
      .insert(communities)
      .select();
    
    if (error) {
      console.error("Error adding communities:", error);
      process.exit(1);
    }
    
    console.log("Successfully added communities:", data);
    console.log(`Added ${data?.length} communities to the database`);
    
  } catch (error) {
    console.error("Failed to add communities:", error);
    process.exit(1);
  }
}

addCommunities();