import React from 'react';
import HabitFlowLanding from '../components/ui/HabitFlowLanding';

interface LandingProps {
  onGetStarted?: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  return <HabitFlowLanding onGetStarted={onGetStarted} />;
};

export default Landing;