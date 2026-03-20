interface PuterAIChatMessage {
  role: string;
  content: string;
}

interface PuterAIChatResponse {
  message: {
    content: string | Array<{ text: string }>;
  };
}

interface PuterAIStreamChunk {
  text?: string;
  message?: {
    content: string | Array<{ text: string }>;
  };
}

interface PuterAI {
  chat(
    prompt: string | PuterAIChatMessage[],
    options?: { model?: string; stream?: boolean }
  ): Promise<PuterAIChatResponse | AsyncIterable<PuterAIStreamChunk>>;
}

interface Puter {
  ai: PuterAI;
}

declare global {
  interface Window {
    puter: Puter;
  }
  var puter: Puter;
}

export {};
