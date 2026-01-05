# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. It uses Claude AI (via Anthropic API) to generate React components through a chat interface, displaying them in real-time using a virtual file system (no files written to disk).

## Development Commands

### Setup
```bash
npm run setup              # Install deps + generate Prisma client + run migrations
```

### Development
```bash
npm run dev                # Start Next.js dev server with Turbopack
npm run dev:daemon         # Start dev server in background (logs to logs.txt)
```

### Build & Test
```bash
npm run build              # Production build
npm run test               # Run Vitest tests
npm run lint               # Run ESLint
```

### Database
```bash
npx prisma generate        # Regenerate Prisma client after schema changes
npx prisma migrate dev     # Create and apply new migration
npm run db:reset           # Reset database (Warning: destructive)
npx prisma studio          # Open Prisma Studio GUI
```

## Architecture Overview

### AI Component Generation Flow

1. **Chat Interface** (`src/components/chat/ChatInterface.tsx`)
   - User describes desired component in chat
   - Messages sent to `/api/chat` endpoint with current virtual file system state

2. **API Route** (`src/app/api/chat/route.ts`)
   - Receives messages and serialized virtual file system
   - Uses Vercel AI SDK's `streamText()` with two tools:
     - `str_replace_editor`: Create/edit files (view, create, str_replace, insert)
     - `file_manager`: Rename/delete files
   - Streams responses back to client
   - Saves conversation + file system state to database for authenticated users

3. **Virtual File System** (`src/lib/file-system.ts`)
   - In-memory file tree (no disk writes during generation)
   - Stores all generated component files
   - Serializes to/from JSON for persistence in database
   - Core class: `VirtualFileSystem` with methods for CRUD operations

4. **Live Preview** (`src/components/preview/`)
   - Transforms virtual files using Babel standalone
   - Dynamically renders React components in iframe
   - Hot reloads when AI modifies files

### AI Provider System

**File**: `src/lib/provider.ts`

- Checks for `ANTHROPIC_API_KEY` in environment
- If present: Uses `claude-haiku-4-5` via `@ai-sdk/anthropic`
- If absent: Falls back to `MockLanguageModel` that generates static demo components
- Mock provider creates hardcoded Counter/Form/Card components for demo purposes

### Authentication & Session Management

**Files**: `src/lib/auth.ts`, `src/middleware.ts`, `src/actions/index.ts`

- JWT-based sessions stored in HTTP-only cookies (7-day expiration)
- Session payload: `{ userId, email, expiresAt }`
- Middleware protects `/api/projects` and `/api/filesystem` routes
- Anonymous users can use app but can't persist projects
- Server actions in `src/actions/`: `signUp()`, `signIn()`, `signOut()`, `getUser()`

### Database Schema

**File**: `prisma/schema.prisma`

The database schema is defined in the @prisma/schema.prisma file. Reference it anytime you need to understand the structure of data stored in the database.

- **User**: Authentication (email, hashed password with bcrypt)
- **Project**: Stores conversation history and virtual file system state
  - `messages`: JSON-serialized chat messages
  - `data`: JSON-serialized virtual file system
  - Optional `userId` for anonymous vs. authenticated projects
- Custom Prisma output: `src/generated/prisma` (not default location)

### Path Alias

Uses `@/*` alias mapped to `./src/*` in `tsconfig.json`. Always import using this alias:
```typescript
import { VirtualFileSystem } from '@/lib/file-system';
```

## Testing

- Test framework: Vitest with React Testing Library
- Vitest configuration: `vitest.config.mts`
- Test files: `**/__tests__/*.test.tsx` or `**/__tests__/*.test.ts`
- Example tests in `src/components/chat/__tests__/`
- Run single test file: `npm test -- path/to/test.test.tsx`
- Test environment: jsdom (configured in vitest.config.mts)

## Code Style

- Use comments sparingly. Only comment complex code.

## Important Notes

- The app works without an Anthropic API key (uses mock provider)
- All component generation happens in-memory via VirtualFileSystem
- Preview uses `@babel/standalone` for runtime transformation
- Uses Next.js 15 App Router with React Server Components
- Tailwind CSS v4 with `@tailwindcss/postcss`
