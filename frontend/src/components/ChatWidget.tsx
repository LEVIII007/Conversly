'use client';

import { useEffect, useState } from 'react';
import type { ChatbotConfig } from '@/types/global';
import dotenv from 'dotenv';

dotenv.config();

export function ChatWidget() {
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const botConfig: ChatbotConfig = {
      botId: "10",
      color: "#569CCE",
      title: "Conversly Support",
      apiUrl: process.env.NEXT_PUBLIC_API_SERVER_URL,
      welcomeMessage: "👋 Hi! I'm your Conversly assistant. How can I help you today?",
      buttonAlign: "left" as const,
      buttonText: "Chat with us",
      height: "500px",
      width: "350px",
      prompt: `You are the official chatbot for Conversly.ai, an AI-powered chatbot provider SaaS. Your job is to assist users by answering questions about the platform, its features, pricing, integrations, and use cases.

Guidelines:
- Provide accurate and concise responses based on Conversly.ai’s offerings.
- If a feature or service is not available, politely clarify and suggest alternatives.
- If the user asks about pricing, direct them to the official pricing page or summarize the available plans.
- If a user encounters an issue, guide them on how to contact support or troubleshoot common problems.
- Keep your tone helpful, professional, and friendly.
- If you don’t know the answer, encourage users to visit Conversly.ai for more details.`,
      starter_questions : ["What platforms does Conversly.ai integrate with?", "How do I embed a chatbot on my website?", "How does Conversly.ai work?"]
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
