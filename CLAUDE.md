# Free AI Chat

Free unlimited AI chatbot powered by Puter.js — 14 models across 5 providers, zero API keys, zero cost.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **State**: Zustand 5 (persisted to localStorage)
- **AI SDK**: Puter.js client-side SDK (`https://js.puter.com/v2/`)
- **Markdown**: react-markdown + remark-gfm
- **Icons**: Lucide React
- **IDs**: nanoid

## Commands

```bash
npm run dev        # Dev server with Turbopack on http://localhost:3000
npm run build      # Production build
npm start          # Serve production build
```

## No Environment Variables Required

All AI calls go through Puter.js client-side SDK. No API keys, no `.env` files, no server-side secrets.

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout, loads Puter.js script tag
    page.tsx                # Single-page app entry (hydration-safe)
    globals.css             # Tailwind + dark theme + markdown prose styles
  components/
    Chat.tsx                # Main chat container — streaming, sidebar, messages
    ChatInput.tsx           # Auto-expanding textarea with send/stop
    MessageBubble.tsx       # User/assistant message rendering with markdown
    ModelSelector.tsx       # Dropdown model picker grouped by provider
    Sidebar.tsx             # Conversation list with grouping, rename, delete
  hooks/                    # (reserved)
  lib/
    models.ts               # Model registry: IDs, names, providers, colors
  store/
    chat.ts                 # Zustand persisted store (conversations, model, generating)
  types/
    index.ts                # Message, Conversation interfaces
    puter.d.ts              # TypeScript declarations for Puter.js global SDK
```

## AI Models (14 models, 5 providers — all free & unlimited)

### Anthropic (Claude)
| Model ID | Display Name | Color |
|---|---|---|
| `claude-sonnet-4-6` | Claude Sonnet 4.6 | #D97706 |
| `claude-opus-4-6` | Claude Opus 4.6 | #D97706 |
| `claude-haiku-4-5` | Claude Haiku 4.5 | #D97706 |
| `claude-sonnet-4-5` | Claude Sonnet 4.5 | #D97706 |

### DeepSeek
| Model ID | Display Name | Color |
|---|---|---|
| `deepseek/deepseek-v3.2` | DeepSeek V3.2 | #4F46E5 |
| `deepseek/deepseek-r1` | DeepSeek R1 | #4F46E5 |
| `deepseek/deepseek-chat` | DeepSeek Chat | #4F46E5 |

### Meta (Llama)
| Model ID | Display Name | Color |
|---|---|---|
| `meta-llama/llama-4-maverick` | Llama 4 Maverick | #0668E1 |
| `meta-llama/llama-4-scout` | Llama 4 Scout | #0668E1 |
| `meta-llama/llama-3.3-70b-instruct` | Llama 3.3 70B | #0668E1 |

### GPT-OSS (OpenAI)
| Model ID | Display Name | Color |
|---|---|---|
| `openai/gpt-oss-120b` | GPT-OSS 120B | #10A37F |
| `openai/gpt-oss-20b` | GPT-OSS 20B | #10A37F |

### Moonshot (Kimi)
| Model ID | Display Name | Color |
|---|---|---|
| `moonshotai/kimi-k2.5` | Kimi K2.5 | #06B6D4 |
| `moonshotai/kimi-k2` | Kimi K2 | #06B6D4 |

## Features

### Multi-Model Streaming Chat
- Real-time streaming via `puter.ai.chat()` with async iteration
- Streaming cursor animation (blinking blue block)
- Stop/cancel button during generation
- Model badge on each response (color-coded by provider)
- Full conversation context sent with each request

### Conversation Management
- Auto-generated titles (via Claude Haiku, best-effort)
- Manual rename: double-click conversation title or pencil icon
- Delete individual conversations
- Clear all conversations
- Grouping: Today, This Week, Older
- Sorted by most recent first
- Persisted to localStorage

### Chat UI
- User messages: right-aligned blue bubbles
- Assistant messages: left-aligned with AI avatar, markdown rendering
- Copy button on hover (with checkmark feedback)
- Auto-scroll to latest message
- Empty state with centered icon and description
- Custom thin scrollbar styling

### Chat Input
- Auto-expanding textarea (max 160px)
- Enter to send, Shift+Enter for newline
- Send button (blue) / Stop button (red) toggle
- Disabled state while Puter SDK loads

### Collapsible Sidebar
- 256px wide, toggle via menu button
- New Chat button
- Conversation list with hover actions (rename, delete)
- Inline rename with Enter/Escape keyboard support
- Clear all chats footer button

### Model Selector
- Top-right dropdown with current model name + provider color dot
- Models grouped by provider with section headers
- Checkmark on selected model
- Footer: "All models free & unlimited via Puter.js"
- Click outside to close

### Dark Theme
- Zinc-950 (#09090b) background
- Zinc color palette throughout
- Custom `.prose-chat` markdown styling (headings, code, tables, blockquotes, links)
- Semi-transparent borders and scrollbars

## Architecture

### Client-Side Only
All AI calls happen in the browser via Puter.js SDK. No API routes, no server-side processing. The app is effectively a static Next.js site with client-side state.

### Data Flow
1. User sends message → `ChatInput.onSend()`
2. Store adds user message + empty assistant placeholder → `useChatStore.addMessage()`
3. Puter.js streams response → `window.puter.ai.chat(messages, { model, stream: true })`
4. Async iteration updates assistant message in real-time → `useChatStore.updateMessage()`
5. Auto-title generated on first exchange → `generateTitle()` (best-effort)
6. Zustand persists to localStorage automatically

### Puter SDK Integration
- Loaded via `<Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />`
- Readiness checked by polling `window.puter?.ai` every 200ms
- TypeScript declarations in `src/types/puter.d.ts`
- "User-Pays" model — users cover costs through their Puter account

### State Management
- Single Zustand store with `persist` middleware
- localStorage key: `free-ai-chat-history`
- Persisted fields: `conversations`, `activeConversationId`, `selectedModel`
- Default model: `claude-sonnet-4-6`

## Key Patterns

- Hydration safety: `mounted` state check in `page.tsx` prevents SSR/localStorage mismatches
- Streaming: async `for await` iteration over Puter.js response with `isGenerating` flag for stop control
- Error handling: try/catch with error displayed as assistant message content
- Title generation: best-effort via Claude Haiku, silently fails if unavailable
- React Markdown with GFM plugin for tables, strikethrough, and code blocks

## Important Notes

- No authentication required
- No backend database — all state in browser localStorage
- No rate limiting UI — Puter.js handles limits transparently
- No test framework configured
- Node.js 18+ required
- Developed by Omar Badr
