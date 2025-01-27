'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { useToast } from '@/hooks/use-toast';
import UpperHeader from '@/components/upperHeader';
import { addKnowledge } from '@/lib/process-data1';
import { useParams } from 'next/navigation';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { id } = useParams();


  const handleAddknowledge = async (websiteUrls: string[], files: File[]) => {
    try {
      // const chatbotID =  '6'; // Replace with actual chatbot ID logic

      // Prepare documents for uploading
      const documents = files.map((file) => ({
        type: file.type.includes('pdf') ? ('pdf' as const) : ('txt' as const),
        content: file,
      }));

      const result =  await addKnowledge({ 
        chatbotID: id as string,
        website_URL: websiteUrls,
        documents,
        qandaData : [],
      });

      if (result.processingStatus === 'success') {
        // Simulate a brief delay
        setTimeout(() => {
          toast({
            title: 'Success',
            description: 'Data sources added successfully. Data Source will be available shortly',
          });
          // Reset after successful upload
        }, 4000); // Simulate 2 seconds of loading
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add data sources',
          variant: 'destructive',
        });
      }
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
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <UpperHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onAddKnowledge={handleAddknowledge} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
