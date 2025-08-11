import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  onSidebarToggle: () => void;
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onSidebarToggle, sidebarCollapsed }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        <h1 className="text-xl font-semibold text-gray-800">HabitFlow</h1>
      </div>
      
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>
    </header>
  );
};

export default Header;