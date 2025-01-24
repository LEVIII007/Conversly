'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Globe, FileText, Database, MessageSquare, 
  Briefcase, Cloud, Mail, AlertCircle, Lock, Plus, X ,
} from 'lucide-react';
import { QADialog } from '@/components/chatbot/QADialog';
import { addKnowledge } from "@/lib/process-data1";
import { useToast } from "@/hooks/use-toast";

const DATA_SOURCES = {
  productivity: [
    {
      id: 'document',
      name: 'Document',
      description: 'Upload document files containing text (PDF, Word, TXT, etc)',
      icon: FileText,
      available: true
    },
    {
      id: 'qa',
      name: 'Q&A',
      description: 'Finetune your bot by providing common questions and answers',
      icon: MessageSquare,
      available: true
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Answer questions from the content of Notion pages',
      icon: Database,
      available: false
    },
    {
      id : "CSV",
      name : "CSV",
      description : "Upload the QnA in bult in form of specially formatted csv file",
      icon : FileText,
      available : true
    }
  ],
  web: [
    {
      id: 'url',
      name: 'Single URL',
      description: 'Answer from the content from a single webpage',
      icon: Globe,
      available: true
    },
    {
      id: 'sitemap',
      name: 'Sitemap',
      description: 'Answer from all content on a website referenced by its XML sitemap',
      icon: Database,
      available: false
    }
  ],
  cloud: [
    {
      id: 'gdrive',
      name: 'Google Drive',
      description: 'Answer questions from documents in Google Drive',
      icon: Cloud,
      available: false
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Answer questions from documents in Dropbox',
      icon: Cloud,
      available: false
    }
  ],
  business: [
    {
      id: 'zendesk',
      name: 'Zendesk',
      description: 'Answer questions from Zendesk Help Center articles',
      icon: Briefcase,
      available: false
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Answer questions from your Slack workspace',
      icon: Mail,
      available: false
    }
  ]
};

interface QAPair {
  id: string;
  question: string;
  answer: string;
}

interface PendingSource {
  type: 'Website' | 'Document' | 'QandA' | 'CSV';
  name: string;
  content?: File | string;
}

export function DataSourcesTab({ chatbotId }: { chatbotId: string }) {
  const { toast } = useToast();
  const [pendingSources, setPendingSources] = useState<PendingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQADialog, setShowQADialog] = useState(false);

  const handleAddFile = (files: FileList) => {
    const file = files[0];
    if (file) {
      setPendingSources(prev => [...prev, { 
        type: 'Document',
        name: file.name,
        content: file
      }]);
    }
  };

  const handleAddCsv = (files: FileList) => {
    const file = files[0];
    if (file) {
      setPendingSources(prev => [...prev, { 
        type: 'CSV',
        name: file.name,
        content: file
      }]);
    }
  }

  const handleAddURL = (url: string) => {
    if (url.trim()) {
      setPendingSources(prev => [...prev, { 
        type: 'Website',
        name: url.trim()
      }]);
    }
  };

  const handleAddQA = (question: string, answer: string) => {
    setPendingSources(prev => [...prev, {
      type: 'QandA',
      name: question,
      content: answer
    }]);
  };

  const handleRemoveSource = (index: number) => {
    setPendingSources(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAllSources = async () => {
    setIsLoading(true);
    try {
      const websiteURLs = pendingSources
        .filter(source => source.type === 'Website')
        .map(source => source.name);

      const documents = pendingSources
        .filter(source => source.type === 'Document')
        .map(source => ({
          type: (source.content as File).type.includes('pdf') ? 'pdf' as const : 'txt' as const,
          content: source.content as File,
        }));

      const qandaData = pendingSources
        .filter(source => source.type === 'QandA')
        .map(source => ({
          question: source.name,
          answer: source.content as string
        }));

      const csvData = pendingSources
        .filter(source => source.type === 'CSV')
        .map(source => ({
          type: (source.content as File).type.includes('csv') ? 'csv' as const : 'txt' as const,
          content: source.content as File,
        }));

      await addKnowledge({
        chatbotID: chatbotId,
        website_URL: websiteURLs,
        documents,
        qandaData,
      });

      toast({
        title: 'Success',
        description: 'Data sources added successfully',
      });

      // Reset after successful upload
      setPendingSources([]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('maximum number of data sources')) {
        toast({
          title: 'Error',
          description: 'You have reached the maximum number of data sources allowed for this chatbot in the free tier.  Only 2 data sources are allowed.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add data sources',
          variant: 'destructive',
        });
        console.error('Error adding sources:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="productivity" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="web">Web</TabsTrigger>
          <TabsTrigger value="cloud">Cloud Storage</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        {Object.entries(DATA_SOURCES).map(([category, sources]) => (
          <TabsContent key={category} value={category}>
            <div className="grid md:grid-cols-2 gap-4">
              {sources.map((source) => (
                <Card key={source.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      source.available ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <source.icon className={`w-5 h-5 ${
                        source.available ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{source.name}</h3>
                        {!source.available && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {source.description}
                      </p>
                      
                      {source.id === 'document' && source.available && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full relative"
                            onClick={() => document.getElementById(`file-upload-${source.id}`)?.click()}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Upload Document
                            <input
                              id={`file-upload-${source.id}`}
                              type="file"
                              className="hidden"
                              accept=".pdf,.docx,.txt,.md"
                              onChange={(e) => {
                                if (e.target.files?.length) {
                                  handleAddFile(e.target.files);
                                }
                              }}
                            />
                          </Button>
                          <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                            <AlertCircle className="w-3 h-3 mt-0.5" />
                            <span>Supports PDF, Word, TXT, MD. Max 10MB</span>
                          </div>
                        </div>
                      )}

                      {source.id === 'qa' && source.available && (
                        <div className="mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowQADialog(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Q&A Pair
                          </Button>
                        </div>
                      )}

                      {source.id === 'CSV' && source.available && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full relative"
                            onClick={() => document.getElementById(`CSV-${source.id}`)?.click()}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Upload CSV
                            <input
                              id={`CSV-${source.id}`}
                              type="file"
                              className="hidden"
                              accept=".csv"
                              onChange={(e) => {
                                if (e.target.files?.length) {
                                  handleAddFile(e.target.files);
                                }
                              }}
                            />
                          </Button>
                          <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                            <AlertCircle className="w-3 h-3 mt-0.5" />
                            <span>Supports .csv files with 2 columns : Q, A</span>
                          </div>
                        </div>
                      )}


                      {source.id === 'url' && source.available && (
                        <div className="mt-4 space-y-2">
                          <Input 
                            placeholder="Enter website URL"
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                handleAddURL((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                        </div>
                      )}

                      {!source.available && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          disabled
                        >
                          <Lock className="w-3 h-3 mr-2" />
                          Premium Feature
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {pendingSources.length > 0 && (
        <Card className="mt-8 p-4">
          <h3 className="font-medium mb-4">Pending Sources</h3>
          <div className="space-y-2">
            {pendingSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  {source.type === 'Document' && (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>{source.name}</span>
                    </>
                  )}
                  {source.type === 'Website' && (
                    <>
                      <Globe className="w-4 h-4" />
                      <span>{source.name}</span>
                    </>
                  )}
                  {source.type === 'QandA' && (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>{source.name}</span>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSource(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button 
            onClick={handleSaveAllSources}
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save All Sources'}
          </Button>
        </Card>
      )}

      <QADialog 
        isOpen={showQADialog}
        onClose={() => setShowQADialog(false)}
        onSubmit={handleAddQA}
      />
    </div>
  );
} 