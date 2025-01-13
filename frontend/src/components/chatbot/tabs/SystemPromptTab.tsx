'use client';

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateSystemPrompt } from "@/lib/queries";

const PROMPT_TIPS = [
  "Be specific about the chatbot's role and expertise",
  "Define the tone of voice (formal, casual, friendly, etc.)",
  "Specify any limitations or boundaries",
  "Include relevant domain knowledge or context",
  "Define how to handle uncertain or out-of-scope questions"
];

const PROMPT_EXAMPLE = `You are a knowledgeable assistant for [Company Name], specializing in [specific domain].
Your primary role is to help customers with [specific tasks/queries].
Maintain a [professional but friendly] tone.
When unsure, acknowledge limitations and direct users to [appropriate resources].
Focus on providing accurate information from the company's documentation and policies.`;

export function SystemPromptTab({ chatbotId, System_Prompt }: { chatbotId: string, System_Prompt: string }) {
  const [prompt, setPrompt] = useState(System_Prompt);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "System prompt cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateSystemPrompt(Number(chatbotId), prompt);
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
    <div className="space-y-8">
      <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
        <h3 className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-medium">
          <AlertCircle className="w-5 h-5" />
          Tips for Writing an Effective System Prompt
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-amber-700 dark:text-amber-300">
          {PROMPT_TIPS.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              {tip}
            </li>
          ))}
        </ul>
        <div className="mt-4 p-3 bg-white dark:bg-amber-950/50 rounded border border-amber-200 dark:border-amber-900">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Example:</p>
          <pre className="text-xs text-amber-700 dark:text-amber-300 whitespace-pre-wrap">
            {PROMPT_EXAMPLE}
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">System Prompt</h3>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your system prompt..."
          className="min-h-[200px]"
        />
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "Saving..." : "Save Prompt"}
        </Button>
      </div>
    </div>
  );
} 