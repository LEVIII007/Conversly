'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Settings } from 'lucide-react';
import { useParams } from 'next/navigation';
import { addKnowledge } from '@/lib/process-data';
import { useToast } from '@/hooks/use-toast';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const { toast } = useToast();


    const params = useParams();
    const chatbotID = params.id?.toString() || '';

    const handleAddknowledge = async ( websiteUrls: string[], files: File[]) => {
        console.log('Adding knowledge with URLs:', websiteUrls);
        console.log('Adding knowledge with Files:', files);
        const documents = files
        ? Array.from(files).map((file) => ({
            type: file.type.includes('pdf') ? 'pdf' as const : 'txt' as const,
            content: file,
          }))
        : [];

        const validUrls = websiteUrls.filter((url) => url.trim() !== '');

        const result = await addKnowledge({
            chatbotID,
            website_URL: validUrls,
            documents: files.map((file) => ({
                type: file.type.includes('pdf') ? 'pdf' : 'txt',
                content: file,
            })),
        
        });
        if(result.processingStatus === 'success'){
            console.log('Knowledge added successfully');
            toast({
                title: 'Data added successfully',
            });
        }
        else{
            console.error('Failed to add knowledge');
            toast({
                title: 'Failed to add knowledge',
            });
        }
    };

  const handleToneChange = (tone: string) => {
    setSelectedTone(tone);
    console.log(`Tone changed to ${tone}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        selectedTone={selectedTone}
        onAddKnowledge={handleAddknowledge}
        onToneChange={handleToneChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="btn-floating lg:hidden"
      >
        <Settings size={24} />
      </button>
    </div>
  );
}
