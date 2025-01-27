'use client';

import { useState } from 'react';
import { FileUp, Globe, Wand2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { z } from 'zod';
import { urlSchema,fileSchema } from '@/lib/zod';
export interface SidebarProps {
  onAddKnowledge: (urls: string[], files: File[]) => Promise<void>;
}


export function Sidebar({ onAddKnowledge }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [urls, setUrls] = useState(['']);
  const [urlErrors, setUrlErrors] = useState<string[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const { id } = useParams();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFileErrors: string[] = [];
  
      try {
        // Validate each file individually
        files.forEach((file, index) => {
          try {
            fileSchema.parse([file]); // Validate a single file
          } catch (error) {
            if (error instanceof z.ZodError) {
              // Add specific error messages for each file
              newFileErrors.push(`File ${index + 1}: ${error.errors.map((err) => err.message).join(', ')}`);
            }
          }
        });
  
        if (newFileErrors.length > 0) {
          setFileErrors(newFileErrors); // Show error messages for invalid files
          e.target.value = ''; // Clear the file input
        } else {
          setFileErrors([]); // Clear error messages if all files are valid
          await onAddKnowledge(urls, files); // Pass valid files to the parent function
        }
      } catch (error) {
        console.error('Unexpected error during file validation:', error);
        setFileErrors(['An unexpected error occurred. Please try again.']);
        e.target.value = ''; // Clear the file input
      }
    }
  };

  const handleAddURL = async () => {
    const newUrlErrors: string[] = [];

    urls.forEach((url) => {
      try {
        urlSchema.parse(url);
      } catch (error) {
        if (error instanceof z.ZodError) {
          newUrlErrors.push(error.errors.map((err) => err.message).join('\n'));
        }
      }
    });

    if (newUrlErrors.length > 0) {
      setUrlErrors(newUrlErrors);  // Show error messages if validation fails
    } else {
      setUrlErrors([]);  // Clear error messages if validation passes
      await onAddKnowledge(urls, []); // Pass valid URLs to the parent function
      setUrls(['']); // Reset URLs input to base state
    }
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
              className="w-full text-base"
              onClick={async () => {
                try {
                  console.log('Updating prompt:', systemPrompt);
                } catch (error) {
                  console.error('Error updating prompt:', error);
                }
              }}
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
            {urlErrors.length > 0 && (
              <div className="text-sm text-red-600">
                {urlErrors.map((error, idx) => (
                  <p key={idx}>{error}</p>
                ))}
              </div>
            )}
            <Button 
              onClick={() => setUrls([...urls, ''])}
              variant="outline"
              className="w-full text-base"
            >
              <Globe className="mr-2 h-5 w-5" />
              Add Another URL
            </Button>
            <Button 
              onClick={handleAddURL}
              className="w-full text-base"
              disabled={urlErrors.length > 0} // Disable Save button if there are errors
            >
              <Globe className="mr-2 h-5 w-5" />
              Save URLs
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Files</label>
            {fileErrors.length > 0 && (
              <div className="text-sm text-red-600">
                {fileErrors.map((error, idx) => (
                  <p key={idx}>{error}</p>
                ))}
              </div>
            )}
            <Button 
              onClick={() => document.getElementById('file-upload')?.click()}
              variant="outline"
              className="w-full text-base"
              disabled={fileErrors.length > 0} // Disable button if there are file errors
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
