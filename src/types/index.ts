export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  provider?: string;
  createdAt: number;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
