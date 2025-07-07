import React from 'react';
import HabitFlowLanding from '../components/ui/HabitFlowLanding';

interface LandingProps {
  onGetStarted?: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  console.log('Landing component received onGetStarted:', !!onGetStarted);
  
  const handleGetStarted = () => {
    console.log('Landing handleGetStarted called');
    if (onGetStarted) {
      onGetStarted();
    } else {
      console.error('onGetStarted not provided to Landing component');
    }
  };
  
  return <HabitFlowLanding onGetStarted={handleGetStarted} />;
};

export default Landing;