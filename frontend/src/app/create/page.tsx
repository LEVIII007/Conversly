'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createChatBot } from '@/lib/process-data1';

export default function CreatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Basic Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await createChatBot({
        name,
        description,
        System_Prompt: systemPrompt,
      });

      toast({
        title: 'Success',
        description: 'Chatbot created successfully!',
      });

      router.push(`/chatbot/${response.chatbot.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create chatbot',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl px-4 py-8 md:px-8">
          <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-lg border p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Create New Chatbot</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter chatbot name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your chatbot's purpose"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">System Prompt</label>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Define how your chatbot should behave"
                    required
                    className="min-h-[150px]"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    This prompt defines your chatbot's personality and behavior. Be specific about its role, expertise, and how it should interact.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Chatbot'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

