"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { X, Edit, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

/**
 * Props:
 * - isOpen: controls whether the dialog is open
 * - onClose: callback to close the dialog
 * - title: string title for the dialog (optional)
 * - chunks: array of content chunks to display
 * - isLoading: boolean to show a "Loading..." state if you're fetching
 * - onSave: callback to save edited chunks
 * - isEditable: boolean to indicate if the content is editable
 */
interface ContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  chunks: string[];       // or an array of objects if each chunk has structure
  isLoading?: boolean;
  onSave?: (editedChunks: string[]) => void;
  isEditable?: boolean;
}

export function ContentDialog({ 
  isOpen, 
  onClose, 
  title = "Data Source Content", 
  chunks, 
  isLoading,
  onSave,
  isEditable = false
}: ContentDialogProps) {
  const [editedChunks, setEditedChunks] = useState<string[]>(chunks);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedChunks(chunks);
  }, [chunks]);

  const handleSave = () => {
    onSave?.(editedChunks);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            {isEditable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="ml-2"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel Editing
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Content
                  </>
                )}
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-4 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            <p className="mt-2">Loading content...</p>
          </div>
        ) : (
          <div className="space-y-4 p-2">
            {chunks.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center p-4">
                No content found for this data source.
              </div>
            ) : (
              editedChunks.map((chunk, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  {isEditing ? (
                    <Textarea
                      value={chunk}
                      onChange={(e) => {
                        const newChunks = [...editedChunks];
                        newChunks[index] = e.target.value;
                        setEditedChunks(newChunks);
                      }}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{chunk}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          {isEditing && (
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
