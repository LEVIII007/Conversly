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
import { getChatbotWithOwnership, fetchDataSources, getAnalytics } from '@/lib/queries';
import { AnalyticsTab } from '@/components/chatbot/tabs/AnalyticsTab';
import UpperHeader from '@/components/upperHeader';
import { motion } from 'framer-motion';
import { Database, MessageSquare, Palette, Settings2, BarChart, Bot } from 'lucide-react';

export default function ChatbotCustomizationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotData, setChatbotData] = useState<any>(null);
  const [dataSources, setDataSources] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatbotResponse, analyticsResponse] = await Promise.all([
          getChatbotWithOwnership(Number(id)),
          getAnalytics(Number(id))
        ]);

        if (chatbotResponse.status === "error") {
          handleError(chatbotResponse.message);
          return;
        }

        setChatbotData(chatbotResponse.data?.chatbot);
        setDataSources(chatbotResponse.data?.dataSources);
        setAnalyticsData(analyticsResponse);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleError = (error: any) => {
    const message = error?.message || 'Failed to load chatbot data';
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
    if (message.includes('Unauthorized') || message.includes('not found')) {
      router.push('/chatbot');
    }
  };

  const handleTestChat = () => {
    router.push(`/chat/${id}`);
  };

  const refreshData = async () => {
    setTimeout(() => {
    }, 20000);
    const updated = await fetchDataSources(Number(id));
    setDataSources(updated);
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white font-heading text-xl">Loading...</div>
      </div>
    );
  }

  const tabs = [
    {
      value: "data",
      label: "Data Sources",
      icon: Database,
      description: "Add and manage your chatbot's knowledge sources"
    },
    {
      value: "data-management",
      label: "Data Management",
      icon: MessageSquare,
      description: "Organize and clean your training data"
    },
    {
      value: "customize",
      label: "Customize",
      icon: Palette,
      description: "Personalize your chatbot's appearance"
    },
    {
      value: "system",
      label: "System Prompt",
      icon: Bot,
      description: "Define your chatbot's behavior"
    },
    {
      value: "analytics",
      label: "Analytics",
      icon: BarChart,
      description: "Track performance and usage"
    },
    {
      value: "settings",
      label: "Settings",
      icon: Settings2,
      description: "Configure general settings"
    }
  ];

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-background to-transparent opacity-30" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(black,transparent_10%)]" />
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 first-line:border-b border-gray-800/60">
        <UpperHeader />
      </div>

      <div className="relative container pt-24 pb-16">
        <ChatbotHeader chatbot={chatbotData} />

        <main className="mt-8">
          <Tabs defaultValue="data" className="space-y-8">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-4">
              <TabsList className="grid grid-cols-6 gap-2 bg-transparent">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500
                      flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-800/60 
                      backdrop-blur-sm transition-all duration-200 hover:border-pink-500/30
                      font-sans text-base text-gray-400 hover:text-white data-[state=active]:text-white
                      data-[state=active]:border-transparent"
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab Descriptions */}
              <div className="mt-4 font-sans text-gray-400 text-sm">
                {tabs.map((tab) => (
                  <motion.div
                    key={tab.value}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hidden data-[state=active]:block"
                    data-state={tab.value === "data" ? "active" : "inactive"}
                  >
                    {tab.description}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="space-y-6">
              <TabsContent value="data">
                <DataSourcesTab chatbotId={id?.toString() ?? ''} onDataAdded={refreshData} />
              </TabsContent>

              <TabsContent value="data-management">
                <DataManagementTab chatbotId={id?.toString() ?? ''} dataSources={dataSources} onDataDeleted={refreshData} />
              </TabsContent>

              <TabsContent value="customize">
                <CustomizationTab chatbotId={id?.toString() ?? ''} prompt={chatbotData.System_Prompt} />
              </TabsContent>

              <TabsContent value="system">
                <SystemPromptTab chatbotId={id?.toString() ?? ''} System_Prompt={chatbotData.System_Prompt} />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsTab chatbotId={id?.toString() ?? ''} analyticsData={analyticsData} />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab chatbotId={id?.toString() ?? ''} chatbot={chatbotData} />
              </TabsContent>
            </div>
          </Tabs>
        </main>

        <div className="container py-4 flex justify-between items-center gap-4">
          <a 
            href="/contact-us"
            className="font-heading text-xl text-gray-400 hover:text-white transition-colors"
          >
            Need help? Contact us
          </a>
          <Button 
            onClick={handleTestChat}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 rounded-xl"
          >
            Test Assistant
          </Button>
        </div>
      </div>
    </div>
  );
}