'use client';

import { Globe, Upload, Loader } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating processing time
    setTimeout(() => {
      router.push('/chat/new-chat-id');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isLoading ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold mb-2">Creating Your Chatbot</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Processing your data and training the AI...
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Create New Chatbot</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Chatbot Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My AI Assistant"
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are a helpful AI assistant..."
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600 min-h-[100px]"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Define how your chatbot should behave and what role it should play.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Website URL (Optional)</label>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Documents (Optional)</label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn-secondary inline-block cursor-pointer"
                  >
                    Choose Files
                  </label>
                  {files && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                      {Array.from(files).map((file, index) => (
                        <div key={index}>{file.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Create Chatbot
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}