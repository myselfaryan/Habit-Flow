import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Initializing authentication...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('useAuth: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuth: Error getting session:', error);
          setSession(null);
          setUser(null);
        } else {
          console.log('useAuth: Initial session:', session ? 'Found' : 'None');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('useAuth: Failed to get initial session:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state change:', event, session ? 'Session exists' : 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('useAuth: User signed in:', session?.user?.email);
            break;
          case 'SIGNED_OUT':
            console.log('useAuth: User signed out');
            // Clear any cached data
            localStorage.removeItem('supabase.auth.token');
            sessionStorage.clear();
            break;
          case 'TOKEN_REFRESHED':
            console.log('useAuth: Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log('useAuth: User updated');
            break;
          case 'PASSWORD_RECOVERY':
            console.log('useAuth: Password recovery initiated');
            break;
        }
      }
    );

    return () => {
      console.log('useAuth: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      console.log('useAuth: Signing out...');
      
      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('useAuth: Sign out error:', error);
        throw error;
      }
      
      console.log('useAuth: Sign out successful');
      
      // Force state update
      setSession(null);
      setUser(null);
      
    } catch (error) {
      console.error('useAuth: Failed to sign out:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
};