import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Habit, Task, HabitEntry } from '../types';
import { Database } from '../lib/database.types';

type DbHabit = Database['public']['Tables']['habits']['Row'];
type DbTask = Database['public']['Tables']['tasks']['Row'];
type DbHabitEntry = Database['public']['Tables']['habit_entries']['Row'];
type DbSubtask = Database['public']['Tables']['subtasks']['Row'];

// Transform database types to app types
const transformHabit = (dbHabit: DbHabit): Habit => ({
  id: dbHabit.id,
  name: dbHabit.name,
  description: dbHabit.description || undefined,
  frequency: dbHabit.frequency as 'daily' | 'weekly' | 'custom',
  targetCount: dbHabit.target_count,
  category: dbHabit.category,
  color: dbHabit.color,
  isActive: dbHabit.is_active,
  createdAt: new Date(dbHabit.created_at),
});

const transformTask = (dbTask: DbTask, subtasks: DbSubtask[] = []): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  description: dbTask.description || undefined,
  priority: dbTask.priority as 'low' | 'medium' | 'high',
  category: dbTask.category,
  dueDate: dbTask.due_date ? new Date(dbTask.due_date) : undefined,
  completed: dbTask.completed,
  completedAt: dbTask.completed_at ? new Date(dbTask.completed_at) : undefined,
  createdAt: new Date(dbTask.created_at),
  subtasks: subtasks.map(subtask => ({
    id: subtask.id,
    title: subtask.title,
    completed: subtask.completed,
  })),
});

const transformHabitEntry = (dbEntry: DbHabitEntry): HabitEntry => ({
  id: dbEntry.id,
  habitId: dbEntry.habit_id,
  date: new Date(dbEntry.date),
  count: dbEntry.count,
  notes: dbEntry.notes || undefined,
});

export const useSupabaseData = () => {
  const { user, isAuthenticated } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Supabase is properly configured
  const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  // Fetch all data
  const fetchData = async () => {
    if (!user || !isSupabaseConfigured) {
      setHabits([]);
      setTasks([]);
      setHabitEntries([]);
      setLoading(false);
      if (!isSupabaseConfigured) {
        setError('Supabase configuration missing');
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch tasks with subtasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Fetch habit entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (entriesError) throw entriesError;

      // Transform and set data
      setHabits(habitsData.map(transformHabit));
      setTasks(tasksData.map(task => transformTask(task, task.subtasks || [])));
      setHabitEntries(entriesData.map(transformHabitEntry));

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when user changes
  useEffect(() => {
    fetchData();
  }, [user, isSupabaseConfigured]);

  // CRUD operations for habits
  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Authentication or configuration required');
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name: habit.name,
          description: habit.description,
          frequency: habit.frequency,
          target_count: habit.targetCount,
          category: habit.category,
          color: habit.color,
          is_active: habit.isActive,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newHabit = transformHabit(data);
      setHabits(prev => [newHabit, ...prev]);
      return newHabit;
    } catch (err) {
      console.error('Error adding habit:', err);
      throw err;
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Authentication or configuration required');
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.frequency && { frequency: updates.frequency }),
          ...(updates.targetCount && { target_count: updates.targetCount }),
          ...(updates.category && { category: updates.category }),
          ...(updates.color && { color: updates.color }),
          ...(updates.isActive !== undefined && { is_active: updates.isActive }),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedHabit = transformHabit(data);
      setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h));
      return updatedHabit;
    } catch (err) {
      console.error('Error updating habit:', err);
      throw err;
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Authentication or configuration required');
    }

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error('Error deleting habit:', err);
      throw err;
    }
  };

  // CRUD operations for tasks
  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Authentication or configuration required');
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          due_date: task.dueDate?.toISOString(),
          completed: task.completed,
          completed_at: task.completedAt?.toISOString(),
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask = transformTask(data);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Authentication or configuration required');
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...(updates.title && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.priority && { priority: updates.priority }),
          ...(updates.category && { category: updates.category }),
          ...(updates.dueDate !== undefined && { due_date: updates.dueDate?.toISOString() }),
          ...(updates.completed !== undefined && { completed: updates.completed }),
          ...(updates.completedAt !== undefined && { completed_at: updates.completedAt?.toISOString() }),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          subtasks (*)
        `)
        .single();

      if (error) throw error;

      const updatedTask = transformTask(data, data.subtasks || []);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return null;

    const completed = !task.completed;
    const completedAt = completed ? new Date() : undefined;

    return updateTask(id, { completed, completedAt });
  };

  const deleteTask = async (id: string) => {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Authentication or configuration required');
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  // CRUD operations for habit entries
  const addHabitEntry = async (entry: Omit<HabitEntry, 'id'>) => {
    if (!user || !isSupabaseConfigured) {
      throw new Error('Authentication or configuration required');
    }

    try {
      const { data, error } = await supabase
        .from('habit_entries')
        .insert({
          habit_id: entry.habitId,
          date: entry.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          count: entry.count,
          notes: entry.notes,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        // Check for unique constraint violation (duplicate entry for same habit on same day)
        if (error.code === '23505') {
          throw new Error('HABIT_ALREADY_COMPLETED_TODAY');
        }
        throw error;
      }

      const newEntry = transformHabitEntry(data);
      setHabitEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      console.error('Error adding habit entry:', err);
      throw err;
    }
  };

  return {
    // Data
    habits,
    tasks,
    habitEntries,
    loading,
    error,
    isAuthenticated,
    isSupabaseConfigured,

    // Actions
    fetchData,
    addHabit,
    updateHabit,
    deleteHabit,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    addHabitEntry,
  };
};