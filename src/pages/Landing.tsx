import React from 'react';
import { Component as HorizonHero } from '../components/ui/horizon-hero-section';
import Features3D from '../components/landing/Features3D';
import ProjectShowcase from '../components/landing/ProjectShowcase';
import TechStack3D from '../components/landing/TechStack3D';
import CallToAction3D from '../components/landing/CallToAction3D';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HorizonHero />
      <Features3D />
      <ProjectShowcase />
      <TechStack3D />
      <CallToAction3D />
    </div>
  );
};

export default Landing;