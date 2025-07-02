import { format, isToday, isYesterday, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

export const formatDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const getWeekDays = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end;
};

export const getDaysInMonth = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return eachDayOfInterval({ start: firstDay, end: lastDay });
};