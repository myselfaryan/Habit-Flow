import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Sphere, Box, Torus } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Github, ExternalLink, Star } from 'lucide-react';
import * as THREE from 'three';

// Animated background elements
function BackgroundElements() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <Sphere args={[0.5]} position={[-3, 2, -2]}>
          <meshStandardMaterial color="#3B82F6" transparent opacity={0.6} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <Box args={[0.8, 0.8, 0.8]} position={[3, -1, -1]}>
          <meshStandardMaterial color="#8B5CF6" transparent opacity={0.6} />
        </Box>
      </Float>
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
        <Torus args={[0.6, 0.2, 8, 16]} position={[0, -2, -3]}>
          <meshStandardMaterial color="#10B981" transparent opacity={0.6} />
        </Torus>
      </Float>
    </group>
  );
}

const CallToAction3D: React.FC = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.4} color="#8B5CF6" />
          <BackgroundElements />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-pink-900/90" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Productivity?
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 leading-relaxed">
            Join thousands of users who have already improved their habits and achieved their goals with HabitFlow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        >
          <button 
            onClick={handleGetStarted}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button className="group px-8 py-4 border-2 border-white/30 rounded-full text-white font-semibold text-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm flex items-center space-x-2">
            <Github className="w-5 h-5" />
            <span>View on GitHub</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { title: 'Free Forever', description: 'No hidden costs or subscriptions' },
            { title: 'Open Source', description: 'Transparent and community-driven' },
            { title: 'Privacy First', description: 'Your data stays secure and private' },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex items-center justify-center space-x-6 text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-semibold">4.9/5</span>
            <span className="text-sm">User Rating</span>
          </div>
          <div className="w-px h-6 bg-gray-500" />
          <div className="flex items-center space-x-2">
            <span className="font-semibold">1000+</span>
            <span className="text-sm">Active Users</span>
          </div>
          <div className="w-px h-6 bg-gray-500" />
          <div className="flex items-center space-x-2">
            <span className="font-semibold">50+</span>
            <span className="text-sm">GitHub Stars</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction3D;