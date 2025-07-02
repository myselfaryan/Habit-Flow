import React from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, isSameDay } from 'date-fns';
import { HabitEntry } from '../../types';

interface HabitHeatmapProps {
  habitEntries: HabitEntry[];
  habitId: string;
  year?: number;
}

const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ habitEntries, habitId, year = new Date().getFullYear() }) => {
  const startDate = startOfYear(new Date(year, 0, 1));
  const endDate = endOfYear(new Date(year, 0, 1));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getIntensity = (date: Date): number => {
    const entry = habitEntries.find(entry => 
      entry.habitId === habitId && isSameDay(new Date(entry.date), date)
    );
    return entry ? Math.min(entry.count, 4) : 0;
  };

  const getColor = (intensity: number): string => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800',
      'bg-emerald-200 dark:bg-emerald-900',
      'bg-emerald-300 dark:bg-emerald-800',
      'bg-emerald-400 dark:bg-emerald-700',
      'bg-emerald-500 dark:bg-emerald-600',
    ];
    return colors[intensity] || colors[0];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Activity Heatmap - {year}
      </h3>
      
      <div className="grid grid-cols-53 gap-1 text-xs">
        {days.map((day, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-sm ${getColor(getIntensity(day))}`}
            title={`${format(day, 'MMM d, yyyy')} - ${getIntensity(day)} completions`}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map(intensity => (
            <div
              key={intensity}
              className={`w-3 h-3 rounded-sm ${getColor(intensity)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default HabitHeatmap;