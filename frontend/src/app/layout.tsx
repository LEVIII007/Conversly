import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/components/auth-provider';

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