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
        ${role === 'assistant' ? 'bg-primary/10' : 'bg-secondary'}
      `}>
        {role === 'assistant' ? (
          <Bot size={24} className="text-primary" />
        ) : (
          <User size={24} className="text-secondary-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div className={`
        max-w-[80%] rounded-lg p-5 text-lg leading-relaxed
        ${role === 'assistant' 
          ? 'bg-card border border-border' 
          : 'bg-primary text-primary-foreground'}
      `}>
        <div className="prose dark:prose-invert max-w-none">
          <MemoizedMarkdown content={content} id={id} />
        </div>
        {timestamp && (
          <span className="text-sm text-muted-foreground mt-2 block">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
} 