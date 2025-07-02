import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Box, Sphere, Torus, Cylinder } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';

// 3D Tech Logo Component
function TechLogo({ position, color, type, name }: { 
  position: [number, number, number]; 
  color: string; 
  type: string;
  name: string;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={meshRef} position={position}>
        {type === 'react' && (
          <group>
            <Torus args={[0.8, 0.1, 8, 16]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Torus>
            <Torus args={[0.8, 0.1, 8, 16]} rotation={[Math.PI / 2, Math.PI / 3, 0]}>
              <meshStandardMaterial color={color} />
            </Torus>
            <Torus args={[0.8, 0.1, 8, 16]} rotation={[Math.PI / 2, -Math.PI / 3, 0]}>
              <meshStandardMaterial color={color} />
            </Torus>
            <Sphere args={[0.2]}>
              <meshStandardMaterial color={color} />
            </Sphere>
          </group>
        )}
        {type === 'typescript' && (
          <Box args={[1, 1, 0.2]}>
            <meshStandardMaterial color={color} />
          </Box>
        )}
        {type === 'threejs' && (
          <group>
            <Cylinder args={[0, 0.8, 1.5, 3]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
          </group>
        )}
        {type === 'tailwind' && (
          <group>
            <Box args={[1.2, 0.3, 0.2]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.8, 0.3, 0.2]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[1.0, 0.3, 0.2]} position={[0, -0.3, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
          </group>
        )}
        {type === 'framer' && (
          <Sphere args={[0.6]}>
            <meshStandardMaterial color={color} />
          </Sphere>
        )}
        {type === 'vite' && (
          <group>
            <Cylinder args={[0.1, 0.6, 1.2, 6]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            <Sphere args={[0.15]} position={[0, 0.7, 0]}>
              <meshStandardMaterial color="#FFD700" />
            </Sphere>
          </group>
        )}
        
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </group>
    </Float>
  );
}

const TechStack3D: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const technologies = [
    { name: 'React', color: '#61DAFB', type: 'react', position: [-3, 0, 0] as [number, number, number] },
    { name: 'TypeScript', color: '#3178C6', type: 'typescript', position: [-1, 1, 1] as [number, number, number] },
    { name: 'Three.js', color: '#000000', type: 'threejs', position: [1, 0, -1] as [number, number, number] },
    { name: 'Tailwind', color: '#06B6D4', type: 'tailwind', position: [3, -1, 0] as [number, number, number] },
    { name: 'Framer Motion', color: '#0055FF', type: 'framer', position: [0, 2, 1] as [number, number, number] },
    { name: 'Vite', color: '#646CFF', type: 'vite', position: [0, -2, -1] as [number, number, number] },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Built with Modern Tech
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powered by cutting-edge technologies for optimal performance and developer experience
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-96 relative"
        >
          <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
            <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} />
            
            {technologies.map((tech, index) => (
              <TechLogo
                key={index}
                position={tech.position}
                color={tech.color}
                type={tech.type}
                name={tech.name}
              />
            ))}
          </Canvas>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-16"
        >
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <h3 className="text-white font-semibold">{tech.name}</h3>
              <div 
                className="w-4 h-4 rounded-full mx-auto mt-2"
                style={{ backgroundColor: tech.color }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack3D;