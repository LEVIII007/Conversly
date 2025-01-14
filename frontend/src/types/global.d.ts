export interface ChatbotConfig {
  botId: string;
  color?: string;
  title?: string;
  welcomeMessage?: string;
  buttonAlign?: 'left' | 'right';
  buttonText?: string | null;
  height?: string;
  width?: string;
  darkMode?: boolean;
  fontSize?: string;
  apiUrl?: string;
}

declare global {
  interface Window {
    DocsBotAI: {
      init: (config: ChatbotConfig) => void;
    };
  }
}

export {}; 