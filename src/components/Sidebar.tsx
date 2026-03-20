'use client';

import { useState } from 'react';
import { Plus, Trash2, MessageSquare, X, Pencil } from 'lucide-react';
import { useChatStore } from '@/store/chat';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const {
    conversations,
    activeConversationId,
    createConversation,
    deleteConversation,
    setActiveConversation,
    renameConversation,
    clearAll,
  } = useChatStore();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleNew = () => {
    createConversation();
  };

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  // Group by date
  const now = Date.now();
  const dayMs = 86400000;
  const today = sorted.filter((c) => now - c.updatedAt < dayMs);
  const week = sorted.filter((c) => now - c.updatedAt >= dayMs && now - c.updatedAt < 7 * dayMs);
  const older = sorted.filter((c) => now - c.updatedAt >= 7 * dayMs);

  const groups = [
    { label: 'Today', items: today },
    { label: 'This Week', items: week },
    { label: 'Older', items: older },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="w-64 h-full bg-zinc-900 border-r border-zinc-800/60 flex flex-col shrink-0">
      {/* Header */}
      <div className="h-13 flex items-center px-3 border-b border-zinc-800/60 gap-2 shrink-0">
        <button
          onClick={handleNew}
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors"
        >
          <Plus size={14} />
          New Chat
        </button>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {groups.map(({ label, items }) => (
          <div key={label} className="mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 px-2 mb-1">
              {label}
            </div>
            {items.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-sm ${
                  conv.id === activeConversationId
                    ? 'bg-zinc-800 text-zinc-200'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
                onClick={() => setActiveConversation(conv.id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setRenamingId(conv.id);
                  setRenameValue(conv.title);
                }}
              >
                <MessageSquare size={12} className="shrink-0 opacity-40" />
                {renamingId === conv.id ? (
                  <input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => {
                      if (renameValue.trim()) renameConversation(conv.id, renameValue.trim());
                      setRenamingId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (renameValue.trim()) renameConversation(conv.id, renameValue.trim());
                        setRenamingId(null);
                      }
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    className="flex-1 bg-zinc-700 border border-blue-500/50 rounded px-1.5 py-0.5 text-xs outline-none text-zinc-200 min-w-0"
                  />
                ) : (
                  <span className="flex-1 truncate text-xs">{conv.title}</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingId(conv.id);
                    setRenameValue(conv.title);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-all"
                >
                  <Pencil size={10} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-zinc-700 text-zinc-500 hover:text-red-400 transition-all"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="text-center text-zinc-600 text-xs mt-8">No conversations yet</div>
        )}
      </div>

      {/* Footer */}
      {conversations.length > 0 && (
        <div className="border-t border-zinc-800/60 p-2">
          <button
            onClick={clearAll}
            className="w-full text-xs text-zinc-600 hover:text-red-400 py-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors"
          >
            Clear all chats
          </button>
        </div>
      )}
    </div>
  );
}
