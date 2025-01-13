'use client';

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Globe, Plus, MessageSquare, Trash, NotebookPen, FileCode, Github, Cloud, FileIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addKnowledge } from "@/lib/process-data";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface QandA {
  question: string;
  answer: string;
}

interface PendingSource {
  type: 'Website' | 'Document' | 'QandA';
  name: string;
  content?: string | File;
}

export function DataSourcesTab({ chatbotId }: { chatbotId: string }) {
  const [websiteUrls, setWebsiteUrls] = useState(['']);
  const [files, setFiles] = useState<File[]>([]);
  const [qandaList, setQandaList] = useState<QandA[]>([]);
  const [currentQA, setCurrentQA] = useState<QandA>({ question: '', answer: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSources, setPendingSources] = useState<PendingSource[]>([]);
  const { toast } = useToast();

  const handleAddUrlField = () => setWebsiteUrls([...websiteUrls, '']);
  const handleRemoveUrlField = (index: number) =>
    setWebsiteUrls(websiteUrls.filter((_, i) => i !== index));
  const handleUrlChange = (index: number, value: string) =>
    setWebsiteUrls(websiteUrls.map((url, i) => (i === index ? value : url)));

  const handleUrlAdd = () => {
    const validUrls = websiteUrls.filter(url => url.trim() !== '');
    if (validUrls.length > 0) {
      setPendingSources(prev => [
        ...prev,
        ...validUrls.map(url => ({ type: 'Website' as const, name: url }))
      ]);
      setWebsiteUrls(['']);
    }
  };

  const handleFileAdd = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setPendingSources(prev => [
      ...prev,
      ...newFiles.map(file => ({ type: 'Document' as const, name: file.name, content: file }))
    ]);
  };

  const handleQAAdd = () => {
    if (currentQA.question.trim() && currentQA.answer.trim()) {
      setQandaList(prev => [...prev, currentQA]);
      setPendingSources(prev => [...prev, {
        type: 'QandA',
        name: currentQA.question,
        content: currentQA.answer
      }]);
      setCurrentQA({ question: '', answer: '' });
    }
  };

  const handleRemoveSource = (index: number) => {
    setPendingSources(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const websiteURLs = pendingSources
        .filter(source => source.type === 'Website')
        .map(source => source.name);

      const documents = files.map(file => ({
        type: file.type.includes('pdf') ? 'pdf' as const : 'txt' as const,
        content: file,
      }));

      // Add Q&A data to your backend...
      const qandaData = pendingSources
        .filter(source => source.type === 'QandA')
        .map(source => ({
          question: source.name,
          answer: source.content as string
        }));

      await addKnowledge({
        chatbotID: chatbotId,
        website_URL: websiteURLs,
        documents,
        qandaData, // You'll need to update your backend to handle this
      });

      toast({
        title: 'Success',
        description: 'Data sources added successfully',
      });

      // Reset everything
      setPendingSources([]);
      setWebsiteUrls(['']);
      setFiles([]);
      setQandaList([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add data sources',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const comingSoonFeatures = [
    { icon: Cloud, label: 'Google Drive' },
    { icon: NotebookPen, label: 'Notion' },
    { icon: MessageSquare, label: 'Discord' },
    { icon: FileCode, label: 'Code Repository' },
    { icon: Github, label: 'GitHub' },
  ];

  return (
    <div className="space-y-8">
      {/* Website URLs Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5" /> Website URLs
        </h3>
        {websiteUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="https://example.com"
              className="flex-1"
            />
            {websiteUrls.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveUrlField(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          onClick={handleUrlAdd}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> Add URL
        </Button>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Upload Documents</h3>
        <FileUpload onChange={(files) => handleFileAdd(files)} />
      </div>

      {/* Q&A Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Questions & Answers
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Q&A
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Question & Answer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Question</label>
                <Input
                  value={currentQA.question}
                  onChange={(e) => setCurrentQA(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter your question"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Answer</label>
                <Textarea
                  value={currentQA.answer}
                  onChange={(e) => setCurrentQA(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Enter the answer"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleQAAdd}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Sources Display */}
      {pendingSources.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Pending Sources</h3>
          <div className="grid gap-2">
            {pendingSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {source.type === 'Website' && <Globe className="w-4 h-4" />}
                  {source.type === 'Document' && <FileIcon className="w-4 h-4" />}
                  {source.type === 'QandA' && <MessageSquare className="w-4 h-4" />}
                  <span>{source.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSource(index)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Features */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Coming Soon</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {comingSoonFeatures.map((feature) => (
            <div
              key={feature.label}
              className="border rounded-lg p-4 flex items-center gap-3 opacity-50 cursor-not-allowed"
            >
              <feature.icon className="w-5 h-5" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading || pendingSources.length === 0}
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Add Data Sources'}
      </Button>
    </div>
  );
} 