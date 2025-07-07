import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthModal from '../components/auth/AuthModal';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { theme } = useTheme();

  // Redirect to app if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#030303]' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      <div className={`absolute inset-0 blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-blue-500/[0.05]'
          : 'bg-gradient-to-br from-emerald-500/[0.1] via-transparent to-blue-500/[0.1]'
      }`} />
      
      <AuthModal 
        isOpen={true} 
        onClose={handleClose} 
      />
    </div>
  );
};

export default Auth;