# PRD: Max & Lila's Bedtime Story Machine 🌙

> **Status:** Draft — awaiting review  
> **Owner:** Yoav Zingher  
> **Builder:** Claude Code (Opus)  
> **Target users:** Max & Lila Zingher, age 4.5  
> **Repo:** github.com/yzingher/bedtime-stories  
> **Live URL:** TBD (Vercel)

---

## Overview

A magical bedtime story web app for Max and Lila. Either child picks their name, makes 3 fun choices, and a unique personalised story is generated in seconds. Both kids appear in every story — the child generating is the hero, their sibling is the companion. Stories are saved so Dad can pull them up for re-reading any night.

---

## CLAUDE.md (auto-loaded by Claude Code)

> This section becomes the `CLAUDE.md` file in the repo root.

```markdown
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

## Environment variables required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

---

## Tech Stack & Conventions

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS only |
| Database | Supabase (Postgres) |
| AI — Story | OpenAI GPT-4o |
| AI — Read Aloud | OpenAI TTS (`nova` voice) |
| Deployment | Vercel |
| Node version | 22.x |

**Design tokens (use these exactly):**
- Background: `#0f0c29` (deep navy)
- Accent: `#302b63` (purple)
- Star gold: `#ffd700`
- Text: `#f0f0f0`
- Max colour: `#f97316` (orange)
- Lila colour: `#a855f7` (purple)
- Font: Nunito (Google Fonts) — rounded, friendly
- Min button height: 64px (touch targets for kids)
- Border radius: `rounded-3xl` on all cards and buttons

---

## Environment Setup

```bash
# In /home/openclaw/.openclaw/workspace/projects/bedtime-stories
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
npm install @supabase/supabase-js openai
```

**Create `.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=<from Supabase project>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase project>
OPENAI_API_KEY=<from .env on server>
```

**Supabase setup (run in Supabase SQL editor):**
```sql
create table stories (
  id uuid primary key default gen_random_uuid(),
  player text not null check (player in ('max', 'lila')),
  magical_friend text not null,
  place text not null,
  problem text not null,
  story_text text not null,
  image_url text,
  is_favourite boolean default false,
  created_at timestamptz default now()
);
alter table stories enable row level security;
create policy "public access" on stories for all using (true) with check (true);
```

---

## Milestones

### Milestone 1 — Scaffold + Database + CLAUDE.md
**Goal:** Working Next.js app with Supabase connected, CLAUDE.md in place, global design tokens applied.

**Tasks:**
- Run `create-next-app` in project directory
- Install dependencies
- Create `CLAUDE.md` in repo root (content from above)
- Set up Tailwind config with design tokens (colours, fonts)
- Add Google Font: Nunito via `next/font`
- Create Supabase client utility at `/lib/supabase.ts`
- Create `/app/layout.tsx` with dark background and Nunito font
- Create a placeholder home page that shows "Max & Lila's Bedtime Stories 🌙" centered on screen
- Add `.env.local` with all keys

**Verification:**
```bash
npm run build   # must pass with 0 errors
npm run dev     # open localhost:3000, see title text on dark background with Nunito font
```
**Commit:** `"Milestone 1: Scaffold + Supabase + design tokens"`

---

### Milestone 2 — Home Screen + Player Picker
**Goal:** Polished home screen. Tap Max or Lila to select. Shows saved story count.

**Tasks:**
- Home page (`/app/page.tsx`): 
  - Header: "Bedtime Stories 🌙" in large gold text
  - Two large character cards side by side:
    - Max 🦁 (orange `#f97316` gradient background)
    - Lila 🦋 (purple `#a855f7` gradient background)
  - Each card: emoji (large), name, "X stories saved" count fetched from Supabase
  - Tapping a card navigates to `/build?player=max` or `/build?player=lila`
  - Twinkling star animation in background (CSS only, no JS library)
  - "⭐ Our Favourites" button at bottom links to `/favourites`
- Fetch story counts from Supabase per player on page load

**Verification:**
- `npm run build` passes
- Home page renders on mobile viewport (375px wide)
- Both character cards visible, correct colours
- Story counts show (0 if DB empty)
- Tapping Max navigates to `/build?player=max`

**Commit:** `"Milestone 2: Home screen + player picker"`

---

### Milestone 3 — Story Builder Wizard
**Goal:** 3-step wizard to pick magical friend, place, and problem. No AI yet — static choices only.

**Tasks:**
- Page `/app/build/page.tsx`:
  - Read `player` from URL params
  - Step 1 — Pick a magical friend (4 choices, big emoji buttons):
    - Talking bunny 🐰 / Tiny fairy 🧚 / Friendly robot 🤖 / Baby dinosaur 🦕
  - Step 2 — Pick a place (6 choices):
    - Enchanted forest 🌳 / Underwater kingdom 🌊 / Candy land 🍭 / Outer space 🚀 / Snowy mountain 🏔️ / Magical library 📚
  - Step 3 — Pick a problem (6 choices):
    - Find a lost treasure 💎 / Help a sad cloud ☁️ / Save the rainbow 🌈 / Build a rocket 🚀 / Wake a sleeping giant 👾 / Return a stolen cookie 🍪
  - Each step: one choice per screen, previous choices shown as a small summary bar at top
  - Confirmation screen: summary card showing all choices + "Make my story! ✨" button
  - All choices stored in React state, passed to next page on submit
- Progress indicator (step 1/3, 2/3, 3/3) at top
- Back button on each step

**Verification:**
- `npm run build` passes
- Can complete full wizard flow: pick 3 options, reach confirmation screen
- Summary card shows correct selections
- Back button works on each step
- Works on mobile (375px)

**Commit:** `"Milestone 3: Story builder wizard"`

