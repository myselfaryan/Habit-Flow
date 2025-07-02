import { HabitEntry, Habit } from '../types';
import { isSameDay, subDays, startOfDay } from 'date-fns';

export const calculateStreak = (habitEntries: HabitEntry[], habitId: string): number => {
  const entries = habitEntries
    .filter(entry => entry.habitId === habitId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (entries.length === 0) return 0;

  let streak = 0;
  let currentDate = startOfDay(new Date());

  for (let i = 0; i < entries.length; i++) {
    const entryDate = startOfDay(new Date(entries[i].date));
    
    if (isSameDay(entryDate, currentDate)) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else if (entryDate < currentDate) {
      break;
    }
  }

  return streak;
};

export const getHabitCompletionRate = (habitEntries: HabitEntry[], habitId: string, days: number = 30): number => {
  const startDate = subDays(new Date(), days);
  const relevantEntries = habitEntries.filter(
    entry => entry.habitId === habitId && new Date(entry.date) >= startDate
  );

  return Math.round((relevantEntries.length / days) * 100);
};

export const isHabitCompletedToday = (habitEntries: HabitEntry[], habitId: string): boolean => {
  return habitEntries.some(
    entry => entry.habitId === habitId && isSameDay(new Date(entry.date), new Date())
  );
};

export const getHabitEntryForDate = (habitEntries: HabitEntry[], habitId: string, date: Date): HabitEntry | undefined => {
  return habitEntries.find(
    entry => entry.habitId === habitId && isSameDay(new Date(entry.date), date)
  );
};