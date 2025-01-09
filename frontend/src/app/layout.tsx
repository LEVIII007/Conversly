import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'ChatbotAI - Create Custom AI Chatbots',
  description: 'Build AI chatbots trained on your website content or documents',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main>{children}</main>
        </div>
        </SessionProvider>
      </body>
    </html>
  );
}