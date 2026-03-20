'use client';

import { useState, useEffect } from 'react';
import Chat from '@/components/Chat';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-zinc-500 text-sm">Loading...</div>
      </div>
    );
  }

  return <Chat />;
}
