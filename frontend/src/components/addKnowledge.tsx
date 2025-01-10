'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/FileUpload";
import { Plus, X } from 'lucide-react';

interface AddKnowledgeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (urls: string[], files: File[]) => void;
}

export function AddKnowledgeDialog({ isOpen, onClose, onSubmit }: AddKnowledgeDialogProps) {
  const [urls, setUrls] = useState(['']);
  const [files, setFiles] = useState<File[]>([]);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls.length ? newUrls : ['']);
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = urls.filter(url => url.trim() !== '');
    onSubmit(validUrls, files);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Knowledge</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Label htmlFor="urls">Website URLs</Label>
            {urls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="url"
                  id={`url-${index}`}
                  placeholder="Enter website URL"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                />
                {urls.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeUrlField(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {index === urls.length - 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={addUrlField}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Files</Label>
            <FileUpload onChange={handleFileUpload} />
          </div>
          <Button type="submit" className="w-full">
            Add Knowledge
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

