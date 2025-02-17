'use client';
import { useState, useEffect } from 'react';
import { Message } from '@/components/chat/Message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { response } from '@/lib/response';
import { SignInDialog } from '../auth/SignInDialog';
import { Bot } from 'lucide-react';

interface ChatInterfaceProps {
  data: {
    System_Prompt: string;
    id: number;
    userId: string;
    name: string;
    isAuthenticated: boolean;
  };
}

interface MessageType {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  citations?: string[];
}

export default function ChatInterface({ data }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(data?.System_Prompt);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    setShowSignIn(!data.isAuthenticated);
  }, [data.isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);

    const newUserMessage: MessageType = {
      id: `user-${Date.now()}`,
      content: input,
      role: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const res = await response({
        chatbotId: data.id.toString(),
        message: newUserMessage.content,
        prompt,
      });

      if (!res.success && res.message) {
        if (res.message === "User ID not found.") {
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue using the chat.",
            variant: "destructive",
          });
          setShowSignIn(true);
          return;
        }

        if (res.message === "Rate limit exceeded. Try again later.") {
          toast({
            title: "Rate Limit Reached",
            description: "You've reached the maximum number of requests. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        if (res.message.includes("Missing") && res.message.includes("environment variables")) {
          toast({
            title: "Configuration Error",
            description: "API configuration is incomplete. Please contact support at tyagishashank118@gmail.com",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Error",
          description: res.message,
          variant: "destructive",
        });
        return;
      }

      if (!res.answer) {
        toast({
          title: "Error", 
          description: "No response received from the assistant",
          variant: "destructive",
        });
        return;
      }

      const newAssistantMessage: MessageType = {
        id: `assistant-${Date.now()}`,
        content: res.answer,
        role: 'assistant',
        citations : res.citations ?? [],
      };

      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#121212] border-b border-gray-700">
        <div className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
              <h1 className="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Conversly AI
              </h1>
            </Link>
          </div>
        </div>

        {/* IntentJS Section */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="font-display text-lg text-gray-200">IntentJS Documentation</h2>
              <p className="text-sm text-gray-400">AI-Powered Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="https://tryintent.com/docs/installation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              View Docs →
            </a>
          </div>
        </div>
      </div>
       {/* Messages Area */}
       <div className="flex-1 overflow-y-auto p-6 md:px-10 lg:px-20 space-y-8 bg-[#101010]">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center px-4 py-8 max-w-2xl mx-auto">
              <div className="p-6 rounded-2xl bg-[#181818] border border-gray-800 shadow-xl">
                <h3 className="text-xl font-display text-gray-200 mb-4">
                  Welcome to IntentJS Assistant 🚀
                </h3>
                <p className="text-gray-400 mb-6">
                  Ask me anything about IntentJS, including installation, configuration, API usage, and best practices.
                </p>
                <div className="grid gap-3 text-left">
                  {[
                    "How do I set up IntentJS?",
                    "What are providers in IntentJS?",
                    "How can I handle authentication?"
                  ].map((question, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(question)}
                      className="p-3 text-sm text-gray-300 hover:text-white 
                              bg-[#202020] hover:bg-[#282828] rounded-lg transition-colors 
                              border border-gray-700"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id}>
                  <Message
                    id={message.id}
                    content={message.content}
                    role={message.role}
                  />

                  {/* Only show citations for assistant messages */}
                  {message.role === 'assistant' && message.citations && message.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.citations.map((citation, idx) => {
                        // e.g. "tryintent/installation" => link to https://tryintent.com/docs/installation
                        const docName = citation.split('/').pop() || citation;
                        return (
                          <a
                            key={idx}
                            href={citation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-3 py-1 bg-purple-600 text-white
                                       rounded-md hover:bg-purple-500 transition-colors
                                       text-sm"
                          >
                            {docName}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <Message id="loading" role="assistant" content="Typing, it may take some time..." />
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-6 bg-[#121212] shadow-lg">
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex gap-4 items-center"
        >
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about IntentJS..."
            className="min-h-[50px] max-h-40 resize-none text-base font-sans
                      bg-[#181818] border-gray-700 rounded-xl text-gray-200
                      focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            rows={1}
          />
          <Button 
            type="submit" 
            className="h-[50px] px-8 text-base font-sans bg-gradient-to-r 
                      from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400
                      text-white rounded-xl transition-all duration-200 hover:scale-105"
            disabled={isLoading}
          >
            Send
          </Button>
        </form>
      </div>

      {/* Sign In Dialog */}
      <SignInDialog isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  );
}
