'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Globe, FileText, Database, MessageSquare,
  Briefcase, Cloud, Mail, AlertCircle, Lock, Plus, X,
  Upload, ArrowRight, Info
} from 'lucide-react';
import { QADialog } from '@/components/chatbot/QADialog';
import { addKnowledge } from "@/lib/process-data1";
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';
import { documentSchema, csvSchema, urlSchema } from '@/lib/zod';
import { motion } from "framer-motion";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

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
      id: "CSV",
      name: "CSV",
      description: "Upload the QnA in bult in form of specially formatted csv file",
      icon: FileText,
      available: true
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
  id: string;
  type: 'Website' | 'Document' | 'QandA' | 'CSV';
  name: string;
  content?: File | string;
}

const dataSources = [
  {
    title: "Website Import",
    description: "Train your assistant on your website content",
    icon: Globe,
    type: "website",
    features: ["Automatic crawling", "Regular updates", "Structured data"],
    gradient: "from-pink-500/10 via-purple-500/10 to-blue-500/10",
  },
  {
    title: "Document Upload",
    description: "Upload PDFs, DOCs, and other files",
    icon: Upload,
    type: "document",
    features: ["Multiple formats", "Batch upload", "Text extraction"],
    gradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10",
  },
  {
    title: "API Integration",
    description: "Connect to external data sources",
    icon: Database,
    type: "api",
    features: ["Real-time sync", "Custom endpoints", "Secure access"],
    gradient: "from-purple-500/10 via-pink-500/10 to-blue-500/10",
  },
]

