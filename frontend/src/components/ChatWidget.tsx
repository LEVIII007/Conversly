'use client';

import { useEffect, useState } from 'react';
import type { ChatbotConfig } from '@/types/global';
import dotenv from 'dotenv';

dotenv.config();

export function ChatWidget() {
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const botConfig: ChatbotConfig = {
      botId: "1",
      color: "#569CCE",
      title: "DocsBot Support",
      apiUrl: process.env.NEXT_PUBLIC_API_SERVER_URL,
      welcomeMessage: "👋 Hi! I'm your DocsBot assistant. How can I help you today?",
      buttonAlign: "left" as const,
      buttonText: "Chat with us",
      height: "500px",
      width: "350px",
    };
    const script = document.createElement("script");
    script.src = "https://cloud-ide-shas.s3.us-east-1.amazonaws.com/docBot/chat1.js";
    script.async = true;
    script.onload = () => {
      if (window.DocsBotAI) {
      window.DocsBotAI.init(botConfig);
      }
    };

    const script2 = document.createElement("script");
    script2.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    script2.async = true;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";

    document.head.appendChild(script);
    document.head.appendChild(script2);
    document.head.appendChild(link);
  }, []);

  return null;
}
