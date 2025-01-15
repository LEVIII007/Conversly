'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface QADialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string, answer: string) => void;
}

export function QADialog({ isOpen, onClose, onSubmit }: QADialogProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (question.trim() && answer.trim()) {
      onSubmit(question, answer);
      setQuestion('');
      setAnswer('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question & Answer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Question
            </label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter a common question"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Answer
            </label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer"
              rows={4}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Add Q&A Pair
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 