export function DataSourcesTab({ chatbotId, onDataAdded }: { chatbotId: string; onDataAdded: () => void }) {
  const { toast } = useToast();
  const [pendingSources, setPendingSources] = useState<PendingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQADialog, setShowQADialog] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleAddFile = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Validate file name and size
    const parsed = documentSchema.safeParse({ name: file.name, size: file.size });
    if (!parsed.success) {
      toast({
        title: 'Invalid document file',
        description: parsed.error.errors[0].message,
      });
      return;
    }

    // Add to pending sources
    setPendingSources((prev) => [
      ...prev,
      { type: 'Document', name: file.name, content: file, id: Date.now().toString() },
    ]);

    // Reset file input value
    const fileInput = document.getElementById(`file-upload-document`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };


  const handleAddCsv = (files: FileList) => {
    console.log("files", files);
    const file = files[0];
    if (!file) return;

    console.log("name", file.name)

    // Step 1: Validate file type and size
    const parsed = csvSchema.safeParse({ name: file.name, size: file.size });
    if (!parsed.success) {
      toast({
        title: 'Invalid CSV file',
        description: parsed.error.errors[0].message,
      });
      return;
    }

    // Step 2: Parse the CSV and validate columns
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        const headers = results.meta.fields;

        // Ensure required columns are present
        if (!headers?.includes('Q') || !headers.includes('A')) {
          toast({
            title: 'Invalid CSV format',
            description: 'CSV file must contain "Q" and "A" columns.',
          });
          return;
        }

        // If valid, add to pending sources
        setPendingSources((prev) => [
          ...prev,
          { type: 'CSV', name: file.name, content: file, id: Date.now().toString() },
        ]);

        const fileInput = document.querySelector('CSV-file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // Reset the file input
        }
      },
      error: (error) => {
        toast({
          title: 'Error parsing CSV',
          description: error.message,
        });
      },
    });
  };

  const handleAddURL = (url: string) => {
    if (url.trim()) {
      const parsed = urlSchema.safeParse(url);
      if (!parsed.success) {
        toast({
          title: 'Invalid URL',
          description: parsed.error.errors[0].message,
        });
        return;
      }
      setPendingSources(prev => [...prev, {
        type: 'Website',
        name: url.trim(),
        id: Date.now().toString()
      }]);
    }
  };

  const handleAddQA = (question: string, answer: string) => {
    setPendingSources(prev => [...prev, {
      id: Date.now().toString(),
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
          type: 'csv' as const,
          content: source.content as File,
        }));
  
      console.log("csvData", csvData);
  
      const result = await addKnowledge({
        chatbotID: chatbotId,
        website_URL: websiteURLs,
        documents,
        qandaData,
        CSV: csvData
      });
  
      if (result.processingStatus === 'success') {
        setTimeout(() => {
          toast({
            title: 'Success',
            description: 'Data sources added successfully. Data Source will be available shortly',
          });
          
          // Reset sources after toast is shown
          setPendingSources([]);
  
          // Enable submit button after 5 seconds
          setIsLoading(false);
        }, 5000);
  
        setTimeout(() => {
          onDataAdded();
        }, 10000);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add data sources',
          variant: 'destructive',
        });
  
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('maximum number of data sources')) {
        toast({
          title: 'Error',
          description: 'You have reached the maximum number of data sources allowed for this chatbot in the free tier. Only 2 data sources are allowed.',
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
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    console.log('Component re-rendered');
  }, [pendingSources]);

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
        <h2 className="font-heading text-xl text-white mb-2">Knowledge Sources</h2>
        <p className="font-sans text-base text-gray-400">
          Enhance your AI assistant by adding different types of knowledge sources.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="productivity" className="space-y-6">
        <TabsList className="bg-gray-900/60 p-1 rounded-xl">
          <TabsTrigger 
            value="productivity" 
            className="font-sans text-base data-[state=active]:bg-gradient-to-r from-pink-500 to-purple-500 data-[state=active]:text-white"
          >
            Productivity
          </TabsTrigger>
          <TabsTrigger 
            value="web"
            className="font-sans text-base data-[state=active]:bg-gradient-to-r from-pink-500 to-purple-500 data-[state=active]:text-white"
          >
            Web
          </TabsTrigger>
          <TabsTrigger 
            value="cloud"
            className="font-sans text-base data-[state=active]:bg-gradient-to-r from-pink-500 to-purple-500 data-[state=active]:text-white"
          >
            Cloud
          </TabsTrigger>
          <TabsTrigger 
            value="business"
            className="font-sans text-base data-[state=active]:bg-gradient-to-r from-pink-500 to-purple-500 data-[state=active]:text-white"
          >
            Business
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        {Object.entries(DATA_SOURCES).map(([category, sources]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map((source) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-500/10 rounded-2xl" />
                  
                  <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 h-full transition-all duration-300 hover:border-pink-500/20">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 mb-4">
                      <source.icon className="w-6 h-6 text-pink-500" />
                    </div>

                    <h3 className="font-heading text-lg font-semibold text-white mb-2">
                      {source.name}
                      {!source.available && (
                        <span className="ml-2 inline-flex items-center">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </span>
                      )}
                    </h3>

                    <p className="font-sans text-base text-gray-400 mb-4">
                      {source.description}
                    </p>

                    {source.available ? (
                      source.id === 'document' ? (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            id={`file-upload-${source.id}`}
                            className="hidden"
                            onChange={(e) => e.target.files && handleAddFile(e.target.files)}
                          />
                          <Button 
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 rounded-xl group"
                          >
                            Upload Document
                            <Upload className="ml-2 w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                          </Button>
                        </label>
                      ) : source.id === 'CSV' ? (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            id={`file-upload-${source.id}`}
                            className="hidden"
                            onChange={(e) => e.target.files && handleAddCsv(e.target.files)}
                            accept=".csv"
                          />
                          <Button 
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 rounded-xl group"
                          >
                            Upload CSV
                            <Upload className="ml-2 w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                          </Button>
                        </label>
                      ) : source.id === 'qa' ? (
                        <Button
                          onClick={() => setShowQADialog(true)}
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 rounded-xl group"
                        >
                          Add Q&A Pairs
                          <Plus className="ml-2 w-4 h-4 group-hover:rotate-90 transition-transform" />
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 rounded-xl group"
                        >
                          Connect
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      )
                    ) : (
                      <Button 
                        disabled 
                        className="w-full bg-gray-800 text-gray-400 cursor-not-allowed rounded-xl"
                      >
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Pending Sources */}
      {pendingSources.length > 0 && (
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
          <h3 className="font-heading text-lg text-white mb-4">Pending Sources</h3>
          <div className="space-y-3">
            {pendingSources.map((source) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-pink-500" />
                  <span className="font-sans text-base text-white">{source.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPendingSources(prev => prev.filter(s => s.id !== source.id))}
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
            
            <Button
              onClick={handleSaveAllSources}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 rounded-xl group mt-4"
            >
              {isLoading ? "Processing..." : "Process All Sources"}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* QA Dialog */}
      <QADialog
        isOpen={showQADialog}
        onClose={() => setShowQADialog(false)}
        onSubmit={handleAddQA}
      />
    </div>
  );
} 