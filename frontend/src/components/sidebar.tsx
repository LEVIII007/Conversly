'use client';

import { Globe, Upload } from 'lucide-react';

const toneOptions = [
  "Professional",
  "Casual",
  "Friendly",
  "Technical",
  "Simple"
];

interface SidebarProps {
  isSidebarOpen: boolean;
  selectedTone: string;
  onAddWebsite: () => void;
  onAddDocument: () => void;
  onToneChange: (tone: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  selectedTone,
  onAddWebsite,
  onAddDocument,
  onToneChange,
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-gray-800 text-white transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Settings</h2>

        {/* Add Website */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Add Website</h3>
          <button onClick={onAddWebsite} className="btn-sidebar">
            <Globe size={16} />
            <span>Add URL</span>
          </button>
        </div>

        {/* Add Document */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Add Document</h3>
          <button onClick={onAddDocument} className="btn-sidebar">
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
                onClick={() => onToneChange(tone)}
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
  );
};
