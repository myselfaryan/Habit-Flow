import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Habit, HabitEntry } from '../types';
import HabitCard from '../components/habits/HabitCard';
import HabitModal from '../components/habits/HabitModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { isHabitCompletedToday } from '../utils/habitUtils';
import toast from 'react-hot-toast';

const Habits: React.FC = () => {
  const { state, addHabit, updateHabit, addHabitEntry, loading } = useApp();
  const { habits, habitEntries } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || habit.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(habits.map(habit => habit.category)));

  const handleMarkComplete = async (habitId: string) => {
    // Check if habit is already completed today
    if (isHabitCompletedToday(habitId, habitEntries)) {
      toast.error('Habit already marked complete for today');
      return;
    }

    try {
      await addHabitEntry({
        habitId,
        date: new Date(),
        count: 1,
      });
      toast.success('Habit marked as complete! 🎉');
    } catch (error) {
      console.error('Error marking habit complete:', error);
      toast.error('Failed to mark habit as complete');
    }
  };

  const handleAddHabit = () => {
    setEditingHabit(null);
    setShowHabitModal(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowHabitModal(true);
  };

  const handleSaveHabit = async (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (editingHabit) {
      await updateHabit(editingHabit.id, habitData);
    } else {
      await addHabit(habitData);
    }
  };

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
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Habits</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Build consistency with your daily habits
            </p>
          </div>
          <Button onClick={handleAddHabit} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Habits Grid */}
        {filteredHabits.length > 0 ? (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map((habit) => (
              <motion.div key={habit.id} variants={itemVariants}>
                <HabitCard
                  habit={habit}
                  habitEntries={habitEntries}
                  onMarkComplete={handleMarkComplete}
                  onEdit={handleEditHabit}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchTerm || filterCategory !== 'all' ? 'No habits found' : 'No habits yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm || filterCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start building better habits by creating your first one'
                  }
                </p>
                {!searchTerm && filterCategory === 'all' && (
                  <Button onClick={handleAddHabit}>
                    Create Your First Habit
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Habit Modal */}
      <HabitModal
        isOpen={showHabitModal}
        onClose={() => {
          setShowHabitModal(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        habit={editingHabit}
        loading={loading}
      />
    </>
  );
};

export default Habits;