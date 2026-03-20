import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free AI Chat',
  description: 'Free unlimited AI chat powered by Puter.js — Claude, DeepSeek, Llama, GPT-OSS, Kimi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
