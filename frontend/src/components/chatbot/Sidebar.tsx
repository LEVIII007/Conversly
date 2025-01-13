'use client';

import { useState } from 'react';
import { 
  Database, 
  Settings, 
  Sliders, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Database, label: 'Data Sources', href: '#data-sources' },
    { icon: FileText, label: 'System Settings', href: '#system-settings' },
    { icon: Sliders, label: 'Customization', href: '#customization' },
    { icon: Settings, label: 'Actions', href: '#actions' },
  ];

  return (
    <div
      className={cn(
        'border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="space-y-2 p-4">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
} 