import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Conversation, Message } from '@/types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isGenerating: boolean;
  selectedModel: string;

  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => string;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  renameConversation: (id: string, title: string) => void;
  setSelectedModel: (model: string) => void;
  setIsGenerating: (value: boolean) => void;
  getActiveConversation: () => Conversation | undefined;
  clearAll: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isGenerating: false,
      selectedModel: 'claude-sonnet-4-6',

      createConversation: () => {
        const id = nanoid();
        const conversation: Conversation = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        }));
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) => {
        const messageId = nanoid();
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const newMessage: Message = { ...message, id: messageId, createdAt: Date.now() };
            const title =
              c.messages.length === 0 && message.role === 'user'
                ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                : c.title;
            return { ...c, title, messages: [...c.messages, newMessage], updatedAt: Date.now() };
          }),
        }));
        return messageId;
      },

      updateMessage: (conversationId, messageId, content) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content, isStreaming: false } : m,
              ),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c,
          ),
        }));
      },

      setSelectedModel: (model) => set({ selectedModel: model }),
      setIsGenerating: (value) => set({ isGenerating: value }),

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId);
      },

      clearAll: () => set({ conversations: [], activeConversationId: null }),
    }),
    {
      name: 'free-ai-chat-history',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        selectedModel: state.selectedModel,
      }),
    },
  ),
);
