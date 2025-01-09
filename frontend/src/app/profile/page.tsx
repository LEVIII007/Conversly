'use client';

import { useState } from 'react';
import { Bot, Calendar, Mail, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with real data from your backend
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  subscription: {
    plan: 'Premium',
    validUntil: '2024-12-31',
    status: 'active',
  },
  chatbots: [
    {
      id: '1',
      name: 'Website Assistant',
      type: 'website',
      status: 'active',
      createdAt: '2024-02-20',
    },
    {
      id: '2',
      name: 'Document Helper',
      type: 'document',
      status: 'training',
      createdAt: '2024-02-19',
    },
  ],
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(mockUser.name);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xl font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <h2 className="text-xl font-semibold">{name}</h2>
              )}
              <p className="text-gray-600 dark:text-gray-300 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {mockUser.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Subscription</h2>
          <Link href="/subscription" className="btn-primary">
            Manage Subscription
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <p className="text-lg font-medium">{mockUser.subscription.plan} Plan</p>
            <p className="text-gray-600 dark:text-gray-300 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Valid until {mockUser.subscription.validUntil}
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
            {mockUser.subscription.status}
          </span>
        </div>
      </div>

      {/* Chatbots List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Chatbots</h2>
          <Link href="/create" className="btn-primary">
            Create New
          </Link>
        </div>
        <div className="grid gap-4">
          {mockUser.chatbots.map((bot) => (
            <div
              key={bot.id}
              className="border dark:border-gray-700 rounded-lg p-4 hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h3 className="font-medium">{bot.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Created on {bot.createdAt}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/chat/${bot.id}`}
                  className="btn-secondary text-sm"
                >
                  Open Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}