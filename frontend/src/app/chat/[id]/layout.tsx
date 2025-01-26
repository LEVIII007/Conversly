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

      // Call addKnowledge function
      const data = await addKnowledge({
        chatbotID: id as string,
        website_URL: websiteUrls,
        documents,
        qandaData: [],
      });

      toast({
        title: 'Success',
        description: 'Knowledge successfully added!',
      });
    } catch (error: any) {
      console.error('Error adding knowledge:', error.message);

      toast({
        title: 'Error',
        description: 'Failed to add knowledge. Please try again.',
      });
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
