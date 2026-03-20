'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useChatStore } from '@/store/chat';
import { getModel } from '@/lib/models';
import Sidebar from './Sidebar';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import { Menu, Zap } from 'lucide-react';

export default function Chat() {
  const {
    activeConversationId,
    createConversation,
    addMessage,
    updateMessage,
    isGenerating,
    setIsGenerating,
    getActiveConversation,
    selectedModel,
    renameConversation,
  } = useChatStore();

  const conversation = getActiveConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [puterReady, setPuterReady] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  // Check Puter SDK readiness
  useEffect(() => {
    const check = () => {
      if (typeof window !== 'undefined' && window.puter?.ai) {
        setPuterReady(true);
        return;
      }
      setTimeout(check, 200);
    };
    check();
  }, []);

  const generateTitle = useCallback(async (convId: string, userMessage: string) => {
    if (!puterReady) return;
    try {
      const resp = await window.puter.ai.chat(
        `Generate a short title (max 5 words, no quotes, no punctuation) for a chat starting with: "${userMessage.slice(0, 200)}"`,
        { model: 'claude-haiku-4-5' },
      );
      const raw = resp as { message: { content: string | Array<{ text: string }> } };
      const title = (typeof raw.message.content === 'string'
        ? raw.message.content
        : raw.message.content[0]?.text || ''
      ).replace(/^["']+|["']+$/g, '').trim();
      if (title.length > 1 && title.length < 60) {
        renameConversation(convId, title);
      }
    } catch { /* best-effort */ }
  }, [puterReady, renameConversation]);

  const sendMessage = useCallback(async (content: string) => {
    if (!puterReady) return;

    let convId = activeConversationId;
    if (!convId) convId = createConversation();

    const model = getModel(selectedModel);
    addMessage(convId, { role: 'user', content });
    const assistantMsgId = addMessage(convId, {
      role: 'assistant',
      content: '',
      model: model.name,
      provider: model.provider,
      isStreaming: true,
    });

    setIsGenerating(true);

    try {
      const conv = useChatStore.getState().conversations.find((c) => c.id === convId);
      const messages = conv?.messages
        .filter((m) => m.id !== assistantMsgId)
        .map((m) => ({ role: m.role, content: m.content })) || [];

      const response = await window.puter.ai.chat(messages, {
        model: selectedModel,
        stream: true,
      });

      let fullText = '';
      const iterable = response as AsyncIterable<{ text?: string; message?: { content: string | Array<{ text: string }> } }>;

      for await (const chunk of iterable) {
        if (!useChatStore.getState().isGenerating) break;

        let text = '';
        if (chunk.text) {
          text = chunk.text;
        } else if (chunk.message?.content) {
          const c = chunk.message.content;
          text = typeof c === 'string' ? c : c[0]?.text || '';
        }

        if (text) {
          fullText += text;
          updateMessage(convId!, assistantMsgId, fullText);
        }
      }

      updateMessage(convId!, assistantMsgId, fullText);

      // Auto-generate title for new conversations
      const updated = useChatStore.getState().conversations.find((c) => c.id === convId);
      if (updated && updated.messages.length <= 2) {
        generateTitle(convId!, content);
      }
    } catch (err) {
      updateMessage(convId!, assistantMsgId, `Error: ${String(err)}`);
    } finally {
      setIsGenerating(false);
    }
  }, [activeConversationId, createConversation, addMessage, updateMessage, setIsGenerating, selectedModel, puterReady, generateTitle]);

  const handleStop = () => {
    setIsGenerating(false);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-13 flex items-center px-4 border-b border-zinc-800/60 shrink-0 gap-3">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors"
            >
              <Menu size={18} />
            </button>
          )}
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Zap size={14} className="text-blue-400" />
            Free AI Chat
          </div>
          <div className="ml-auto">
            <ModelSelector />
          </div>
          {!puterReady && (
            <div className="text-xs text-yellow-500 animate-pulse">Loading AI...</div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {!conversation || conversation.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
                <Zap size={24} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-200 mb-2">Free AI Chat</h2>
              <p className="text-sm text-zinc-500 max-w-md">
                Chat with Claude, DeepSeek, Llama, GPT-OSS, and Kimi — all free and unlimited. No API keys needed.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {conversation.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSend={sendMessage}
              onStop={handleStop}
              isGenerating={isGenerating}
              disabled={!puterReady}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
