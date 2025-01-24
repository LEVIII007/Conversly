"use client"

import { Bot, Send } from "lucide-react"
import { useState } from "react"

interface ChatbotPreviewProps {
  color: string
  selectedIcon: React.ReactNode
  buttonAlignment: "left" | "right"
  showButtonText: boolean
  buttonText: string
  welcomeMessage: string
  displayStyle: "corner" | "overlay"
  customIcon: string | null
  starterQuestions: string[]
  HeaderText : string
}

export function ChatbotPreview({
  color,
  selectedIcon,
  buttonAlignment,
  showButtonText,
  buttonText,
  welcomeMessage,
  displayStyle,
  customIcon,
  starterQuestions,
  HeaderText,
}: ChatbotPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([])

  const handleStarterQuestionClick = (question: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
      { role: "bot", content: "This is a sample response to your question." },
    ])
  }

  const IconComponent = () =>
    customIcon ? <img src={customIcon || "/placeholder.svg"} alt="Custom icon" className="w-8 h-8" /> : selectedIcon

  const HeaderIconComponent = () =>
    customIcon ? <img src={customIcon || "/placeholder.svg"} alt="Custom icon" className="w-10 h-10" /> : selectedIcon

  return (
    <div className={`w-[450px] border rounded-lg bg-white dark:bg-gray-800 overflow-hidden h-[600px] ${displayStyle}`}>
      {/* Chat Window */}
      {isExpanded && (
        <div className="relative">
          {/* Header */}
          <div className="p-4 flex items-center justify-between" style={{ backgroundColor: color }}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <HeaderIconComponent />
              </div>
              <h3 className="font-medium text-white">{HeaderText}</h3>
            </div>
            <button onClick={() => setIsExpanded(false)} className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Area */}
          <div className="h-[460px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {/* Starter Questions */}
            {starterQuestions.filter((q) => q).length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium mb-2">Suggested Questions:</h4>
                <div className="space-y-2">
                  {starterQuestions
                    .filter((q) => q)
                    .map((question, index) => (
                      <button
                        key={index}
                        className="block w-full text-left text-sm p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleStarterQuestionClick(question)}
                      >
                        {question}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Bot Welcome Message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
                <IconComponent />
              </div>
              <div className="max-w-[80%]">
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-3 shadow-sm">
                  <p className="text-sm">{welcomeMessage}</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "bot" && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <IconComponent />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div
                    className={`rounded-2xl p-3 ${
                      message.role === "user"
                        ? "rounded-tr-none text-white"
                        : "rounded-tl-none bg-white dark:bg-gray-800 shadow-sm"
                    }`}
                    style={message.role === "user" ? { backgroundColor: color } : {}}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                style={{ "--tw-ring-color": color } as React.CSSProperties}
              />
              <button className="p-2 rounded-full" style={{ backgroundColor: color }}>
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsExpanded(true)}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105 ${
          !isExpanded ? "absolute bottom-0" : "hidden"
        } ${buttonAlignment === "right" ? "right-0" : "left-0"}`}
        style={{ backgroundColor: color }}
      >
        <IconComponent />
        {showButtonText && <span className="text-white font-medium">{buttonText}</span>}
      </button>
    </div>
  )
}

