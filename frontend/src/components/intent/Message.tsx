'use client';
import { Bot, User } from 'lucide-react';
import { MemoizedMarkdown } from '@/components/memoized-markdown';

interface MessageProps {
  content: string;
  role: 'user' | 'assistant';
  id: string;
  timestamp?: string;
}

export function Message({ content, role, id, timestamp }: MessageProps) {
  return (
    <div className={`flex gap-4 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
        ${role === 'assistant' ? 'bg-purple-500/10' : 'bg-gray-700'}
      `}>
        {role === 'assistant' ? (
          <Bot size={24} className="text-purple-400" />
        ) : (
          <User size={24} className="text-gray-300" />
        )}
      </div>

      {/* Message Content */}
      <div className={`
        max-w-[80%] rounded-lg p-5 font-sans text-[15px] leading-relaxed
        ${role === 'assistant' 
          ? 'bg-[#1a1a1a] text-gray-200' 
          : 'bg-purple-500/10 text-gray-200'}
      `}>
        <div className="prose prose-invert prose-p:text-gray-200 prose-p:font-sans prose-p:text-[15px] 
                      prose-code:text-gray-200 prose-pre:bg-[#2a2a2a] prose-pre:text-gray-200
                      max-w-none">
          <MemoizedMarkdown content={content} id={id} />
        </div>
        {timestamp && (
          <span className="text-sm text-gray-500 mt-2 block font-sans">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
