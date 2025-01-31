// app/profile/page.tsx (Server Component)
import { Bot, UserIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getChatBots } from "@/lib/queries";
import { auth } from "../../../auth";
import UpperHeader from "@/components/upperHeader";
import ChatbotList from "@/components/ChatbotList";

export default async function ProfilePage() {
  const session = await auth();
  let chatbots = await getChatBots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-16">
      <UpperHeader />
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-card/80 to-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border/50">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                {session?.user?.name || "Welcome!"}
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your AI assistants
              </p>
            </div>
          </div>
        </div>

        {/* Create New Button */}
        <Link
          href="/create"
          className="group block bg-gradient-to-br from-primary/10 via-card to-card hover:from-primary/20 rounded-xl p-6 shadow-lg border border-border/50 transition-all duration-200 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Create New Chatbot</h2>
                <p className="text-muted-foreground text-sm">
                  Build a new AI assistant
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Chatbots List (Client Component) */}
        <ChatbotList chatbots={chatbots} />
      </div>
    </div>
  );
}
