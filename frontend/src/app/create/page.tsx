'use client';

import { Globe, Upload, Loader, PlusCircle, Trash } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createChatBot } from '@/lib/process-data';
import { useSession } from 'next-auth/react';

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [websiteUrls, setWebsiteUrls] = useState(['']); // Multiple URLs
  const [files, setFiles] = useState<FileList | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const { data: session } = useSession();

  const handleAddUrlField = () => setWebsiteUrls([...websiteUrls, '']);
  const handleRemoveUrlField = (index: number) =>
    setWebsiteUrls(websiteUrls.filter((_, i) => i !== index));
  const handleUrlChange = (index: number, value: string) =>
    setWebsiteUrls(websiteUrls.map((url, i) => (i === index ? value : url)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare document data as Blob
      const documents = files
        ? Array.from(files).map((file) => ({
            type: file.type.includes('pdf') ? 'pdf' as const : 'txt' as const,
            content: file,
          }))
        : [];

      // Remove empty URLs from the list
      const validUrls = websiteUrls.filter((url) => url.trim() !== '');

      console.log('Creating chatbot:', {
        name,
        systemPrompt,
        validUrls,
        documents
      });

      // Call the createChatBot function
      const chatbot = await createChatBot({
        name,
        description: '',
        System_Prompt: systemPrompt,
        website_URL: validUrls,
        documents,
      });

      // Redirect to the chatbot's page after creation
      router.push(`/chat/${chatbot.chatbot.id}`);
    } catch (error: any) {
      console.error('Error creating chatbot:', error.message || error);
      alert(`Failed to create chatbot: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
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
                <label className="block text-sm font-medium mb-1">Website URLs (Optional)</label>
                {websiteUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1 rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {websiteUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUrlField(index)}
                        className="text-red-500"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddUrlField}
                  className="text-indigo-500 flex items-center gap-1"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add URL
                </button>
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
