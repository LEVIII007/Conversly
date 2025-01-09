'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Upload, Globe, Settings, Plus } from 'lucide-react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';

const templateQuestions = [
  "What can you help me with?",
  "Tell me about your capabilities",
  "How do I get started?",
];

const toneOptions = [
  "Professional",
  "Casual",
  "Friendly",
  "Technical",
  "Simple"
];

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    maxToolRoundtrips: 5,
  });

  const [showTemplateQuestions, setShowTemplateQuestions] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Professional");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleTemplateQuestionClick = (question: string) => {
    handleSubmit(undefined, { input: question });
    setShowTemplateQuestions(false);
  };

  const handleAddWebsite = () => {
    // To be implemented
    console.log("Add website functionality to be implemented");
  };

  const handleAddDocument = () => {
    // To be implemented
    console.log("Add document functionality to be implemented");
  };

  const handleToneChange = (tone: string) => {
    setSelectedTone(tone);
    // To be implemented
    console.log(`Tone changed to ${tone}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gray-800 text-white transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          
          {/* Add Website */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Add Website</h3>
            <button
              onClick={handleAddWebsite}
              className="btn-sidebar"
            >
              <Globe size={16} />
              <span>Add URL</span>
            </button>
          </div>

          {/* Add Document */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Add Document</h3>
            <button
              onClick={handleAddDocument}
              className="btn-sidebar"
            >
              <Upload size={16} />
              <span>Upload File</span>
            </button>
          </div>

          {/* Tone Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Bot Tone</h3>
            <div className="space-y-2">
              {toneOptions.map((tone) => (
                <button
                  key={tone}
                  onClick={() => handleToneChange(tone)}
                  className={`btn-tone ${
                    selectedTone === tone ? 'btn-tone-selected' : 'btn-tone-unselected'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showTemplateQuestions && messages.length === 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {templateQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateQuestionClick(question)}
                  className="btn-secondary"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white dark:bg-gray-800">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 p-2 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 
                       transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          {isLoading && (
            <div className="text-center mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Processing...</p>
              <button
                onClick={() => stop()}
                className="btn-secondary mt-2"
              >
                Stop generating
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="btn-floating lg:hidden"
      >
        <Settings size={24} />
      </button>
    </div>
  );
}