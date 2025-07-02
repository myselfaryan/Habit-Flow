import { useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { Habit, Task, HabitEntry } from '../types';
import { subDays, addDays } from 'date-fns';

export const useMockData = () => {
  const { dispatch } = useApp();

  const initializeMockData = useCallback(() => {
    // Sample Habits
    const sampleHabits: Habit[] = [
      {
        id: '1',
        name: 'Morning Meditation',
        description: 'Start the day with 10 minutes of mindfulness',
        frequency: 'daily',
        targetCount: 1,
        category: 'Wellness',
        color: '#8B5CF6',
        createdAt: subDays(new Date(), 30),
        isActive: true,
      },
      {
        id: '2',
        name: 'Read for 30 minutes',
        description: 'Read books to expand knowledge and vocabulary',
        frequency: 'daily',
        targetCount: 1,
        category: 'Learning',
        color: '#3B82F6',
        createdAt: subDays(new Date(), 25),
        isActive: true,
      },
      {
        id: '3',
        name: 'Exercise',
        description: 'Physical activity for health and fitness',
        frequency: 'daily',
        targetCount: 1,
        category: 'Health',
        color: '#10B981',
        createdAt: subDays(new Date(), 20),
        isActive: true,
      },
      {
        id: '4',
        name: 'Drink 8 glasses of water',
        description: 'Stay hydrated throughout the day',
        frequency: 'daily',
        targetCount: 8,
        category: 'Health',
        color: '#06B6D4',
        createdAt: subDays(new Date(), 15),
        isActive: true,
      },
      {
        id: '5',
        name: 'Write in Journal',
        description: 'Reflect on the day and document thoughts',
        frequency: 'daily',
        targetCount: 1,
        category: 'Personal',
        color: '#F59E0B',
        createdAt: subDays(new Date(), 10),
        isActive: true,
      },
      {
        id: '6',
        name: 'Practice Guitar',
        description: 'Improve musical skills with daily practice',
        frequency: 'daily',
        targetCount: 1,
        category: 'Hobbies',
        color: '#EF4444',
        createdAt: subDays(new Date(), 8),
        isActive: true,
      },
    ];

    // Sample Tasks
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Finish the Q1 project proposal and submit to stakeholders',
        priority: 'high',
        category: 'Work',
        dueDate: addDays(new Date(), 2),
        completed: false,
        createdAt: subDays(new Date(), 3),
        subtasks: [
          { id: '1-1', title: 'Research market trends', completed: true },
          { id: '1-2', title: 'Create budget analysis', completed: true },
          { id: '1-3', title: 'Write executive summary', completed: false },
          { id: '1-4', title: 'Review with team', completed: false },
        ],
      },
      {
        id: '2',
        title: 'Schedule dentist appointment',
        description: 'Book routine cleaning and checkup',
        priority: 'medium',
        category: 'Health',
        dueDate: addDays(new Date(), 7),
        completed: false,
        createdAt: subDays(new Date(), 2),
      },
      {
        id: '3',
        title: 'Plan weekend trip',
        description: 'Research destinations and book accommodations',
        priority: 'low',
        category: 'Personal',
        dueDate: addDays(new Date(), 10),
        completed: false,
        createdAt: subDays(new Date(), 1),
      },
      {
        id: '4',
        title: 'Update resume',
        description: 'Add recent projects and achievements',
        priority: 'medium',
        category: 'Career',
        completed: true,
        completedAt: subDays(new Date(), 1),
        createdAt: subDays(new Date(), 5),
      },
      {
        id: '5',
        title: 'Grocery shopping',
        description: 'Buy ingredients for this week\'s meal prep',
        priority: 'high',
        category: 'Household',
        dueDate: new Date(),
        completed: true,
        completedAt: subDays(new Date(), 0),
        createdAt: subDays(new Date(), 1),
      },
      {
        id: '6',
        title: 'Review investment portfolio',
        description: 'Analyze performance and rebalance if needed',
        priority: 'medium',
        category: 'Finance',
        dueDate: subDays(new Date(), 2),
        completed: false,
        createdAt: subDays(new Date(), 10),
      },
    ];

    // Generate sample habit entries for the last 30 days
    const sampleHabitEntries: HabitEntry[] = [];
    
    sampleHabits.forEach(habit => {
      for (let i = 0; i < 30; i++) {
        const date = subDays(new Date(), i);
        
        // Create realistic completion patterns
        const completionRate = Math.random();
        let shouldComplete = false;
        
        switch (habit.id) {
          case '1': // Meditation - high consistency
            shouldComplete = completionRate > 0.2;
            break;
          case '2': // Reading - medium consistency
            shouldComplete = completionRate > 0.3;
            break;
          case '3': // Exercise - medium consistency with rest days
            shouldComplete = completionRate > 0.35 && date.getDay() !== 0; // No Sunday exercise
            break;
          case '4': // Water - high target, variable completion
            shouldComplete = completionRate > 0.15;
            break;
          case '5': // Journal - medium consistency
            shouldComplete = completionRate > 0.4;
            break;
          case '6': // Guitar - lower consistency for new habit
            shouldComplete = i < 8 && completionRate > 0.3; // Only for last 8 days
            break;
        }
        
        if (shouldComplete) {
          const count = habit.targetCount > 1 ? Math.floor(Math.random() * habit.targetCount) + 1 : 1;
          sampleHabitEntries.push({
            id: `${habit.id}-${i}`,
            habitId: habit.id,
            date,
            count,
            notes: Math.random() > 0.8 ? 'Great session today!' : undefined,
          });
        }
      }
    });

    // Dispatch all sample data
    dispatch({ type: 'SET_HABITS', payload: sampleHabits });
    dispatch({ type: 'SET_TASKS', payload: sampleTasks });
    dispatch({ type: 'SET_HABIT_ENTRIES', payload: sampleHabitEntries });
  }, [dispatch]);

  return { initializeMockData };
};