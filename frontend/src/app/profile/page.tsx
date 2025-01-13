'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bot, Calendar, Mail, UserIcon, MoreVertical, MessageCircle, Trash2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getChatBots, DeleteChatBot } from '@/lib/queries';

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
  const { data: session, status } = useSession();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const fetchChatBots = useCallback(async () => {
    try {
      console.log('Starting to fetch chatbots');
      setIsLoading(true);
      setError(null);
      const bots = await getChatBots();
      console.log('Fetched chatbots:', bots);
      setChatbots(bots);
    } catch (err) {
      console.error('Error fetching chatbots:', err);
      setError('Failed to fetch chatbots. Please try again later.');
    } finally {
      console.log('Finished fetching chatbots');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('Status:', status);
    console.log('Session:', session);
    if (status === 'authenticated') {
      console.log('User is authenticated, fetching chatbots');
      fetchChatBots();
    } else if (status === 'unauthenticated') {
      console.log('User is unauthenticated');
      setIsLoading(false);
    }
  }, [status, fetchChatBots]);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  const handleDeleteBot = async (botId: number) => {
    if (window.confirm('Are you sure you want to delete this chatbot?')) {
      try {
        await DeleteChatBot({ id: botId });
        setChatbots(chatbots.filter(bot => bot.id !== botId));
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        {/* Profile Header */}
        <div className="bg-card text-card-foreground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300"
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                <UserIcon className="w-10 h-10 text-secondary-foreground" />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-xl font-semibold bg-transparent border-b-2 border-input focus:border-ring focus:outline-none transition-colors duration-300"
                  />
                ) : (
                  <h2 className="text-2xl font-semibold">{name}</h2>
                )}
                <p className="text-muted-foreground flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-card text-card-foreground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Subscription</h2>
            <Link href="/subscription" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300">
              Manage Subscription
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-lg font-medium">Plan</p>
              <p className="text-muted-foreground flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Valid until 30th June 2023
              </p>
            </div>
            <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold">
              Active
            </span>
          </div>
        </div>

        {/* Chatbots List */}
        <div className="bg-card text-card-foreground rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Chatbots</h2>
            <Link href="/create" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300">
              Create New
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 border-4 border-primary border-dashed rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : (
            <div className="grid gap-4">
              {chatbots.length === 0 ? (
                <p>No chatbots found.</p>
              ) : (
                chatbots.map((bot) => (
                  <div
                    key={bot.id}
                    className="border border-border rounded-lg p-4 hover:border-primary transition-colors duration-300 cursor-pointer bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bot className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{bot.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created on {bot.createdAt ? new Date(bot.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(bot.id);
                          }}
                          className="p-2 hover:bg-accent rounded-full transition-colors duration-300"
                        >
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                        {openDropdown === bot.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-md overflow-hidden shadow-xl z-50">
                            <Link
                              href={`/chat/${bot.id}`}
                              className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-300"
                            >
                              <MessageCircle className="w-4 h-4 inline-block mr-2" />
                              Open Chat
                            </Link>
                            <Link
                              href={`/chatbot/${bot.id}`}
                              className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-300"
                            >
                              <Settings className="w-4 h-4 inline-block mr-2" />
                              Manage Settings
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBot(bot.id);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors duration-300"
                            >
                              <Trash2 className="w-4 h-4 inline-block mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

