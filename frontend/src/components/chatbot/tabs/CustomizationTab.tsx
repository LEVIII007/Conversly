'use client';

interface CustomizationTabProps {
  chatbotId: string;
}

export function CustomizationTab({ chatbotId }: CustomizationTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customize Your Chatbot</h2>
      {/* Add customization controls here */}
    </div>
  );
} 