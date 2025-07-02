import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, CheckSquare, BarChart3, Zap, Shield, Smartphone } from 'lucide-react';
import * as THREE from 'three';

// 3D Feature Icon Component
function Feature3DIcon({ type, color }: { type: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef}>
        {type === 'habits' && (
          <Cylinder args={[0.5, 0.5, 0.2, 8]}>
            <meshStandardMaterial color={color} />
          </Cylinder>
        )}
        {type === 'tasks' && (
          <Box args={[0.8, 0.8, 0.2]}>
            <meshStandardMaterial color={color} />
          </Box>
        )}
        {type === 'analytics' && (
          <group>
            <Box args={[0.2, 0.8, 0.2]} position={[-0.3, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.2, 1.2, 0.2]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.2, 0.6, 0.2]} position={[0.3, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
          </group>
        )}
        {type === 'performance' && (
          <Sphere args={[0.5]}>
            <meshStandardMaterial color={color} />
          </Sphere>
        )}
        {type === 'security' && (
          <group>
            <Cylinder args={[0.4, 0.6, 0.8, 6]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            <Sphere args={[0.2]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
          </group>
        )}
        {type === 'mobile' && (
          <Box args={[0.5, 0.8, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color={color} />
          </Box>
        )}
      </group>
    </Float>
  );
}

const Features3D: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Target,
      title: 'Smart Habit Tracking',
      description: 'Build lasting habits with intelligent tracking, streaks, and personalized insights.',
      color: '#3B82F6',
      type: 'habits',
    },
    {
      icon: CheckSquare,
      title: 'Advanced Task Management',
      description: 'Organize your tasks with priorities, deadlines, and subtasks for maximum productivity.',
      color: '#10B981',
      type: 'tasks',
    },
    {
      icon: BarChart3,
      title: 'Powerful Analytics',
      description: 'Visualize your progress with beautiful charts, heatmaps, and detailed reports.',
      color: '#8B5CF6',
      type: 'analytics',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern technologies for instant loading and smooth interactions.',
      color: '#F59E0B',
      type: 'performance',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely with full privacy protection.',
      color: '#EF4444',
      type: 'security',
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Perfect experience across all devices with responsive design and PWA support.',
      color: '#06B6D4',
      type: 'mobile',
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to build better habits and manage tasks efficiently
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                {/* 3D Icon Container */}
                <div className="h-32 mb-6 relative">
                  <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                    <ambientLight intensity={0.6} />
                    <pointLight position={[5, 5, 5]} intensity={0.8} />
                    <Feature3DIcon type={feature.type} color={feature.color} />
                  </Canvas>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div 
                      className="p-3 rounded-lg mr-4"
                      style={{ backgroundColor: feature.color + '20' }}
                    >
                      <feature.icon 
                        className="w-6 h-6" 
                        style={{ color: feature.color }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: feature.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features3D;