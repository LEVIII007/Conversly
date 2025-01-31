// app/chatbot/[id]/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { validateChatbotOwnership } from "@/lib/queries";
import ChatInterface from "@/components/ChatInterface";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const isOwner = await validateChatbotOwnership(Number(id));
  if (!isOwner.authorized || !isOwner.data) {
    return redirect("/chat");
  }

  return <ChatInterface data={isOwner.data} />;
}