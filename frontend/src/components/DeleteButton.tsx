// app/profile/DeleteButton.tsx (Client Component)
"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteChatBot } from "@/lib/queries";
import { useToast } from "@/hooks/use-toast";

export default function DeleteButton({ chatbotId }: { chatbotId: number }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteBot = async () => {
    setLoading(true);
    try {
      const result = await  DeleteChatBot({ id: chatbotId });
      if(!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Chatbot deleted successfully",
      });
      window.location.reload(); // Refresh page after deletion
    } catch (error) {
      console.error("Failed to delete chatbot", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDeleteBot}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 w-full transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
