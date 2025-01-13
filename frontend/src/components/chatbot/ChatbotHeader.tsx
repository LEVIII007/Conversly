import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';

interface ChatbotHeaderProps {
  chatbot: any;
}

export function ChatbotHeader({ chatbot }: ChatbotHeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{chatbot?.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {chatbot?.id}</p>
          </div>
          <Badge variant={chatbot?.active ? 'success' : 'secondary'}>
            {chatbot?.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <nav className="flex items-center space-x-4">
          <a href="#" className="text-sm hover:text-indigo-600">Dashboard</a>
          <a href="#" className="text-sm hover:text-indigo-600">Analytics</a>
          <a href="#" className="text-sm hover:text-indigo-600">Settings</a>
        </nav>
      </div>
    </header>
  );
} 