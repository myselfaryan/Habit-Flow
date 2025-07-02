import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    const iconClass = "w-4 h-4";
    switch (priority) {
      case 'high': return <Flag className={`${iconClass} text-red-500`} />;
      case 'medium': return <Flag className={`${iconClass} text-amber-500`} />;
      case 'low': return <Flag className={`${iconClass} text-blue-500`} />;
      default: return <Flag className={`${iconClass} text-gray-500`} />;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <Card 
      hover 
      onClick={() => onEdit(task)}
      className={`p-4 ${task.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-red-200 dark:border-red-800' : ''}`}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className="mt-0.5 text-gray-400 hover:text-blue-500 transition-colors"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2 ml-2">
              {getPriorityIcon(task.priority)}
              <Badge variant={getPriorityColor(task.priority)} size="sm">
                {task.priority}
              </Badge>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-500' : ''}`}>
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(new Date(task.dueDate))}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(task.createdAt)}</span>
              </div>
            </div>

            {task.category && (
              <Badge variant="default" size="sm">
                {task.category}
              </Badge>
            )}
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3 space-y-1">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-2 text-sm">
                  <Circle className={`w-3 h-3 ${subtask.completed ? 'text-emerald-500' : 'text-gray-400'}`} />
                  <span className={subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;