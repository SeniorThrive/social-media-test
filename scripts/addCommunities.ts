import { supabase } from '../src/supabase-client';

const communitiesToAdd = [
  { name: 'Professional Caregiver Insights', description: 'Discussions and tips for professional caregivers.' },
  { name: 'Family Caregiver Support', description: 'A supportive space for family caregivers to share experiences and advice.' },
  { name: 'Sandwich Generation Challenges', description: 'Navigating the unique challenges of caring for both children and aging parents.' },
  { name: 'Home Safety & DIY Fixes', description: 'Tips and projects for making homes safer and more accessible.' },
  { name: 'Fall Prevention Strategies', description: 'Sharing effective methods and products to prevent falls.' },
  { name: 'Gardening & Indoor Plants', description: 'For enthusiasts of gardening, both outdoors and indoors.' },
  { name: 'Healthy Cooking for One or Two', description: 'Recipes and ideas for nutritious meals for smaller households.' },
  { name: 'Brain Games & Memory Exercises', description: 'Activities and resources to keep your mind sharp.' },
  { name: 'Tech Tips: Smart Home & Devices', description: 'Discussions and help with smart home technology and other devices.' },
  { name: 'Family Stories & Life Memoirs', description: 'A place to share personal stories and preserve family history.' },
  { name: 'Caregiver Self‑Care & Resources', description: 'Prioritizing well-being for caregivers with resources and support.' },
  { name: 'Pet Companionship & Therapy Animals', description: 'The joys and benefits of pets, including therapy animals.' },
  { name: 'Local Events & Meetups', description: 'Connecting with others through local activities and gatherings.' },
];

async function addCommunities() {
  console.log('Attempting to add communities...');
  
  for (const community of communitiesToAdd) {
    try {
      const { data, error } = await supabase
        .from('communities')
        .insert([community])
        .select();

      if (error) {
        console.error(`Error adding community "${community.name}":`, error.message);
      } else {
        console.log(`Successfully added community "${community.name}".`);
      }
    } catch (err) {
      console.error(`Unexpected error adding community "${community.name}":`, err);
    }
  }
  
  console.log('Finished attempting to add all communities.');
  process.exit(0);
}

addCommunities().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});