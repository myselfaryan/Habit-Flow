import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Task } from '../types';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const Tasks: React.FC = () => {
  const { state, addTask, updateTask, toggleTask, loading } = useApp();
  const { tasks } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed) ||
                         (filterStatus === 'overdue' && !task.completed && task.dueDate && new Date(task.dueDate) < new Date());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length,
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask(taskId);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed! 🎉');
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await addTask(taskData);
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your daily tasks and stay organized
            </p>
          </div>
          <Button onClick={handleAddTask} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <motion.div variants={itemVariants} className="space-y-4">
            {filteredTasks.map((task) => (
              <motion.div key={task.id} variants={itemVariants}>
                <TaskCard
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start organizing your work by creating your first task'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
                  <Button onClick={handleAddTask}>
                    Create Your First Task
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        loading={loading}
      />
    </>
  );
};

export default Tasks;