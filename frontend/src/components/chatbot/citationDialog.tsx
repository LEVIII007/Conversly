"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (citationText: string, dataSourceId: number) => void;
  datasourceId: number;
}

export function CitationDialog({
  isOpen,
  onClose,
  onSubmit,
  datasourceId,
}: CitationDialogProps) {
  const [citation, setCitation] = useState('');

  const handleSubmit = () => {
    // Only submit if there's text
    if (citation.trim()) {
      onSubmit(citation.trim(), datasourceId);
      setCitation('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Citation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Citation
            </label>
            <Input
              value={citation}
              onChange={(e) => setCitation(e.target.value)}
              placeholder="Enter a short citation"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            Enter the citation to reference this data source. 
            If empty, the data source name might be used by default (depending on your backend).
          </span>

          <Button onClick={handleSubmit} className="w-full mt-4">
            Save Citation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
