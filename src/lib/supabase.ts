import { createClient } from '@supabase/supabase-js';

// Supabase configuration using the provided Project URL and Anon Key
const supabaseUrl = 'https://mchzrmrvgemplhktdwls.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jaHpybXJ2Z2VtcGxoa3Rkd2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDQ5ODksImV4cCI6MjA2NTAyMDk4OX0.ZTjK209qGwuvrcykuTHK-JsZGXn9NRhmSgVbKjU463Q';

/**
 * Helper function to get the correct redirect URL dynamically
 * This will work whether the app is hosted locally, on localhost with any port, or on any domain.
 */
export function getURL() {
  // Check for environment variables first (for server-side environments)
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Next.js specific environment variable
    process?.env?.VITE_SITE_URL ?? // Vite specific environment variable
    process?.env?.VERCEL_URL ?? // Vercel environment variable
    'http://localhost:8080/'; // Fallback for local development

  // Make sure to include `https://` when not localhost
  url = url.includes('http') ? url : `https://${url}`;
  
  // Make sure to include a trailing `/` if not present
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  
  // For client-side, use window.location for the most accurate current URL
  if (typeof window !== 'undefined') {
    // Use window.location.href to get the full current URL including path and query parameters
    // This ensures the user returns to the exact page they were on
    return window.location.href;
  }

  return url;
}

// Create a single supabase client for interacting with your database
// The storageKey is set to be specific to this project.
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'pathToPython-auth-storage', // Unique storage key for this application
  },
});

// Handle potential initialization errors
if (!supabase) {
  console.error('Failed to initialize Supabase client');
  throw new Error('Supabase client initialization failed');
}

// Export the supabase client as a singleton
export default supabase;

// Type definitions for profile data
export type Profile = {
  id: string;
  username: string | null;
  updated_at: string;
  created_at: string;
};

// Helper function to check if Supabase is connected
export const checkSupabaseConnection = async () => {
  try {
    // A simple query to check if the connection is working
    // This assumes a 'profiles' table exists, which will be created via SQL later.
    const { error } = await supabase.from('profiles').select('count', { count: 'exact' }).limit(0);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};
