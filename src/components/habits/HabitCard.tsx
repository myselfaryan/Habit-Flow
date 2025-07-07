    import React from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, Calendar, CheckCircle2 } from 'lucide-react';
import { Habit, HabitEntry } from '../../types';
import { calculateStreak, getHabitCompletionRate, isHabitCompletedToday } from '../../utils/habitUtils';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface HabitCardProps {
  habit: Habit;
  habitEntries: HabitEntry[];
  onMarkComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, habitEntries, onMarkComplete, onEdit }) => {
  const streak = calculateStreak(habitEntries, habit.id);
  const completionRate = getHabitCompletionRate(habitEntries, habit.id);
  const isCompletedToday = isHabitCompletedToday(habitEntries, habit.id);

  const handleMarkCompleteInternal = async (habitId: string) => {
    try {
      const result = await addHabitEntry({});
      await onMarkComplete(habitId);
    } catch (error: any) {
      console.error('Error in handleMarkComplete:', error);
      toast.error('Failed to mark habit as complete');
      throw error; // Re-throw to be handled by parent
    }
  };

  return (
    <Card hover onClick={() => onEdit(habit)} className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: habit.color + '20', color: habit.color }}
          >
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{habit.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{habit.category}</p>
          </div>
        </div>
        
        <Badge variant={isCompletedToday ? 'success' : 'default'}>
          {habit.frequency}
        </Badge>
      </div>

      {habit.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{habit.description}</p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Flame className="w-4 h-4 text-orange-500 mr-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{streak}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{completionRate}%</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">30d Rate</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{habit.targetCount}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant={isCompletedToday ? 'success' : 'primary'}
          size="sm"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onMarkComplete(habit.id);
          }}
          disabled={isCompletedToday}
        >
          {isCompletedToday ? 'Completed Today' : 'Mark Complete'}
        </Button>
      </div>
    </Card>
  );
};

export default HabitCard;