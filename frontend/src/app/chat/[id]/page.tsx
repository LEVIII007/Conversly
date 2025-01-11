'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
// import ReactMarkdown from "react-markdown";

// const templateQuestions = [
//   "What can you help me with?",
//   "Tell me about your capabilities",
//   "How do I get started?",
// ];

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    maxToolRoundtrips: 1,
    body: {
      tone: "Professional",
      prompt: "Please provide me with the information I need.",
      chatbotID: "4",
    },
  });

  const [showTemplateQuestions, setShowTemplateQuestions] = useState(true);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    setTimeout(() => {
      setShowTemplateQuestions(true);
    }, 10000);
  };

  // const handleTemplateQuestionClick = (question: string) => {
  //   handleSubmit(undefined, { input: question });
  //   setShowTemplateQuestions(false);
  // };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-6xl mx-auto pt-4 px-4">
      <div className="w-full flex justify-center flex-col items-center mb-4">
        <Image
          src="/bot.jpeg"
          width={200}
          height={200}
          className="rounded-full p-4 shadow-xl shadow-white animate-flicker"
          alt="AI Assistant"
        />
      </div>
      
      <div className="flex-grow w-full overflow-y-auto hide-scrollbar mb-4">
        {/* {showTemplateQuestions && messages.length === 0 && (
          // <div className="flex flex-wrap justify-center gap-2 mb-4">
          //   {templateQuestions.map((question, index) => (
          //     <Button
          //       key={index}
          //       onClick={() => handleTemplateQuestionClick(question)}
          //       className="bg-slate-700 text-white"
          //     >
          //       {question}
          //     </Button>
          //   ))}
          // </div>
        )} */}
        
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-3/4 p-4 rounded-xl text-lg ${
                  message.role === "user"
                    ? "bg-slate-700 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <MemoizedMarkdown id={message.id} content={message.content} />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {isLoading && (
          <div className="text-center mt-4">
            <p className="font-bold text-lg">Processing your request...</p>
            <Button
              onClick={() => stop()}
              className="bg-white text-black mt-2"
            >
              Stop
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleFormSubmit} className="w-full max-w-3xl mb-8">
        <div className="flex items-center gap-2 border border-white rounded-md px-3 py-2">
          <Input
            value={input}
            onChange={handleInputChange}
            className="flex-grow border-none focus:outline-none focus:ring-0 text-xl"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <SendHorizontal size={24} />
          </Button>
        </div>
      </form>
    </div>
  );
}

