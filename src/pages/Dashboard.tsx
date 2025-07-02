import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckSquare, TrendingUp, Calendar, Flame, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { calculateStreak, getHabitCompletionRate, isHabitCompletedToday } from '../utils/habitUtils';
import { formatDate } from '../utils/dateUtils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { habits, tasks, habitEntries } = state;

  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const completedHabitsToday = habits.filter(habit => isHabitCompletedToday(habitEntries, habit.id)).length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    const overdueTasks = tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length;

    const longestStreak = habits.length > 0 
      ? Math.max(...habits.map(habit => calculateStreak(habitEntries, habit.id)))
      : 0;

    const avgCompletionRate = habits.length > 0
      ? Math.round(habits.reduce((sum, habit) => sum + getHabitCompletionRate(habitEntries, habit.id), 0) / habits.length)
      : 0;

    return {
      totalHabits,
      completedHabitsToday,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      longestStreak,
      avgCompletionRate,
    };
  }, [habits, tasks, habitEntries]);

  const recentActivity = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map(date => ({
      date: formatDate(date),
      habits: habitEntries.filter(entry => 
        new Date(entry.date).toDateString() === date.toDateString()
      ).length,
      tasks: tasks.filter(task => 
        task.completedAt && new Date(task.completedAt).toDateString() === date.toDateString()
      ).length,
    }));
  }, [habitEntries, tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(task => !task.completed && task.dueDate)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);
  }, [tasks]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your productivity overview for today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Habits Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedHabitsToday}/{stats.totalHabits}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingTasks}</p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <CheckSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Longest Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.longestStreak}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgCompletionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              7-Day Activity
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="habits" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Habits"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Tasks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Tasks
              </h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {formatDate(new Date(task.dueDate!))}
                      </p>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'info'}>
                      {task.priority}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming tasks</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Habits */}
      {habits.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Habits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.slice(0, 6).map((habit) => {
                const isCompleted = isHabitCompletedToday(habitEntries, habit.id);
                const streak = calculateStreak(habitEntries, habit.id);
                
                return (
                  <div
                    key={habit.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCompleted
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{habit.name}</h4>
                      {isCompleted && <Award className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-600 dark:text-gray-400">{streak} day streak</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;