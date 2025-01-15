'use client';

import { useState } from 'react';
import { FileUp, Globe, Wand2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { updateSystemPrompt } from '@/lib/queries'; // Import your existing functions

interface SidebarProps {
  onAddKnowledge: (urls: string[], files: File[]) => Promise<void>;
}

export function Sidebar({ onAddKnowledge }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [urls, setUrls] = useState(['']);
  const { id } = useParams();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddKnowledge(urls, Array.from(e.target.files));
    }
  };
  const handlePromptUpdate = async () => {
    await updateSystemPrompt(Number(id), systemPrompt);
  };

  return (
    <div className={`
      relative border-r border-border bg-card transition-all duration-300
      ${isCollapsed ? 'w-20' : 'w-96'}
    `}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </Button>

      <div className={`h-full p-6 ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="space-y-6">
          {/* Header with Settings Link */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Chat Settings</h2>
            <Link href={`/chatbot/${id}`}>
              <Button variant="ghost" size="icon">
                <Settings size={20} />
              </Button>
            </Link>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium">System Prompt</label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Define how your chatbot should behave..."
              className="h-32 text-base"
            />
            <Button 
              onClick={handlePromptUpdate}
              className="w-full text-base"
            >
              <Wand2 className="mr-2 h-5 w-5" />
              Update Prompt
            </Button>
          </div>

          {/* URLs Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Add Knowledge from URLs</label>
            {urls.map((url, index) => (
              <Input
                key={index}
                value={url}
                onChange={(e) => {
                  const newUrls = [...urls];
                  newUrls[index] = e.target.value;
                  setUrls(newUrls);
                }}
                placeholder="https://..."
                className="text-base"
              />
            ))}
            <Button 
              onClick={() => setUrls([...urls, ''])}
              variant="outline"
              className="w-full text-base"
            >
              <Globe className="mr-2 h-5 w-5" />
              Add Another URL
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Files</label>
            <Button 
              onClick={() => document.getElementById('file-upload')?.click()}
              variant="outline"
              className="w-full text-base"
            >
              <FileUp className="mr-2 h-5 w-5" />
              Choose Files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

