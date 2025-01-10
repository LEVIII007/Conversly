'use client';

import React, { useState } from 'react';
import { Globe, Upload, Book } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddKnowledgeDialog } from './addKnowledge';

const toneOptions = [
  "Professional",
  "Casual",
  "Friendly",
  "Technical",
  "Simple"
];

interface SidebarProps {
  isSidebarOpen: boolean;
  selectedTone: string;
  onAddKnowledge: (urls: string[], files: File[]) => void;
  onToneChange: (tone: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  selectedTone,
  onAddKnowledge,
  onToneChange,
}) => {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [urls, setUrls] = useState(['']);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const handleUrlSubmit = () => {
    onAddKnowledge(urls.filter(url => url.trim() !== ''), []); // Pass empty files array
    setIsUrlDialogOpen(false);
    setUrls(['']);
  };

  const handleFileUpload = (files: File[]) => {
    onAddKnowledge([], files); // Pass empty urls array
    setIsFileDialogOpen(false);
  };

  const handleAddKnowledge = (urls: string[], files: File[]) => {
    onAddKnowledge(urls, files);
    setIsDialogOpen(false);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-gray-800 text-white transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Settings</h2>

        {/* Add Knowledge */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Add Knowledge</h3>
          <Button
            variant="outline"
            className="w-full justify-start text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            <Book className="mr-2 h-4 w-4" />
            Add URLs or Files
          </Button>
          <AddKnowledgeDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleAddKnowledge}
          />
        </div>

        {/* Tone Settings */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Bot Tone</h3>
          <div className="space-y-2">
            {toneOptions.map((tone) => (
              <button
                key={tone}
                onClick={() => onToneChange(tone)}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedTone === tone
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

