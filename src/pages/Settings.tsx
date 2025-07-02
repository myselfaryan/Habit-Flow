import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Palette, 
  Database, 
  Shield, 
  HelpCircle, 
  Moon, 
  Sun,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { useAuthContext } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useApp();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    habitReminders: true,
    taskDeadlines: true,
    weeklyReports: false,
    achievements: true,
  });

  // Extract user information
  const userEmail = user?.email || '';
  const userName = userEmail.split('@')[0] || 'User';
  const [firstName, lastName] = userName.includes('.') 
    ? userName.split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1))
    : [userName.charAt(0).toUpperCase() + userName.slice(1), ''];

  const tabs = [
    { id: 'general', name: 'General', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'data', name: 'Data & Privacy', icon: Database },
    { id: 'help', name: 'Help & Support', icon: HelpCircle },
  ];

  const handleExportData = () => {
    const data = {
      habits: state.habits,
      tasks: state.tasks,
      habitEntries: state.habitEntries,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.habits) dispatch({ type: 'SET_HABITS', payload: data.habits });
        if (data.tasks) dispatch({ type: 'SET_TASKS', payload: data.tasks });
        if (data.habitEntries) dispatch({ type: 'SET_HABIT_ENTRIES', payload: data.habitEntries });
        toast.success('Data imported successfully!');
      } catch (error) {
        toast.error('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      dispatch({ type: 'SET_HABITS', payload: [] });
      dispatch({ type: 'SET_TASKS', payload: [] });
      dispatch({ type: 'SET_HABIT_ENTRIES', payload: [] });
      toast.success('All data cleared');
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h3>
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {firstName} {lastName}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">{userEmail}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue={firstName}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue={lastName}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
              <Card className="p-6 space-y-4">
                {Object.entries(notifications).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {key === 'habitReminders' && 'Get reminded about your daily habits'}
                        {key === 'taskDeadlines' && 'Receive alerts for upcoming task deadlines'}
                        {key === 'weeklyReports' && 'Weekly summary of your progress'}
                        {key === 'achievements' && 'Celebrate your milestones and streaks'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !enabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {theme === 'light' ? (
                      <Sun className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-blue-500" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between light and dark themes
                      </p>
                    </div>
                  </div>
                  <Button onClick={toggleTheme} variant="secondary">
                    Switch to {theme === 'light' ? 'Dark' : 'Light'}
                  </Button>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color Preferences</h3>
              <Card className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Choose your preferred accent color</p>
                <div className="grid grid-cols-6 gap-3">
                  {[
                    { name: 'Blue', color: '#3B82F6' },
                    { name: 'Purple', color: '#8B5CF6' },
                    { name: 'Green', color: '#10B981' },
                    { name: 'Orange', color: '#F59E0B' },
                    { name: 'Red', color: '#EF4444' },
                    { name: 'Pink', color: '#EC4899' },
                  ].map((colorOption) => (
                    <button
                      key={colorOption.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: colorOption.color }}
                      title={colorOption.name}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h3>
              <Card className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={handleExportData} variant="secondary" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </Button>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Import Data</span>
                    </div>
                  </label>
                  
                  <Button onClick={handleClearAllData} variant="danger" className="flex items-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Data</span>
                  </Button>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Storage Usage</h3>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Habits</span>
                    <Badge>{state.habits.length} items</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Tasks</span>
                    <Badge>{state.tasks.length} items</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Habit Entries</span>
                    <Badge>{state.habitEntries.length} items</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
              <Card className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Documentation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Learn how to use all features effectively
                    </p>
                    <Button variant="ghost" size="sm">View Docs</Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Get help with technical issues
                    </p>
                    <Button variant="ghost" size="sm">Contact Us</Button>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">HabitFlow</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  A comprehensive habit and task tracking application designed to help you build consistency 
                  and achieve your goals. Built with modern web technologies for optimal performance and user experience.
                </p>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your experience and manage your preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          {renderTabContent()}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;