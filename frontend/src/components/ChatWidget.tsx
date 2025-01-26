'use client';

import { useEffect, useState } from 'react';
import type { ChatbotConfig } from '@/types/global';
import { promptSchema } from '@/lib/zod';

export function ChatWidget() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeBot = () => {
      const botConfig: ChatbotConfig = {
        botId: "1",
        color: "#569CCE",
        title: "DocsBot Support",
        welcomeMessage: "👋 Hi! I'm your DocsBot assistant. How can I help you today?",
        buttonAlign: "left" as const,
        buttonText: "Chat with us",
        height: "500px",
        width: "350px",
        apiUrl: window.location.protocol + "//" + window.location.host
      };

      const script = document.createElement("script");
      script.src = "https://cloud-ide-shas.s3.us-east-1.amazonaws.com/docBot/chat.js";
      script.async = true;
      script.onload = () => {
        if (window.DocsBotAI) {
          window.DocsBotAI.init({
            ...botConfig,
            onSend: (prompt: string) => {
              // Validate the text prompt before sending
              try {
                promptSchema.safeParse(prompt);
                setError(null); // Clear any existing errors
                return true; // Allow sending the prompt
              } catch (err: any) {
                setError(err.errors[0].message); // Display the validation error
                return false; // Block sending the prompt
              }
            }
          });
        }
      };
      document.head.appendChild(script);
    };

    initializeBot();
  }, []);

  return (
    <div>
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
    </div>
  );
}
