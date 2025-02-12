"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For programmatic navigation
import {
  MessageCircle,
  Calendar,
  MoreVertical,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import DeleteButton from "./DeleteButton";

interface ChatBot {
  id: number;
  name: string;
  description: string;
  createdAt: Date | null;
}

interface ChatbotListProps {
  chatbots: ChatBot[];
}

export default function ChatbotList({ chatbots }: ChatbotListProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const router = useRouter();

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleCardClick = (id: number) => {
    // Navigate to /chatbot/[id]
    router.push(`/chatbot/${id}`);
  };

  const handleMoreButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    // Prevent card onClick
    e.stopPropagation();
    toggleDropdown(id);
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Also prevent card onClick
    e.stopPropagation();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 font-sans">
      {chatbots.map((bot) => (
        <div
          key={bot.id}
          onClick={() => handleCardClick(bot.id)}
          className="
            group bg-card/50 hover:bg-card/80 
            backdrop-blur-sm rounded-xl p-6 shadow-lg 
            border border-border/50 transition-all duration-200
            cursor-pointer
          "
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                {/* Chatbot Name */}
                <h3 className="font-display font-semibold text-lg">
                  {bot.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {bot.description}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {bot.createdAt
                      ? new Date(bot.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* More Button + Dropdown */}
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()} 
              // Alternatively: onClick={handleDropdownClick}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleMoreButtonClick(e, bot.id)}
                className="hover:bg-primary/10"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>

              {/* Dropdown */}
              {openDropdown === bot.id && (
                <div
                  className="
                    absolute right-0 mt-2 w-48 bg-card rounded-lg 
                    shadow-xl border border-border/50 py-1 z-10
                  "
                  onClick={handleDropdownClick}
                >
                  <Link
                    href={`/chatbot/${bot.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Configure
                  </Link>
                  <DeleteButton chatbotId={bot.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
