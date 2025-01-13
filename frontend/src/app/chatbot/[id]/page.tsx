'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/chatbot/Sidebar';
import { DataSourcesTab } from '@/components/chatbot/tabs/DataSourcesTab';
import { SystemPromptTab } from '@/components/chatbot/tabs/SystemPromptTab';
import { CustomizationTab } from '@/components/chatbot/tabs/CustomizationTab';
import { DataManagementTab } from '@/components/chatbot/tabs/DataManagementTab';
import { SettingsTab } from '@/components/chatbot/tabs/SettingsTab';
import { ChatbotHeader } from '@/components/chatbot/ChatbotHeader';
import { useToast } from '@/hooks/use-toast';

export default function ChatbotCustomizationPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotData, setChatbotData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch chatbot data
    const fetchChatbotData = async () => {
      try {
        const response = await fetch(`/api/chatbots/${id}`);
        const data = await response.json();
        setChatbotData(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load chatbot data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatbotData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>; // Replace with proper loading component
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatbotHeader chatbot={chatbotData} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="data-sources" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
              <TabsTrigger value="system-prompt">System Prompt</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
              <TabsTrigger value="data-management">Data Management</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="data-sources">
              <DataSourcesTab chatbotId={id?.toString() ?? ''} />
            </TabsContent>

            <TabsContent value="system-prompt">
              <SystemPromptTab chatbotId={id?.toString() ?? ''} />
            </TabsContent>

            <TabsContent value="customization">
              <CustomizationTab chatbotId={id?.toString() ?? ''} />
            </TabsContent>

            <TabsContent value="data-management">
              <DataManagementTab chatbotId={id?.toString() ?? ''} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab chatbotId={id?.toString() ?? ''} chatbot={chatbotData} />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Test Chatbot</Button>
            <Button>Save Changes</Button>
          </div>
        </footer>
      </div>
    </div>
  );
} 