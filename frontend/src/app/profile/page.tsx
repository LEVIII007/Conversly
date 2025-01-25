'use client';

// Add this export to disable static rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { Bot, Calendar, Mail, UserIcon, MoreVertical, MessageCircle, Trash2, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getChatBots, DeleteChatBot } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import  UpperHeader from '@/components/upperHeader';

interface ChatBot {
  name: string;
  createdAt: Date | null;
  id: number;
  description: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [chatbots, setChatbots] = useState<ChatBot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const { data: session, status } = useSession();

  const fetchChatBots = useCallback(async () => {
    try {
      setIsLoading(true);
      const chatbots = await getChatBots();
      setChatbots(chatbots);
    } catch (error) {
      setError('Failed to fetch chatbots');
      console.error('Error fetching chatbots:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (mounted && status === 'authenticated') {
      fetchChatBots();
    }
  }, [mounted, status, fetchChatBots]);

  if (!mounted) return null;

  const handleDeleteBot = async (botId: number) => {
    if (window.confirm('Are you sure you want to delete this chatbot?')) {
      try {
        await DeleteChatBot({ id: botId });
        setChatbots(prevBots => prevBots.filter(bot => bot.id !== botId));
      } catch (error) {
        console.error('Error deleting chatbot:', error);
        setError('Failed to delete chatbot. Please try again.');
      }
    }
  };

  const toggleDropdown = (botId: number) => {
    setOpenDropdown(openDropdown === botId ? null : botId);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <div className="text-center mt-8">You are not signed in. Please sign in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-16">
      <UpperHeader />
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-card/80 to-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border/50">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                {name || 'Welcome!'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your AI assistants
              </p>
            </div>
          </div>
        </div>

        {/* Create New Button */}
        <Link 
          href="/create"
          className="group block bg-gradient-to-br from-primary/10 via-card to-card hover:from-primary/20 rounded-xl p-6 shadow-lg border border-border/50 transition-all duration-200 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Create New Chatbot</h2>
                <p className="text-muted-foreground text-sm">Build a new AI assistant</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Chatbots Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {chatbots.map((bot) => (
            <Link 
              key={bot.id}
              href={`/chatbot/${bot.id}`}
              className="group bg-card/50 hover:bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border/50 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{bot.name}</h3>
                    <p className="text-muted-foreground text-sm">{bot.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(bot.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown(bot.id);
                    }}
                    className="hover:bg-primary/10"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                  
                  {openDropdown === bot.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-xl border border-border/50 py-1 z-10">
                      <Link 
                        href={`/chatbot/${bot.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Configure
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteBot(bot.id);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 w-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <div className="flex justify-center p-8">
            <div className="w-10 h-10 border-4 border-primary border-dashed rounded-full animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
