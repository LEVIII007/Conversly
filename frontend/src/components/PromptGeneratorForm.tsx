import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PromptGeneratorFormProps {
  onGenerate: (promptIdea: string) => Promise<void>;
}

export function PromptGeneratorForm({ onGenerate }: PromptGeneratorFormProps) {
  const [promptIdea, setPromptIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await onGenerate(promptIdea);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={promptIdea}
        onChange={(e) => setPromptIdea(e.target.value)}
        placeholder="Describe the chatbot's purpose and personality"
        className="min-h-[100px]"
        required
      />
      <Button type="submit" disabled={isGenerating} className="w-full">
        {isGenerating ? 'Generating...' : 'Generate Prompt'}
      </Button>
    </form>
  );
}
