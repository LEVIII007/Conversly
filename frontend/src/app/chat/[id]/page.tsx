'use client';
import { useState} from 'react';
import { Message } from '@/components/chat/Message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from 'ai/react';
import { useParams } from 'next/navigation';



export default function ChatPage() {
  const { id } = useParams();
  const [tone, setTone] = useState('friendly');
  const [prompt, setPrompt] = useState('');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    maxToolRoundtrips: 5,
    body: {
      chatbotID: id,
      tone,
      prompt,
    },
  });

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
          <Message
            id="loading"
            role="assistant"
            content="Typing..."
          />
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-6 bg-card">
        <form 
          onSubmit={handleSubmit}
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

