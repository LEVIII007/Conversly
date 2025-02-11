// app/hero.tsx
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

// A simple static chatbot UI component
function ChatUI() {
  return (
    <div className="w-full max-w-md bg-neutral-800 rounded-xl overflow-hidden shadow-lg">
      {/* Chat header */}
      <div className="bg-neutral-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/conversly_logo.png" alt="Bot Logo" className="w-10 h-10" />
          <span className="text-white font-bold">Ask Conversly.ai</span>
        </div>
        <button className="text-neutral-400 hover:text-white">
          {/* A simple close icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Chat body */}
      <div
        className="p-4 space-y-4 bg-neutral-900"
        style={{ height: "300px", overflowY: "auto" }}
      >
        {/* Bot message */}
        <div className="flex items-start">
          <img src="/conversly_logo.png" alt="Bot Logo" className="w-8 h-8 mr-2" />
          <div className="bg-neutral-700 text-white rounded-lg p-3">
            <p className="text-sm">Hello, how can I help you today?</p>
          </div>
        </div>
        {/* User message (aligned to right) */}
        <div className="flex items-start justify-end">
          <div className="bg-indigo-600 text-white rounded-lg p-3">
            <p className="text-sm">I need assistance with my account.</p>
          </div>
        </div>
        {/* Bot reply */}
        <div className="flex items-start">
          <img src="/conversly_logo.png" alt="Bot Logo" className="w-8 h-8 mr-2" />
          <div className="bg-neutral-700 text-white rounded-lg p-3">
            <p className="text-sm">Sure, I can help you with that!</p>
          </div>
        </div>
      </div>

      {/* Chat input */}
      <div className="bg-neutral-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-neutral-700 text-white rounded-full px-4 py-2 focus:outline-none"
          />
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 flex items-center min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column – Marketing Content */}
        <div className="flex flex-col justify-center">
          <span className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium mb-6">
            ✨ AI-Powered Customer Interactions
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
            Custom Chatbots for
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Smarter Business
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-neutral-300 mb-10 max-w-3xl leading-relaxed">
            Elevate your customer experience with AI chatbots trained on your unique business knowledge.
            <br />
            <span className="text-neutral-400">
              Seamless integration. 24/7 support. Instant answers.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row justify-start gap-4 mb-16">
            <Button
              size="lg"
              className="bg-indigo-600 text-white hover:bg-indigo-500"
              onClick={() => redirect("/create")}
            >
              Get Started Free <span className="ml-2">→</span>
            </Button>
            <Button size="lg" variant="outline">
              Schedule a Demo
            </Button>
          </div>
        </div>

        {/* Right Column – Static Chatbot UI */}
        <div className="flex items-center justify-center">
          <ChatUI />
        </div>
      </div>

      {/* Optional decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}
