export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetCount: number;
  category: string;
  color: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: Date;
  count: number;
  notes?: string;
}

export interface AppState {
  habits: Habit[];
  tasks: Task[];
  habitEntries: HabitEntry[];
}

export type Priority = 'low' | 'medium' | 'high';
export type Frequency = 'daily' | 'weekly' | 'custom';