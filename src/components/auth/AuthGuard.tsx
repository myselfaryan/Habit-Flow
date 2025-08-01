import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Loader2, Target, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { theme } = useTheme();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionError, setConnectionError] = useState<string>('');

  // Check if Supabase is configured
  const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  // Debug authentication state
  useEffect(() => {
    console.log('AuthGuard - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading);
  }, [isAuthenticated, authLoading]);

  // Test Supabase connection
  useEffect(() => {
    const testConnection = async () => {
      if (!isSupabaseConfigured) {
        setConnectionStatus('error');
        setConnectionError('Environment variables not configured');
        return;
      }

      try {
        // Try to get the current session to test connection
        const { data, error } = await supabase.auth.getSession();
        if (error && error.message.includes('Invalid API key')) {
          setConnectionStatus('error');
          setConnectionError('Invalid Supabase API key');
        } else {
          setConnectionStatus('connected');
        }
      } catch (error) {
        setConnectionStatus('error');
        setConnectionError(error instanceof Error ? error.message : 'Connection failed');
      }
    };

    testConnection();
  }, [isSupabaseConfigured]);

  // Show loading spinner while checking auth and connection
  if (authLoading || connectionStatus === 'checking') {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-[#030303]' 
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
      }`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {connectionStatus === 'checking' ? 'Connecting to database...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Show configuration error if Supabase is not configured or connection failed
  if (!isSupabaseConfigured || connectionStatus === 'error') {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-[#030303]' 
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
      }`}>
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-red-900 to-orange-900 dark:from-white dark:via-red-200 dark:to-orange-200 bg-clip-text text-transparent">
            Database Connection Issue
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {!isSupabaseConfigured 
              ? 'HabitFlow requires Supabase configuration to function properly.'
              : `Unable to connect to the database: ${connectionError}`
            }
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-left mb-6">
            <div className="flex items-center mb-4">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              <h3 className="font-medium">Configuration Status:</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Supabase URL:</span>
                <div className="flex items-center">
                  {import.meta.env.VITE_SUPABASE_URL ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className="text-sm font-mono">
                    {import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Supabase Anon Key:</span>
                <div className="flex items-center">
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className="text-sm font-mono">
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connection:</span>
                <div className="flex items-center">
                  {connectionStatus === 'connected' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className="text-sm font-mono">
                    {connectionStatus === 'connected' ? 'Connected' : 'Failed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left mb-6">
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                For Developers:
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                Add these environment variables to your deployment:
              </p>
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded p-3 font-mono text-xs">
                <div>VITE_SUPABASE_URL=your_supabase_url</div>
                <div>VITE_SUPABASE_ANON_KEY=your_anon_key</div>
              </div>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected children
  return <>{children}</>;
};

export default AuthGuard;