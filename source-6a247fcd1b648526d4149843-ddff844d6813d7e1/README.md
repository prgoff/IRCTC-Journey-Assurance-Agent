# IRCTC Journey Assurance – AI Travel Planner

An interactive prototype demonstrating an AI-powered IRCTC railway journey planning assistant. Users describe a travel goal in plain English and receive 4 structured journey plans (A–D) with full itineraries, success probabilities, and Tatkal fallback options.

## Key Technologies

- **Framework:** TanStack Start (React, file-based routing)
- **AI:** Anthropic Claude via Netlify AI Gateway (`claude-haiku-4-5`)
- **Styling:** Tailwind CSS v4 with custom IRCTC colour theme
- **Icons:** Lucide React
- **Hosting:** Netlify (serverless functions + AI Gateway)

## Screens

| Route | Description |
|-------|-------------|
| `/` | Splash/Login – IRCTC branded hero |
| `/home` | Goal Input – natural language travel goal |
| `/plans?goal=…` | Plan Results – AI-generated Plan A/B/C/D cards |
| `/plan/:id` | Plan Detail – step-by-step itinerary |
| `/confirm` | Confirmation chat with booking summary |
| `/help` | IRCTC Help chat (AI assistant) |

## How to Run Locally

```bash
npm install
npm run dev
```

Requires Node.js ≥ 18. The AI journey planner uses fallback demo data when no API key is configured locally — perfect for UI development without credentials.

## AI Features

- **Journey Planning** (`POST /api/journey`): Parses a natural language goal and returns 4 travel plans with train details, fares, success probabilities, and itineraries via Anthropic Claude.
- **Help Chat** (`POST /api/chat`): IRCTC-focused Q&A assistant for booking questions, class info, Tatkal rules, etc.

## Demo Script

1. Open app → Splash screen with "Get Started"
2. Type: *"Patna to Delhi by Friday 8 AM under ₹1500"* → Plan My Journey
3. See Plans A–D cards with success probabilities
4. Click Plan A details → step-by-step itinerary
5. Confirm → Chat confirmation with PNR, tips, and metrics
