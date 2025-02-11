'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateSystemPrompt } from '@/lib/queries';
import { 
  BrainCircuit, 
  HelpCircle, 
  Sparkles, 
  Save,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface SystemPromptTabProps {
  chatbotId: string;
  System_Prompt: string;
}

function SectionHeader({ 
  title, 
  description,
  icon: Icon 
}: { 
  title: string; 
  description?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10">
        <Icon className="w-5 h-5 text-pink-500" />
      </div>
      <div>
        <h2 className="font-heading text-xl font-semibold text-white">
          {title}
        </h2>
        {description && (
          <p className="font-sans text-base text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

const promptTemplates = [
  {
    title: "Professional Assistant",
    prompt: "You are a professional and knowledgeable assistant. Provide clear, accurate, and helpful responses while maintaining a formal tone.",
  },
  {
    title: "Friendly Guide",
    prompt: "You are a friendly and approachable guide. Explain concepts in simple terms and use a conversational tone to make users feel comfortable.",
  },
  {
    title: "Technical Expert",
    prompt: "You are a technical expert. Provide detailed, technical explanations while being precise and thorough in your responses.",
  },
];

export function SystemPromptTab({ chatbotId, System_Prompt }: SystemPromptTabProps) {
  const [prompt, setPrompt] = useState(System_Prompt);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateSystemPrompt(parseInt(chatbotId), prompt);
      toast({
        title: "Success",
        description: "System prompt updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system prompt",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Main Prompt Section */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
          <SectionHeader 
            title="System Prompt" 
            description="Define your AI assistant's personality and behavior"
            icon={BrainCircuit}
          />
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="font-sans text-base text-gray-300">Prompt Script</label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-sans text-sm max-w-xs">
                          This prompt shapes your AI's personality and expertise. Be specific about its role, tone, and limitations.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(System_Prompt)}
                    className="border-gray-800 text-white hover:bg-gray-800/50"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px] bg-gray-800/50 border-gray-700/50 text-white font-sans text-base"
                  placeholder="Define how your AI assistant should behave..."
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Templates Section */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
          <SectionHeader 
            title="Quick Templates" 
            description="Start with a pre-made prompt template"
            icon={Sparkles}
          />
          
          <div className="grid md:grid-cols-3 gap-4">
            {promptTemplates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-500/10 rounded-xl" />
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-pink-500/20 transition-all duration-300">
                  <h3 className="font-heading text-lg text-white mb-2">{template.title}</h3>
                  <p className="font-sans text-sm text-gray-400 mb-4">{template.prompt}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(template.prompt)}
                    className="w-full border-gray-700 text-white hover:bg-gray-700/50"
                  >
                    Use Template
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
          <SectionHeader 
            title="Writing Tips" 
            description="Best practices for effective prompts"
            icon={AlertCircle}
          />
          
          <div className="space-y-3 font-sans text-base text-gray-300">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Be specific about the assistant's role and expertise
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Define the tone and style of communication
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Set clear boundaries and limitations
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Include specific instructions for handling different types of queries
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 