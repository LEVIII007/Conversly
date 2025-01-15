'use client';
import { useEffect } from 'react';
import type { ChatbotConfig } from '@/types/global';

export function ChatWidget() {
  useEffect(() => {
    const initializeBot = () => {
      const botConfig: ChatbotConfig = {
        botId: "1",
        color: "#569CCE",
        title: "DocsBot Support",
        welcomeMessage: "👋 Hi! I'm your DocsBot assistant. How can I help you today?",
        buttonAlign: "right" as const,
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
          window.DocsBotAI.init(botConfig);
        }
      };
      document.head.appendChild(script);
    };

    initializeBot();
  }, []);

  return null;
} 