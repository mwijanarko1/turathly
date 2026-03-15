# Turathly — Context-aware translation for Islamic texts

A translation workspace designed for scholars working with classical Islamic books. Upload PDFs, OCR Arabic text, and translate with AI assistance.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript for type safety
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 with custom brand tokens
- **Authentication**: Clerk
- **Backend**: Convex (database, real-time subscriptions, functions)
- **AI**: Google Gemini API for OCR and translation
- **UI Components**: shadcn/ui

## Features

- **PDF Upload**: Upload classical Arabic texts in PDF format
- **Advanced OCR**: Extract Arabic text from scanned pages with high accuracy
- **Context-Aware Translation**: AI understands Islamic terminology and scholarly context
- **Three-Column Workspace**: Compare source, OCR, and translation side by side
- **Auto-save**: Every edit persists automatically
- **DOCX Export**: Export translations as formatted Word documents

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (recommended package manager)
- [Convex Account](https://convex.dev) (for backend)
- [Clerk](https://clerk.com) (keyless mode works without an account; claim later)
- [Google AI API Key](https://ai.google.dev/) (for Gemini)

### Installation

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Set up environment variables**
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```
   This will create a new Convex deployment and generate the `_generated` files.

4. **Start the development server**
   ```bash
   bun run dev
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (optional in dev—keyless mode auto-generates) |
| `CLERK_SECRET_KEY` | Clerk secret key (optional in dev—keyless mode auto-generates) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | Redirect after sign-in |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | Redirect after sign-up |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `GOOGLE_API_KEY` | Google Gemini API key |

**Clerk keyless mode**: Leave keys unset to start. Clerk generates temporary keys and shows a "Claim your application" prompt. Do not mix keyless (`.clerk/.tmp/keyless.json`) with explicit keys in `.env.local`—that causes redirect loops. If switching to manual keys, remove `.clerk/` and set keys in `.env.local`.

## Project Structure

```
src/
  app/
    (auth)/
      sign-in/          # Sign-in page
      sign-up/          # Sign-up page
    dashboard/          # Project list
    project/[id]/       # Document list
      translate/[doc]/  # Translation workspace
    page.tsx            # Landing page
    layout.tsx          # Root layout
  components/
    marketing/          # Landing page components
    ui/                 # shadcn components
  lib/
    providers.tsx       # Convex provider
    types.ts            # TypeScript types
    env.ts              # Environment validation
convex/
  schema.ts             # Database schema
  users.ts              # User functions
  projects.ts           # Project functions
  documents.ts          # Document functions
  segments.ts           # Text segment functions
  translations.ts       # Translation functions
```

## MVP Phases

- [x] Phase 1: Foundation (auth, Convex, landing page)
- [x] Phase 2: Dashboard and project management
- [ ] Phase 3: OCR pipeline (Gemini)
- [ ] Phase 4: AI Translation (Gemini)
- [x] Phase 5: Translation workspace UI
- [ ] Phase 6: DOCX export

## Scripts

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run start      # Start production server
bun run test       # Run tests
```

## License

MIT License - see [LICENSE](LICENSE) for details.
