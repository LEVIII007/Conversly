'use client';

import { Bot, Send } from 'lucide-react';
import { useState } from 'react';

interface ChatbotPreviewProps {
  color: string;
  selectedIcon: React.ReactNode;
  buttonAlignment: 'left' | 'right';
  showButtonText: boolean;
  buttonText: string;
  welcomeMessage: string;
}

export function ChatbotPreview({
  color,
  selectedIcon,
  buttonAlignment,
  showButtonText,
  buttonText,
  welcomeMessage
}: ChatbotPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 overflow-hidden h-full">
      {/* Chat Window */}
      {isExpanded && (
        <div className="relative">
          {/* Header */}
          <div 
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: color }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-white">AI Assistant</h3>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Area */}
          <div className="h-[360px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {/* Bot Message */}
            <div className="flex gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[80%]">
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-3 shadow-sm">
                  <p className="text-sm">{welcomeMessage}</p>
                </div>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-3 justify-end">
              <div className="max-w-[80%]">
                <div 
                  className="rounded-2xl rounded-tr-none p-3 text-white"
                  style={{ backgroundColor: color }}
                >
                  <p className="text-sm">What can this chatbot do?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                style={{ "--tw-ring-color": color } as React.CSSProperties}
              />
              <button 
                className="p-2 rounded-full"
                style={{ backgroundColor: color }}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsExpanded(true)}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105 ${
          !isExpanded ? 'absolute bottom-0' : 'hidden'
        } ${buttonAlignment === 'right' ? 'right-0' : 'left-0'}`}
        style={{ backgroundColor: color }}
      >
        <span className="text-white">{selectedIcon}</span>
        {showButtonText && (
          <span className="text-white font-medium">{buttonText}</span>
        )}
      </button>
    </div>
  );
} 