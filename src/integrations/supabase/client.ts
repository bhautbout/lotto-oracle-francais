// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tlgkqdbpwfesbjhbxjkf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2txZGJwd2Zlc2JqaGJ4amtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjQ0NjksImV4cCI6MjA1OTIwMDQ2OX0.iUDz32xUXCOhnQHWWmH3nP_ev-xqdc2wM284O96VoiQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);