'use client';

import React, { useState } from 'react';
import { Globe, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from './FileUpload';

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
  onAddWebsite: (urls: string[]) => void;
  onAddDocument: (files: File[]) => void;
  onToneChange: (tone: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  selectedTone,
  onAddWebsite,
  onAddDocument,
  onToneChange,
}) => {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [urls, setUrls] = useState(['']);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const handleUrlSubmit = () => {
    onAddWebsite(urls.filter(url => url.trim() !== ''));
    setIsUrlDialogOpen(false);
    setUrls(['']);
  };

  const handleFileUpload = (files: File[]) => {
    onAddDocument(files);
    setIsFileDialogOpen(false);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-gray-800 text-white transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Settings</h2>

        {/* Add Website */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Add Website</h3>
          <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="mr-2 h-4 w-4" />
                Add URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Website URLs</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {urls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="url"
                      placeholder="Enter website URL"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                    />
                    {index === urls.length - 1 && (
                      <Button onClick={addUrlField} size="icon">+</Button>
                    )}
                  </div>
                ))}
                <Button onClick={handleUrlSubmit}>Submit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Add Document */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Add Document</h3>
          <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
              </DialogHeader>
              <FileUpload onChange={handleFileUpload} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tone Settings */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Bot Tone</h3>
          <div className="space-y-2">
            {toneOptions.map((tone) => (
              <button
                key={tone}
                onClick={() => onToneChange(tone)}
                className={`btn-tone ${
                  selectedTone === tone ? 'btn-tone-selected' : 'btn-tone-unselected'
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

