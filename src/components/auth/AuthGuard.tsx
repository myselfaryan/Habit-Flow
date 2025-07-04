import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import AuthModal from './AuthModal';
import { Loader2, Target } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Welcome to HabitFlow
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Transform your daily routines with smart habit tracking and task management.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Get Started
            </button>
            
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Smart</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Habit Tracking</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Advanced</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Task Management</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Beautiful</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Analytics</div>
              </div>
            </div>
          </div>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthGuard;