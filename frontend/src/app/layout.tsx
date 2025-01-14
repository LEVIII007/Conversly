'use client';
import { useEffect } from 'react';
import './globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/components/auth-provider';
import type { ChatbotConfig } from '@/types/global';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const initializeBot = () => {
      const botConfig: ChatbotConfig = {
        botId: "5",
        color: "#569CCE",
        title: "DocsBot Support",
        welcomeMessage: "👋 Hi! I'm your DocsBot assistant. How can I help you today?",
        buttonAlign: "right" as const,
        buttonText: "Chat with us",
        height: "500px",
        width: "350px",
        apiUrl: "http://localhost:8000"
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Your existing head content */}
      </head>
      <body>
        <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main>{children}</main>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}