'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { useToast } from '@/hooks/use-toast';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const handleAddknowledge = async (websiteUrls: string[], files: File[]) => {
    
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        onAddKnowledge={handleAddknowledge}
      />
      {children}
    </div>
  );
}