---

### Milestone 4 — Story Generation + Display
**Goal:** Clicking "Make my story!" calls OpenAI, generates story, displays it beautifully, saves to Supabase.

**Tasks:**
- API route `/app/api/generate-story/route.ts`:
  - Accepts: `{ player, magical_friend, place, problem }`
  - Calls OpenAI GPT-4o with this prompt:
    ```
    You are a warm children's story writer for 4-5 year olds.
    Write a bedtime story with:
    - Hero: {player} (age 4.5)
    - Companion: {other_sibling} (their sibling, also 4.5)
    - Magical friend: {magical_friend}
    - Setting: {place}
    - Problem: {problem}
    Rules: 5 paragraphs, ~350 words, simple vocabulary, both children work together as a team, no scary moments, warm gentle tone, end with both children falling asleep happy and safe.
    Format: Return ONLY the story text, no title, no labels.
    ```
  - Saves completed story to Supabase, returns `{ story_text, id }`
- Generating screen (`/app/generating/page.tsx`):
  - Full screen night sky with animated twinkling stars
  - Text: "The story fairies are writing your adventure... ✨"
  - Moon + stars CSS animation
  - Minimum 3 second display before redirect (even if API returns faster)
  - Calls the API route, then redirects to `/story/[id]`
- Story display page (`/app/story/[id]/page.tsx`):
  - Fetch story from Supabase by ID
  - Large readable text (Nunito, min 20px, 1.8 line height)
  - Story split into paragraphs, each with a decorative star divider
  - One DALL-E illustration at the top, generated using the character descriptions + place/problem as scene context. Store image URL in the `stories` table (`image_url` column).
  - Player name shown: "Max's Story 🦁" or "Lila's Story 🦋"
  - ⭐ Favourite button (toggles `is_favourite` in Supabase)
  - 🔄 New Story button (back to home)
  - 🔊 Read Aloud button (placeholder, implemented in Milestone 5)

**Verification:**
- `npm run build` passes
- Click "Make my story!" → generating screen appears for at least 3s → story page loads
- Story is saved in Supabase (check dashboard)
- Story contains both "Max" and "Lila"
- Favourite button toggles without page reload
- Story page loads directly by URL (`/story/[id]`)

**Commit:** `"Milestone 4: Story generation + display"`

---

### Milestone 5 — Read Aloud + Favourites + Deploy
**Goal:** Read-aloud works, favourites screen works, app is live on Vercel.

**Tasks:**
- API route `/app/api/tts/route.ts`:
  - Accepts `{ story_id }`, fetches story text from Supabase
  - Calls OpenAI TTS API, voice `nova`, model `tts-1`
  - Returns audio stream as `audio/mpeg`
- Read Aloud button on story page:
  - On click: fetch `/api/tts?story_id=X`, play audio via HTML5 Audio API
  - Button shows "🔊 Read to me" → "⏸ Pause" while playing → back to "🔊 Read to me"
  - Works on iOS Safari and Android Chrome
- Favourites page (`/app/favourites/page.tsx`):
  - Grid of all `is_favourite = true` stories
  - Each card: player emoji + name, place + problem, date, first sentence
  - Tap to open story
  - "No favourites yet — make some stories first! ✨" empty state
- Deploy:
  - Create GitHub repo `yzingher/bedtime-stories` (or push to existing)
  - Deploy to Vercel with env vars set via CLI
  - Set production env vars in Vercel dashboard

**Verification:**
- `npm run build` passes
- Read aloud button plays story audio (test on mobile)
- Favourites page shows starred stories
- `vercel --prod` deploys successfully
- Live URL works on phone

**Commit:** `"Milestone 5: Read aloud + favourites + Vercel deploy"`

---

## Character Descriptions (for DALL-E)

Use these in every image generation prompt to ensure Max and Lila look consistent across all stories.

**Max:** Young boy, ~4-5 years old. Light brown/chestnut hair, slightly tousled, parted to one side. Large expressive dark brown eyes, mischievous cheeky smile. Round face, fair skin, slim build. Black hoodie and jeans. Confident, playful energy.

**Lila:** Young girl, ~3-4 years old. Dark brown curly/wavy hair in two pigtail buns with pink hair tie. Big round dark brown eyes with long lashes, sweet slightly shy smile showing baby teeth. Round cherubic face, fair skin, petite build. Pink cardigan. Warm, curious, gentle expression.

**Base DALL-E prompt for both:**
> "Twin siblings, boy and girl, around 4 years old. The boy has lighter brown straight hair and a cheeky grin; the girl has darker brown curly hair in pigtail buns and a sweet smile. Both have large dark brown eyes and fair skin. Cartoon/illustrated style, warm and friendly, suitable for a children's storybook. Scene: {scene_description}."

**Image generation:** One illustration per story, generated with `dall-e-3`, size `1024x1024`, quality `standard`. Store the URL returned by OpenAI (URLs expire after 1 hour — download and store in Supabase Storage, or store the generated image as base64).

**Cost:** ~$0.04 per story image. Totally worth it.

---

## Out of Scope (v1)

- User authentication / multi-family
- Custom character names
- Story editing
- Push notifications
- Offline support
- Print to PDF

---

## Open Questions

> Comment on these in GitHub:

1. **Image storage:** OpenAI DALL-E URLs expire after 1h. Should we (a) save image to Supabase Storage, or (b) regenerate on demand? Option A is cleaner — adds a step in Milestone 4.
2. **Voice:** `nova` (warm female) or `alloy` (neutral)? Defaulting to `nova`.
3. **Security:** Currently open — anyone with the URL sees all stories. Fine for now?
4. **Story length:** 5 paragraphs / ~350 words ≈ 3-4 min read. Right for bedtime?
