export interface Chatbot {
  id: string;
  name: string;
  description: string;
  type: 'website' | 'document';
  source: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'training' | 'ready' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: 'free' | 'pro' | 'enterprise';
}