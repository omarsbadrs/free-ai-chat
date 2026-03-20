'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export default function ChatInput({ onSend, onStop, isGenerating, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isGenerating || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative bg-zinc-900 border border-zinc-700/50 rounded-2xl overflow-hidden focus-within:border-zinc-600 transition-colors">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message..."
        disabled={disabled}
        rows={1}
        className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-500 px-4 pt-3 pb-2 pr-14 resize-none outline-none disabled:opacity-50"
      />
      <div className="absolute right-2 bottom-2">
        {isGenerating ? (
          <button
            onClick={onStop}
            className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <Square size={14} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
