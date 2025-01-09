'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Settings } from 'lucide-react';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Professional");

  const handleAddWebsite = () => {
    console.log("Add website functionality to be implemented");
  };

  const handleAddDocument = () => {
    console.log("Add document functionality to be implemented");
  };

  const handleToneChange = (tone: string) => {
    setSelectedTone(tone);
    console.log(`Tone changed to ${tone}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        selectedTone={selectedTone}
        onAddWebsite={handleAddWebsite}
        onAddDocument={handleAddDocument}
        onToneChange={handleToneChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
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
