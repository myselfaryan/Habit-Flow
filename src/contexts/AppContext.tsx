import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Habit, Task, HabitEntry, AppState } from '../types';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useAuthContext } from './AuthContext';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Supabase actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<Habit | null>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<Habit | null>;
  deleteHabit: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | null>;
  toggleTask: (id: string) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<void>;
  addHabitEntry: (entry: Omit<HabitEntry, 'id'>) => Promise<HabitEntry | null>;
  loading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_HABIT_ENTRIES'; payload: HabitEntry[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  habits: [],
  tasks: [],
  habitEntries: [],
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_HABIT_ENTRIES':
      return { ...state, habitEntries: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isAuthenticated } = useAuthContext();
  const supabaseData = useSupabaseData();

  // Sync Supabase data with local state
  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: 'SET_HABITS', payload: supabaseData.habits });
      dispatch({ type: 'SET_TASKS', payload: supabaseData.tasks });
      dispatch({ type: 'SET_HABIT_ENTRIES', payload: supabaseData.habitEntries });
    } else {
      // Clear data when not authenticated
      dispatch({ type: 'SET_HABITS', payload: [] });
      dispatch({ type: 'SET_TASKS', payload: [] });
      dispatch({ type: 'SET_HABIT_ENTRIES', payload: [] });
    }
  }, [
    isAuthenticated,
    supabaseData.habits,
    supabaseData.tasks,
    supabaseData.habitEntries
  ]);

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      addHabit: supabaseData.addHabit,
      updateHabit: supabaseData.updateHabit,
      deleteHabit: supabaseData.deleteHabit,
      addTask: supabaseData.addTask,
      updateTask: supabaseData.updateTask,
      toggleTask: supabaseData.toggleTask,
      deleteTask: supabaseData.deleteTask,
      addHabitEntry: supabaseData.addHabitEntry,
      loading: supabaseData.loading,
      error: supabaseData.error,
    }}>
      {children}
    </AppContext.Provider>
  );
};