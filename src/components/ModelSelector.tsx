'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useChatStore } from '@/store/chat';
import { getModel, getModelsByProvider } from '@/lib/models';

export default function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const model = getModel(selectedModel);
  const grouped = getModelsByProvider();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-colors text-sm"
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: model.providerColor }}
        />
        <span className="text-zinc-300">{model.name}</span>
        <ChevronDown size={12} className="text-zinc-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto py-1">
            {Object.entries(grouped).map(([provider, models]) => (
              <div key={provider}>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {provider}
                </div>
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                      selectedModel === m.id
                        ? 'bg-blue-600/10 text-blue-400'
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: m.providerColor }}
                    />
                    <span className="flex-1 text-left">{m.name}</span>
                    {selectedModel === m.id && <Check size={12} />}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-800 px-3 py-2 text-[10px] text-zinc-600 text-center">
            All models free & unlimited via Puter.js
          </div>
        </div>
      )}
    </div>
  );
}
