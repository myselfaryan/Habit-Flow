"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { CheckCircle2, Plus, Target, Activity, ArrowRight, Calendar, TrendingUp, Users, Zap, Shield, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onShowActions?: (id: number | null) => void;
  showActions?: number | null;
  className?: string;
}

function TodoItem({
  todo,
  onComplete,
  onDelete,
  onShowActions,
  showActions,
  className
}: TodoItemProps) {
  const x = useMotionValue(0);

  return (
    <motion.div layout className={cn("flex min-h-7 items-center gap-2", className)}>
      <motion.button
        className="flex h-4 w-4 items-center justify-center rounded-sm border bg-white/10 text-white border-white/20"
        style={{ x }}
        onClick={() => {
          onComplete(todo.id);
          onShowActions?.(null);
        }}
      >
        {todo.completed && (
          <svg viewBox="0 0 26 31" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[8px]">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0 }}
              d="M2.25781 13.903L6.2995 27.8624C6.54178 28.6992 7.66377 28.8476 8.11527 28.1026L23.9323 2.00293"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </motion.button>

      <motion.p
        animate={{ opacity: todo.completed ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex select-none items-center text-sm"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDrag={(e, info) => {
          if (showActions) onShowActions?.(null);
          x.set(decay(info.offset.x / 5, 30));
        }}
        onDragEnd={(e, info) => {
          if (info.offset.x > 50) {
            onComplete(todo.id);
          } else if (info.offset.x < -20 && !todo.completed) {
            onShowActions?.(todo.id);
          }
          animate(x, 0);
        }}
      >
        {todo.title}
        {todo.completed && (
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 inline-block h-px bg-white"
          />
        )}
      </motion.p>
    </motion.div>
  );
}

function decay(value: number, max: number) {
  let entry = value / max;
  let sigmoid = 2 / (1 + Math.exp(-entry)) - 1;
  return sigmoid * max;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative p-6 rounded-xl bg-white/[0.03] border border-white/[0.08]",
        "hover:bg-white/[0.05] transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function HabitFlowLanding() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: "Morning meditation", completed: true },
    { id: 2, title: "Drink 8 glasses of water", completed: false },
    { id: 3, title: "30 min workout", completed: false },
  ]);
  const [showActions, setShowActions] = useState<number | null>(null);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  const handleToggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleGetStarted = () => {
    navigate('/app');
  };

  const features = [
    {
      icon: <Target className="w-5 h-5 text-emerald-400" />,
      title: "Smart Goal Tracking",
      description: "Set and track your habits with intelligent reminders and progress insights."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
      title: "Progress Analytics",
      description: "Visualize your growth with detailed charts and streak counters."
    },
    {
      icon: <Calendar className="w-5 h-5 text-purple-400" />,
      title: "Flexible Scheduling",
      description: "Create custom schedules that adapt to your lifestyle and preferences."
    },
    {
      icon: <Users className="w-5 h-5 text-orange-400" />,
      title: "Social Accountability",
      description: "Share goals with friends and stay motivated through community support."
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      title: "Quick Actions",
      description: "Mark habits complete with simple gestures and shortcuts."
    },
    {
      icon: <Shield className="w-5 h-5 text-green-400" />,
      title: "Privacy First",
      description: "Your data stays secure with end-to-end encryption and local storage."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#030303] overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-blue-500/[0.05] blur-3xl" />

        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-emerald-500/[0.15]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-blue-500/[0.15]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />
          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-purple-500/[0.15]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
            >
              <Activity className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-white/60 tracking-wide">
                Transform Your Daily Routine
              </span>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Habit
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300">
                  Flow
                </span>
              </h1>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-lg md:text-xl text-white/60 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto">
                Build lasting habits and achieve your goals with our intuitive tracking system. 
                Turn your daily tasks into powerful routines.
              </p>
            </motion.div>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button 
                onClick={handleGetStarted}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 border border-white/20 rounded-full text-white/80 font-medium hover:bg-white/5 transition-all duration-300"
              >
                Try Web Version
              </button>
            </motion.div>

            {/* Interactive Todo Demo */}
            <motion.div
              custom={4}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="max-w-md mx-auto p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white font-medium">Today's Habits</h3>
              </div>
              <div className="space-y-3">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onComplete={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    showActions={showActions}
                    onShowActions={setShowActions}
                    className="text-white/80"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
      </div>

      {/* Features Section */}
      <div className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-blue-300">
                {" "}Succeed
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Powerful features designed to help you build better habits and achieve your goals faster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already built lasting habits with HabitFlow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                <Target className="w-5 h-5" />
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 border border-white/20 rounded-full text-white/80 font-medium hover:bg-white/5 transition-all duration-300"
              >
                Try Web Version
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HabitFlowLanding;