import { Bot, Upload, Globe, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Link href="/create" className="btn-primary">
            Create Chatbot
          </Link>
          <button className="btn-secondary">
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
    </div>
  );
}