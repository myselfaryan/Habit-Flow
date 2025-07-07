import React from 'react';
import { useNavigate } from 'react-router-dom';
import HabitFlowLanding from '../components/ui/HabitFlowLanding';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    console.log('Landing handleGetStarted called, navigating to /auth');
    navigate('/auth');
  };
  
  return <HabitFlowLanding onGetStarted={handleGetStarted} />;
};

export default Landing;