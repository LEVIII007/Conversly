'use client';
import { useState } from 'react';
import { Message } from '@/components/chat/Message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from 'ai/react';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  data: {
    System_Prompt: string;
    id: number;
    userId: string;
    name: string;
  };
}

export default function ChatInterface({ data }: ChatInterfaceProps) {
  const {toast} = useToast();
  const [tone, setTone] = useState('neutral');
  const [prompt, setPrompt] = useState(data?.System_Prompt);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    maxToolRoundtrips: 5,
    body: {
      chatbotID: data?.id.toString(),
      tone,
      prompt,
    },
  });

  const handleLimitedSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const now = Date.now();
    const hour = 3600000; // One hour in milliseconds
    const storageKey = "chatMessageTimestamps";
    let timestamps: number[] = [];

    // Retrieve stored timestamps (if any)
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        timestamps = JSON.parse(stored);
      } catch (error) {
        timestamps = [];
      }
    }
    
    // Keep only timestamps from the last hour
    timestamps = timestamps.filter(ts => now - ts < hour);

    // If 10 or more messages have been sent within the last hour, block further messages
    if (timestamps.length >= 5) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You can only send 5 messages per hour.",
        variant: "destructive",
      });
      return;
    }

    // Record the new message's timestamp and update storage
    timestamps.push(now);
    localStorage.setItem(storageKey, JSON.stringify(timestamps));

    // Proceed with sending the message
    handleSubmit(e);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <div className="h-16 border-b border-border flex items-center px-6 bg-card">
        <h1 className="text-2xl font-semibold">Chat Session</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            content={message.content}
            role={message.role as 'user' | 'assistant'}
          />
        ))}
        {isLoading && (
          <Message id="loading" role="assistant" content="Typing..." />
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-6 bg-card">
        <form 
          onSubmit={handleLimitedSubmit}
          className="max-w-4xl mx-auto flex gap-4"
        >
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-40 resize-none text-lg"
            rows={1}
          />
          <Button 
            type="submit" 
            className="h-[60px] px-8 text-lg font-medium"
            disabled={isLoading}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
