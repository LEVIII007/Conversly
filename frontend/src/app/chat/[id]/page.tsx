'use client';
import { useState } from 'react';
import { Message } from '@/components/chat/Message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from 'ai/react';
import { useParams } from 'next/navigation';
import { z } from 'zod';
import { inputSchema,promptSchema  } from '@/lib/zod';

export default function ChatPage() {
  const { id } = useParams();
  const [tone, setTone] = useState('friendly');
  const [prompt, setPrompt] = useState('');
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const { messages, isLoading, handleSubmit } = useChat({
    maxToolRoundtrips: 5,
    body: {
      chatbotID: id,
      tone,
      prompt,
    },
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]); // Reset errors before each submission

    // Validate input and prompt with Zod
    try {
      inputSchema.parse(input);
      promptSchema.parse(prompt); // Validate prompt if needed
      handleSubmit();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors.map((err) => err.message));
      }
    }
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
          onSubmit={handleFormSubmit} 
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
        {/* Display errors if validation fails */}
        {errors.length > 0 && (
          <div className="mt-4 text-red-600 text-sm">
            {errors.map((error, idx) => (
              <p key={idx}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
