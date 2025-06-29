import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const supabaseURL = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseURL || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check your .env file.");
}

export const supabase = createClient(supabaseURL, supabaseAnonKey);