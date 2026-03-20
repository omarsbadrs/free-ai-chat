export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  providerColor: string;
}

export const MODELS: ModelOption[] = [
  // Claude (Anthropic)
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', providerColor: '#D97706' },
  { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', providerColor: '#D97706' },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic', providerColor: '#D97706' },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', providerColor: '#D97706' },

  // DeepSeek
  { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'DeepSeek', providerColor: '#4F46E5' },
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', providerColor: '#4F46E5' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek', providerColor: '#4F46E5' },

  // Llama (Meta)
  { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta', providerColor: '#0668E1' },
  { id: 'meta-llama/llama-4-scout', name: 'Llama 4 Scout', provider: 'Meta', providerColor: '#0668E1' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'Meta', providerColor: '#0668E1' },

  // GPT-OSS (OpenAI)
  { id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B', provider: 'GPT-OSS', providerColor: '#10A37F' },
  { id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B', provider: 'GPT-OSS', providerColor: '#10A37F' },

  // Kimi (Moonshot)
  { id: 'moonshotai/kimi-k2.5', name: 'Kimi K2.5', provider: 'Moonshot', providerColor: '#06B6D4' },
  { id: 'moonshotai/kimi-k2', name: 'Kimi K2', provider: 'Moonshot', providerColor: '#06B6D4' },
];

export const PROVIDERS = [...new Set(MODELS.map((m) => m.provider))];

export function getModel(id: string): ModelOption {
  return MODELS.find((m) => m.id === id) || MODELS[0];
}

export function getModelsByProvider(): Record<string, ModelOption[]> {
  const grouped: Record<string, ModelOption[]> = {};
  for (const m of MODELS) {
    if (!grouped[m.provider]) grouped[m.provider] = [];
    grouped[m.provider].push(m);
  }
  return grouped;
}
