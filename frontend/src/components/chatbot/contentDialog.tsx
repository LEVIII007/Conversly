"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/**
 * Props:
 * - isOpen: controls whether the dialog is open
 * - onClose: callback to close the dialog
 * - title: string title for the dialog (optional)
 * - chunks: array of content chunks to display
 * - isLoading: boolean to show a "Loading..." state if you're fetching
 */
interface ContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  chunks: string[];       // or an array of objects if each chunk has structure
  isLoading?: boolean;
}

export function ContentDialog({ 
  isOpen, 
  onClose, 
  title = "Data Source Content", 
  chunks, 
  isLoading 
}: ContentDialogProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="p-4">Loading content...</div>
        ) : (
          <div className="space-y-4 p-2">
            {chunks.length === 0 ? (
              <div className="text-sm text-muted-foreground">No content found.</div>
            ) : (
              chunks.map((chunk, index) => (
                <div key={index} className="border p-2 rounded">
                  <p className="text-sm whitespace-pre-wrap">{chunk}</p>
                </div>
              ))
            )}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
