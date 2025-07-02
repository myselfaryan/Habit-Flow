import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, CheckSquare, BarChart3, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isDesktop?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  isCollapsed = false, 
  onToggleCollapse,
  isDesktop = false 
}) => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/app',
      icon: LayoutDashboard,
    },
    {
      name: 'Habits',
      href: '/app/habits',
      icon: Target,
    },
    {
      name: 'Tasks',
      href: '/app/tasks',
      icon: CheckSquare,
    },
    {
      name: 'Analytics',
      href: '/app/analytics',
      icon: BarChart3,
    },
    {
      name: 'Settings',
      href: '/app/settings',
      icon: Settings,
    },
  ];

  // Desktop sidebar content
  if (isDesktop) {
    return (
      <>
        {/* Desktop logo */}
        <div className={`flex items-center border-b border-gray-200 dark:border-gray-700 h-16 px-4 transition-all duration-300 ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          {isCollapsed ? (
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HabitFlow
              </span>
            </div>
          )}
        </div>

        {/* Desktop navigation */}
        <nav className={`flex-1 space-y-1 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <div key={item.name} className="relative">
                <Link
                  to={item.href}
                  className={`
                    flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative
                    ${isCollapsed ? 'p-3 justify-center' : 'space-x-3 px-3 py-2'}
                    ${isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''} ${isCollapsed ? 'mx-auto' : ''}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </>
    );
  }

  // Mobile sidebar
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 40,
      },
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 40,
      },
    },
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <motion.div
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 lg:hidden"
      >
        <div className="flex h-full flex-col">
          {/* Mobile header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HabitFlow
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;