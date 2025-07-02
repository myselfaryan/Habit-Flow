import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, OrbitControls, Environment, Sphere, Box, Torus } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Floating geometric shapes component
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const shapes = useMemo(() => [
    { position: [2, 1, 0], color: '#3B82F6', type: 'box' },
    { position: [-2, -1, 1], color: '#8B5CF6', type: 'sphere' },
    { position: [0, 2, -1], color: '#10B981', type: 'torus' },
    { position: [3, -2, 2], color: '#F59E0B', type: 'box' },
    { position: [-3, 1, -2], color: '#EF4444', type: 'sphere' },
  ], []);

  return (
    <group ref={groupRef}>
      {shapes.map((shape, index) => (
        <Float
          key={index}
          speed={1 + index * 0.2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <group position={shape.position as [number, number, number]}>
            {shape.type === 'box' && (
              <Box args={[0.5, 0.5, 0.5]}>
                <meshStandardMaterial color={shape.color} />
              </Box>
            )}
            {shape.type === 'sphere' && (
              <Sphere args={[0.3]}>
                <meshStandardMaterial color={shape.color} />
              </Sphere>
            )}
            {shape.type === 'torus' && (
              <Torus args={[0.3, 0.1, 8, 16]}>
                <meshStandardMaterial color={shape.color} />
              </Torus>
            )}
          </group>
        </Float>
      ))}
    </group>
  );
}

// Main 3D text component
function MainText() {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <Text
        font="/fonts/inter-bold.woff"
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
      >
        HabitFlow
        <meshStandardMaterial color="#ffffff" />
      </Text>
    </Float>
  );
}

// Particle system
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial size={0.02} color="#64748b" transparent opacity={0.6} />
    </points>
  );
}

const Hero3D: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        className="absolute inset-0"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
        
        <Particles />
        <FloatingShapes />
        <MainText />
        
        <Environment preset="night" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              HabitFlow
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
              Transform your life with the ultimate habit and task tracking experience
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                Get Started
              </button>
              <button className="px-8 py-4 border-2 border-white/30 rounded-full text-white font-semibold text-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero3D;