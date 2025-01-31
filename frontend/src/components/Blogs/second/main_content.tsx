import React from "react";
import { Highlight, themes } from 'prism-react-renderer';

const renderCode = (code: string, language: string) => (
  <Highlight
    theme={themes.nightOwl}
    code={code.trim()}
    language={language}
  >
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre 
        className="p-3 rounded-lg text-xs overflow-x-auto whitespace-pre" 
        style={{ 
          ...style,
          maxWidth: '100%' // Ensure pre doesn't exceed container
        }}
      >
        {tokens.map((line, i) => (
          <div 
            key={i} 
            {...getLineProps({ line })}
            className="whitespace-pre" // Prevent line wrapping
          >
            <span className="select-none opacity-50 mr-4">{i + 1}</span>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);


export function BlogContent() {
  return (
    <section id="mainContent" className="bg-white py-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
        <h2 className="text-3xl font-bold mb-8">How to Create and Deploy a Chatbot on Your Website in Minutes!</h2>
        
        <p className="mb-6">
          Building a chatbot for your website has never been easier! With Conversly.ai, you can create and deploy a fully functional chatbot in just a few minutes. Follow this simple guide to get started:
        </p>

        <h2 className="text-3xl font-bold mb-8 mt-12">Step 1: Log in to Conversly.ai</h2>
        <p className="mb-6">
          Head over to <a href="https://conversly.shashankkk.site" className="text-blue-600 hover:underline">conversly.shashankkk.site</a> and log in to your account. If you don’t have an account yet, sign up for free to get started.
        </p>

        <h2 className="text-3xl font-bold mb-8 mt-12">Step 2: Create Your First Chatbot</h2>
        <p className="mb-6">
          Click on <strong>Get Started</strong> and create your first free chatbot. Make sure to provide a detailed prompt to guide your chatbot’s responses effectively.
        </p>

        <h2 className="text-3xl font-bold mb-8 mt-12">Step 3: Explore the Chatbot Dashboard</h2>
        <p className="mb-6">
          Once your chatbot is created, you'll be redirected to the chatbot dashboard, where you can customize it further. Here’s what you can do:
        </p>
        
        <ul className="space-y-4 mb-8">
          <li><strong>Add a Knowledge Base:</strong> Provide relevant data and FAQs for accurate responses.</li>
          <li><strong>Customize the Widget:</strong> Adjust the chatbot’s appearance to match your website’s design.</li>
          <li><strong>Check Analytics:</strong> Monitor user interactions and optimize responses.</li>
          <li><strong>Edit the Prompt:</strong> Fine-tune your chatbot’s behavior and tone.</li>
          <li><strong>Test the Chatbot:</strong> Ensure it functions correctly before deployment.</li>
        </ul>

        <h2 className="text-3xl font-bold mb-8 mt-12">Step 4: Deploy the Chatbot on Your Website</h2>
        <p className="mb-6">
          In the <strong>Customize</strong> section, you will find a script that allows you to add the chatbot to your website effortlessly.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4">Two Ways to Integrate:</h3>
        <ul className="space-y-4 mb-8">
          <li>
            <strong>For All Pages:</strong> Copy the script and paste it into the <strong>Root Layout</strong> of your website. This ensures the chatbot appears on every page.
          </li>
          <li>
            <strong>For a Specific Page:</strong> Paste the script only on the pages where you want the chatbot to be active.
          </li>
        </ul>

        <h2 className="text-3xl font-bold mb-8 mt-12">Example Implementation (React)</h2>
        <p className="mb-6">
          Here’s how you can implement the chatbot on a React-based website:
        </p>
        <div className="relative border rounded-lg max-w-[1000px]"> {/* Fixed width container */}
            <div className="overflow-x-auto"> {/* Scrollable wrapper */}
        {renderCode(
          `'use client';

import { useEffect, useState } from 'react';
import type { ChatbotConfig } from '@/types/global';
import dotenv from 'dotenv';

dotenv.config();

export function ChatWidget() {
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const botConfig: ChatbotConfig = {
      botId: "1",
      color: "#569CCE",
      title: "DocsBot Support",
      apiUrl: process.env.API_SERVER_URL_GET_IT_FOR_FREE_FROM_SITE!,
      welcomeMessage: "👋 Hi! I'm your DocsBot assistant. How can I help you today?",
      buttonAlign: "left" as const,
      buttonText: "Chat with us",
      height: "500px",
      width: "350px",
      prompt: "",
      starter_questions: []
    };

    const script = document.createElement("script");
    script.src = "";
    script.async = true;
    script.onload = () => {
      if (window.DocsBotAI) {
        window.DocsBotAI.init(botConfig);
      }
    };

    const script2 = document.createElement("script");
    script2.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    script2.async = true;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";

    document.head.appendChild(script);
    document.head.appendChild(script2);
    document.head.appendChild(link);
  }, []);

  return null;
}`
          , 'javascript')}
          </div>
          </div>
        
        <h2 className="text-3xl font-bold mb-8 mt-12">Congratulations! 🎉</h2>
        <p className="mb-6">
          That’s it! Your website now has a fully functional chatbot powered by Conversly.ai. Engage with visitors, answer queries instantly, and enhance the user experience effortlessly.
        </p>
        
        <div className="bg-neutral-900 text-white p-8 rounded-lg text-center">
          <p className="text-xl font-semibold mb-4">Ready to create your chatbot?</p>
          <a
            href="https://conversly.shashankkk.site"
            className="inline-block bg-white text-neutral-900 px-8 py-3 rounded-full font-semibold hover:bg-neutral-100 transition-colors"
          >
            Start with Conversly.ai today
          </a>
        </div>
      </article>
    </section>
  );
}
