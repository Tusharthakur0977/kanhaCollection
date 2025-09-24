import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (for use in pages router or client components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase client specifically for client components (with auth helpers)
export const createSupabaseClient = () => createClientComponentClient();
