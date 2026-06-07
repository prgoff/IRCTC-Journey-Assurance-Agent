# AGENTS.md

This document provides an overview of the IRCTC Journey Assurance prototype for developers and AI agents.

## Project Overview

An AI-powered Indian Railways journey planning assistant. Users describe a travel goal in natural language (e.g. "Reach Delhi by Friday 8 AM under ₹1500") and receive 4 structured journey plans (A–D) with step-by-step itineraries, success probabilities, and Tatkal fallback options. Built with TanStack Start and deployed on Netlify.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React + Vite) |
| Routing | TanStack Router v1 (file-based) |
| Styling | Tailwind CSS v4 with custom IRCTC theme |
| Icons | Lucide React |
| AI (Journey) | Anthropic Claude via Netlify AI Gateway (fetch-based JSON) |
| AI (Help Chat) | TanStack AI + `@tanstack/ai-anthropic` (SSE streaming) |
| Language | TypeScript 5 |
| Deployment | Netlify |

## Directory Structure

```
src/
  lib/
    journey-types.ts     # JourneyData, JourneyPlan, ItineraryStep types
    ai-hook.ts           # useAIChat hook for streaming help chat
  routes/
    __root.tsx           # HTML shell, page title
    index.tsx            # Splash screen (/)
    home.tsx             # Goal input form (/home)
    plans.tsx            # Plan cards grid (/plans?goal=…)
    plan.$planId.tsx     # Plan detail & itinerary (/plan/:id)
    confirm.tsx          # Booking confirmation + chat bubbles (/confirm)
    help.tsx             # IRCTC help chat UI (/help)
    api.journey.ts       # POST /api/journey – AI journey planner endpoint
    api.chat.ts          # POST /api/chat – streaming IRCTC help chat
  styles.css             # Tailwind v4 imports + @theme colours + animations
```

## Key Decisions

### State Flow
No global state library. Data moves through:
1. URL search param `?goal=…` – passed between home → plans → plan detail → confirm
2. `sessionStorage.journeyData` – full AI response cached after first API call (keyed by goal)

### AI Journey Endpoint (`api.journey.ts`)
Uses raw `fetch` against Anthropic via Netlify AI Gateway env vars. Returns a `JourneyData` JSON object synchronously (not streamed). Includes a complete `generateMockData()` fallback so the prototype is fully interactive without API keys.

### Help Chat (`api.chat.ts` + `help.tsx`)
Uses `@tanstack/ai` streaming pipeline via `toServerSentEventsResponse`. The `useAIChat` hook in `ai-hook.ts` connects to `/api/chat`.

### Plan Colour Coding
- Plan A: Emerald (best choice)
- Plan B: Blue (alternate)
- Plan C: Amber (budget)
- Plan D: Purple (Tatkal fallback, `isTatkal: true`)

## Conventions
- All UI uses Tailwind utility classes; no component library
- `animate-slide-up` CSS class for staggered card entrance animations (defined in `styles.css`)
- `@theme` block in `styles.css` defines IRCTC colours accessible as Tailwind utilities: `bg-irctc-blue`, `text-irctc-orange`
- Route params: `plan.$planId.tsx` → `/plan/:planId`
- Server endpoints: `createFileRoute('/api/…')` with `server.handlers.POST`
