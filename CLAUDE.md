# Bedtime Stories — CLAUDE.md

## Project
Next.js 15 app (App Router). TypeScript. Tailwind CSS. Supabase for persistence. OpenAI for story generation and TTS.

## Stack
- Next.js 15 + TypeScript + Tailwind CSS
- Supabase JS client (@supabase/supabase-js)
- OpenAI SDK (openai)
- Deployment: Vercel

## Key conventions
- All components in /components, pages in /app
- Tailwind only — no CSS modules, no styled-components
- Server Actions for Supabase writes, client components for interactivity
- Environment variables via .env.local (never committed)
- Commit after each milestone with message: "Milestone N: <name>"

## Design tokens
- Background: #0f0c29
- Accent: #302b63
- Star gold: #ffd700
- Text: #f0f0f0
- Max colour: #f97316 (orange)
- Lila colour: #a855f7 (purple)
- Font: Nunito (Google Fonts)
- Min button height: 64px
- Border radius: rounded-3xl
