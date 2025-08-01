import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client if environment variables are missing
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using fallback configuration.');
  // Create a mock client that won't break the app
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  };
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export { supabase };

// Auth helpers
export const signUp = async (email: string, password: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: null, error: new Error('Supabase configuration missing. Please set up your environment variables.') };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: null, error: new Error('Supabase configuration missing. Please set up your environment variables.') };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  try {
    // Always clear local storage first
    localStorage.clear();
    sessionStorage.clear();
    
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      // For development without Supabase, just return success
      return { error: null };
    }
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    // Clear storage again after Supabase signout
    localStorage.clear();
    sessionStorage.clear();
    
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    // Even if there's an error, clear local storage
    localStorage.clear();
    sessionStorage.clear();
    return { error };
  }
};
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};