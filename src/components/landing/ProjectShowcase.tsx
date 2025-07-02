import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Target, 
  CheckSquare, 
  BarChart3, 
  Calendar, 
  Flame, 
  Award,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  Shield,
  Users
} from 'lucide-react';

const ProjectShowcase: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Target,
      title: 'Habit Tracking',
      description: 'Build lasting habits with streak tracking, completion rates, and visual progress indicators.',
      stats: '10+ Habit Categories',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Organize tasks with priorities, deadlines, subtasks, and smart categorization.',
      stats: '5 Priority Levels',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights with charts, heatmaps, and progress visualization.',
      stats: '12+ Chart Types',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent scheduling with deadline tracking and reminder systems.',
      stats: 'Real-time Updates',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const capabilities = [
    { icon: Smartphone, label: 'Mobile First', description: 'Optimized for all devices' },
    { icon: Monitor, label: 'Desktop Ready', description: 'Full desktop experience' },
    { icon: Tablet, label: 'Tablet Friendly', description: 'Perfect for tablets' },
    { icon: Zap, label: 'Lightning Fast', description: 'Sub-second load times' },
    { icon: Shield, label: 'Secure', description: 'End-to-end encryption' },
    { icon: Users, label: 'User Focused', description: 'Intuitive design' },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Project Overview
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            HabitFlow is a comprehensive productivity application that combines habit tracking, 
            task management, and analytics in a beautiful, modern interface.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${feature.color} text-white text-sm font-medium`}>
                  {feature.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Capabilities Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Everyone
            </h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Designed with accessibility, performance, and user experience at its core
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                  <capability.icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="font-semibold mb-2">{capability.label}</h4>
                  <p className="text-sm opacity-80">{capability.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '50+', label: 'Components', icon: Target },
            { number: '15+', label: 'Pages & Views', icon: Monitor },
            { number: '100%', label: 'Responsive', icon: Smartphone },
            { number: '⚡', label: 'Fast Loading', icon: Zap },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectShowcase;