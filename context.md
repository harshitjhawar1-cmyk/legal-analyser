# Legal Agreement Analyser — Project Context

## Purpose
A web app for analyzing rental and lease agreements using AI. Designed for personal/internal use now, with public deployment planned in future.

## Core Features
- Upload rental/lease agreements (PDF, DOCX, or paste plain text)
- AI-powered analysis using Claude API (claude-sonnet-4-6)
- Follow-up chat for questions about the uploaded document
- Session history tab (localStorage-based)

## Analysis Output Per Document
1. **Plain-English Summary** — what the agreement says in simple terms
2. **Key Terms** — parties, dates, rent amount, duration, deposit, notice period, etc.
3. **Risk Flags** — color-coded HIGH / MEDIUM / LOW risks
4. **Where You Could Be at a Loss** — clauses or gaps that put the user at a disadvantage
5. **Where You Have an Advantage** — clauses that favor the user
6. **Gaps & Missing Clauses** — important things that are absent from the agreement

## Document Types Supported
- PDF (.pdf) — parsed server-side via pdf-parse
- Word documents (.docx) — parsed server-side via mammoth.js
- Plain text — pasted directly into the UI

## What's NOT included
- User authentication (none required)
- Document persistence (localStorage only, no DB)
- Export functionality
- Jurisdiction-specific legal advice

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API (claude-sonnet-4-6)
- **Document parsing**: pdf-parse (PDF), mammoth (DOCX)
- **Storage**: localStorage for history
- **Deployment target**: Vercel

## Project Structure
- `app/` — Next.js App Router pages and layouts
- `app/api/analyze/` — API route for document analysis
- `app/api/chat/` — API route for follow-up chat
- `app/components/` — React UI components
- `lib/` — Shared utilities (Claude client, parsers, types)
- `.env.local` — API key (ANTHROPIC_API_KEY) — NOT committed to git

## Environment Variables
```
ANTHROPIC_API_KEY=your_key_here
```

## Running Locally
```bash
npm run dev
```
App runs at http://localhost:3000
