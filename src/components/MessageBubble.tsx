'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, User } from 'lucide-react';
import type { Message } from '@/types';

export default function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 group">
      <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-zinc-400">
        AI
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm text-zinc-200 leading-relaxed prose-chat ${message.isStreaming ? 'streaming-cursor' : ''}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content || ' '}</ReactMarkdown>
        </div>

        {!message.isStreaming && message.content && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {message.model && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border border-zinc-700/50"
                style={{ color: getProviderColor(message.provider) }}
              >
                {message.model}
              </span>
            )}
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getProviderColor(provider?: string): string {
  switch (provider) {
    case 'Anthropic': return '#D97706';
    case 'DeepSeek': return '#818CF8';
    case 'Meta': return '#60A5FA';
    case 'GPT-OSS': return '#34D399';
    case 'Moonshot': return '#22D3EE';
    default: return '#71717A';
  }
}
