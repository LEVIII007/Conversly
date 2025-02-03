'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DataSourcesTab } from '@/components/chatbot/tabs/DataSourcesTab';
import { SystemPromptTab } from '@/components/chatbot/tabs/SystemPromptTab';
import { CustomizationTab } from '@/components/chatbot/tabs/CustomizationTab';
import { DataManagementTab } from '@/components/chatbot/tabs/DataManagementTab';
import { SettingsTab } from '@/components/chatbot/tabs/SettingsTab';
import { ChatbotHeader } from '@/components/chatbot/ChatbotHeader';
import { useToast } from '@/hooks/use-toast';
import { getChatbotWithOwnership, fetchDataSources } from '@/lib/queries';
import { AnalyticsTab } from '@/components/chatbot/tabs/AnalyticsTab';
import UpperHeader from '@/components/upperHeader';
import Footer from '@/components/landing/footer';

export default function ChatbotCustomizationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotData, setChatbotData] = useState<any>(null);
  const [dataSources, setDataSources] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch chatbot data
    const fetchChatbotData = async () => {
      try {
        const response = await getChatbotWithOwnership(Number(id));
        if (response.status === "error") {
          if (response.message === "Unauthorized") {
            toast({
              title: 'Unauthorized',
              description: 'You do not have permission to access this chatbot.',
              variant: 'destructive',
            });
            router.push('/chatbot'); // Redirect to home or another appropriate page
          } else if (response.message === "Chatbot not found") {
            toast({
              title: 'Not Found',
              description: 'The requested chatbot does not exist.',
              variant: 'destructive',
            });
            router.push('/chatbot'); // Redirect to home or another appropriate page
          } else {
            throw new Error(response.message);
          }
        } else {
          setChatbotData(response.data?.chatbot);
          setDataSources(response.data?.dataSources);
        }
            } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load chatbot data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatbotData();
  }, [id]);

  const handleTestChat = () => {
    router.push(`/chat/${id}`);
  };

  const refreshData = async () => {
    setTimeout(() => {
    }, 20000);
    const updated = await fetchDataSources(Number(id));
    setDataSources(updated);
  };




  // handleAddDataSource = async (sourceType: string) => {
  // handleUpdateSystemPrompt = async (newPrompt: string) => {
  // handleDeleteKnowledge = async (knowledgeId: number) => {
  // handleDeleteChatBot = async () => {

  // const handleUpdateSystemPrompt = (newPrompt: string) => {
  //   setChatbotData((prev: any) => ({ ...prev, System_Prompt: newPrompt }));
  // };

  // const handleAddDataSource = (sourceType: string) => {
  //   // call the db to fetch new data. 
  // };





  if (isLoading) {
    return <div>Loading...</div>; // Replace with proper loading component
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <UpperHeader />
      <div className="flex-1 flex flex-col overflow-hidden mt-16">
      <ChatbotHeader chatbot={chatbotData} />
      
      <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="data" className="w-full">
            <TabsList className="grid w-full grid-cols-6 gap-2">
              <TabsTrigger value="data" className="text-sm">Data Sources</TabsTrigger>
              <TabsTrigger value="data-management" className="text-sm">Data Management</TabsTrigger>
              <TabsTrigger value="customize" className="text-sm">Customize</TabsTrigger>
              <TabsTrigger value="system">System Prompt</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="border rounded-lg">
              <DataSourcesTab chatbotId={id?.toString() ?? ''} onDataAdded={refreshData} />
            </TabsContent>

            <TabsContent value="data-management" className="border rounded-lg">
              <DataManagementTab chatbotId={id?.toString() ?? ''} dataSources={dataSources} onDataDeleted={refreshData} />
            </TabsContent>

            <TabsContent value="customize" className="border rounded-lg">
              <CustomizationTab chatbotId={id?.toString() ?? ''} prompt={chatbotData.System_Prompt} />
            </TabsContent>

            <TabsContent value="system" className="border rounded-lg">
              <SystemPromptTab chatbotId={id?.toString() ?? ''} System_Prompt={chatbotData.System_Prompt} />
            </TabsContent>

            <TabsContent value="analytics" className="border rounded-lg">
              <AnalyticsTab chatbotId={id?.toString() ?? ''} />
            </TabsContent>
            <TabsContent value="settings" className="border rounded-lg">
              <SettingsTab chatbotId={id?.toString() ?? ''} chatbot={chatbotData} />
            </TabsContent>
          </Tabs>
          
        </main>
        <footer className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex justify-end space-x-4">
            <Button 
              onClick={handleTestChat}
              variant="outline"
              className="text-base"
            >
              Test Chatbot
            </Button>
          </div>
        </footer>
      </div>
      </div>
  );
} 