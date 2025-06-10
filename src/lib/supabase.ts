import { createClient } from '@supabase/supabase-js';

// Supabase configuration using the provided Project URL and Anon Key
const supabaseUrl = 'https://mchzrmrvgemplhktdwls.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jaHpybXJ2Z2VtcGxoa3Rkd2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDQ5ODksImV4cCI6MjA2NTAyMDk4OX0.ZTjK209qGwuvrcykuTHK-JsZGXn9NRhmSgVbKjU463Q';

/**
 * Helper function to get the correct absolute redirect URL dynamically.
 * This URL is used by OAuth providers (like GitHub) and Supabase to redirect
 * the user back to the application after authentication. It must be an absolute URL.
 * It will work whether the app is hosted locally, on localhost with any port, or on any domain.
 */
export function getURL(): string {
  // For client-side, use window.location.href for the most accurate current URL.
  // This ensures the user returns to the exact page they were on, including path and query parameters.
  if (typeof window !== 'undefined') {
    return window.location.href;
  }

  // Fallback for server-side rendering or build environments.
  // Prioritize environment variables, then default to a common local development URL.
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.VITE_SITE_URL ??
    process?.env?.VERCEL_URL ??
    'http://localhost:8080/'; // Default fallback

  // Ensure protocol is present
  url = url.includes('http') ? url : `https://${url}`;
  // Ensure trailing slash for consistency
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

  return url;
}

/**
 * Helper function to get the base path of the application.
 * This is useful for configuring React Router's basename or for constructing
 * relative paths to assets, especially when deployed to a subdirectory (e.g., GitHub Pages).
 * It attempts to infer the base path from the current URL's pathname.
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') {
    // In server-side environments, the base path might need to be configured
    // via environment variables or build settings. For now, return an empty string
    // assuming root deployment or that the build system handles it.
    return '';
  }

  const pathname = window.location.pathname;
  // Example: If URL is https://user.github.io/repo-name/index.html
  // pathname will be /repo-name/index.html
  // We want /repo-name/
  const parts = pathname.split('/');
  // Filter out empty strings and 'index.html'
  const relevantParts = parts.filter(part => part !== '' && part !== 'index.html');

  if (relevantParts.length > 0) {
    // Assuming the first part after the root is the base path (e.g., 'repo-name')
    // This is a common pattern for GitHub Pages where the base is /<repo-name>/
    return `/${relevantParts[0]}/`;
  }

  // If no relevant parts, it's likely served from the root
  return '/';
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
