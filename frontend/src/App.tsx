import React from 'react';
import { Bot, Upload, Globe, Plus } from 'lucide-react';
import RootLayout from './app/layout';

function App() {
  return (
    <RootLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center py-20 space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white">
            Create AI Chatbots with Ease
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Build custom AI chatbots trained on your website content or documents.
            Get instant, accurate responses tailored to your data.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Create Chatbot
            </button>
            <button className="px-6 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
              Learn More
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 py-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Website Scraping</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Train your chatbot using content from any website. Just provide the URL and we'll handle the rest.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Document Upload</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload PDFs, Word documents, or other files to create a knowledge base for your chatbot.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Responses</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced AI ensures accurate, context-aware responses based on your specific data.
            </p>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Chatbots</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              <Plus className="h-4 w-4" />
              New Chatbot
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Chatbot Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Website Assistant</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Created 2 days ago</p>
                </div>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Ready
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Trained on website content to answer product-related questions.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
}

export default App;