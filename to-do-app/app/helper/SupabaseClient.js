
//instance of the supabase project

import { createClient } from "@supabase/supabase-js"; //to create the instance

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseURL, supabaseAnonKey); //instance of supabase

export default supabase;


