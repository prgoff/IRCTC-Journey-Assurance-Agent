import { createFileRoute } from '@tanstack/react-router'
import type { JourneyData, JourneyPlan } from '@/lib/journey-types'

const SYSTEM_PROMPT = `You are an IRCTC Journey Assurance AI Planner. Given a travel goal, return ONLY a valid JSON object (no markdown, no code blocks, no explanation).

The JSON must follow this exact structure:
{
  "parsedGoal": {
    "from": "City name",
    "to": "City name",
    "deadline": "Day, Date Time",
    "budget": 1500
  },
  "plans": [
    {
      "id": "A",
      "label": "Best Choice",
      "badge": "Recommended",
      "trainNumber": "12309",
      "trainName": "Rajdhani Express",
      "from": { "station": "Full Station Name Jn", "code": "PNBE", "time": "02:05", "date": "Thu, 5 Jun" },
      "to": { "station": "New Delhi", "code": "NDLS", "time": "09:55", "date": "Fri, 6 Jun" },
      "class": "3A",
      "classLabel": "AC 3 Tier",
      "fare": 1395,
      "successChance": 95,
      "availableSeats": 47,
      "duration": "7h 50m",
      "distance": "1001 km",
      "itinerary": [
        { "icon": "info", "title": "Arrive at Station", "description": "Reach 30 min early. Check platform.", "time": "01:35" },
        { "icon": "train", "title": "Board Train", "description": "Train departs. Check PNR for coach.", "time": "02:05" },
        { "icon": "food", "title": "Meal Served", "description": "Complimentary meal included.", "time": "03:30" },
        { "icon": "train", "title": "Arrive Destination", "description": "Exit instructions and onward travel tip.", "time": "09:55" }
      ],
      "tips": ["Carry govt-issued ID proof", "Download e-ticket offline"],
      "tags": ["Fastest", "AC", "Meals Included"],
      "isTatkal": false,
      "isBestChoice": true
    }
  ]
}

Rules:
- Generate exactly 4 plans: A (premium/best), B (alternate), C (budget), D (Tatkal fallback)
- Plan D must have isTatkal=true and include Tatkal booking tip
- Use real-sounding Indian Railways train numbers and names
- Fares must fit within stated budget for plans A, B, C; plan D can exceed slightly
- successChance: A=90-98, B=75-88, C=65-78, D=80-92 (Tatkal)
- Return ONLY the JSON object, nothing else`

function generateMockData(goal: string): JourneyData {
  const now = new Date()
  const thu = new Date(now)
  thu.setDate(now.getDate() + ((4 - now.getDay() + 7) % 7 || 7))
  const thuStr = thu.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  const fri = new Date(thu)
  fri.setDate(thu.getDate() + 1)
  const friStr = fri.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

  // Attempt to extract from/to from the goal
  const fromMatch = goal.match(/^(.+?)\s+to\s+/i)
  const toMatch = goal.match(/\s+to\s+(.+?)(?:\s+by|\s+before|\s+under|$)/i)
  const budgetMatch = goal.match(/₹?\s*(\d+(?:,\d+)?)/i)

  const fromCity = fromMatch ? fromMatch[1].trim() : 'Patna'
  const toCity = toMatch ? toMatch[1].trim() : 'Delhi'
  const budget = budgetMatch ? parseInt(budgetMatch[1].replace(',', '')) : 1500

  const plans: JourneyPlan[] = [
    {
      id: 'A',
      label: 'Best Choice',
      badge: 'Recommended',
      trainNumber: '12309',
      trainName: 'Rajdhani Express',
      from: { station: `${fromCity} Junction`, code: 'PNBE', time: '02:05', date: thuStr },
      to: { station: `${toCity} (New Delhi)`, code: 'NDLS', time: '09:55', date: friStr },
      class: '3A',
      classLabel: 'AC 3 Tier',
      fare: Math.min(budget, 1395),
      successChance: 95,
      availableSeats: 47,
      duration: '7h 50m',
      distance: '1001 km',
      itinerary: [
        { icon: 'info', title: `Arrive at ${fromCity} Junction`, description: 'Reach platform 3 at least 30 minutes before departure. Confirm PNR status.', time: '01:35' },
        { icon: 'train', title: 'Board Rajdhani Express', description: `Train departs on time. Check your PNR for coach & berth number.`, time: '02:05' },
        { icon: 'food', title: 'Dinner Served On-Board', description: 'Complimentary vegetarian/non-veg dinner included in fare.', time: '03:30' },
        { icon: 'food', title: 'Morning Breakfast', description: 'Tea/coffee and breakfast served before arrival.', time: '07:00' },
        { icon: 'train', title: `Arrive ${toCity}`, description: 'Exit from Gate 2. Delhi Metro (Blue Line) available 200m from exit.', time: '09:55' },
      ],
      tips: ['Download e-ticket before boarding', 'Carry government-issued ID proof', 'Rajdhani is usually on time — very reliable', 'Delhi Metro Blue Line from NDLS connects to city centre'],
      tags: ['Fastest', 'AC', 'Meals Included', 'Highly Reliable'],
      isTatkal: false,
      isBestChoice: true,
    },
    {
      id: 'B',
      label: 'Alternate',
      badge: 'Good Option',
      trainNumber: '12801',
      trainName: 'Purushottam Express',
      from: { station: `${fromCity} Junction`, code: 'PNBE', time: '10:30', date: thuStr },
      to: { station: `${toCity} (New Delhi)`, code: 'NDLS', time: '06:45', date: friStr },
      class: '2S',
      classLabel: 'Sleeper Class',
      fare: Math.min(budget, 485),
      successChance: 82,
      availableSeats: 31,
      duration: '20h 15m',
      distance: '1001 km',
      itinerary: [
        { icon: 'info', title: `Arrive at ${fromCity} Junction`, description: 'Daytime departure — easier to board. Check platform announcements.', time: '10:00' },
        { icon: 'train', title: 'Board Purushottam Express', description: 'Sleeper class. Carry your own food or buy from pantry car.', time: '10:30' },
        { icon: 'food', title: 'Pantry Car Available', description: 'Meals available to purchase. Recommended: bring snacks.', time: '13:00' },
        { icon: 'train', title: 'Overnight Journey', description: 'Night travel — lock your luggage and keep valuables with you.', time: '22:00' },
        { icon: 'train', title: `Arrive ${toCity}`, description: 'Early morning arrival. Metro starts at 5:30 AM.', time: '06:45' },
      ],
      tips: ['Book window seat for comfortable overnight travel', 'Carry a bedsheet/blanket for sleeper class', 'Lock luggage to the berth chain', 'Pantry car opens post Mughal Sarai'],
      tags: ['Budget Friendly', 'Sleeper', 'Overnight'],
      isTatkal: false,
      isBestChoice: false,
    },
    {
      id: 'C',
      label: 'Budget Option',
      badge: 'Lowest Fare',
      trainNumber: '15027',
      trainName: 'Maurya Express',
      from: { station: `${fromCity} Junction`, code: 'PNBE', time: '07:15', date: thuStr },
      to: { station: `${toCity} (Anand Vihar)`, code: 'ANVT', time: '04:50', date: friStr },
      class: '2S',
      classLabel: 'Sleeper Class',
      fare: Math.min(budget, 380),
      successChance: 72,
      availableSeats: 18,
      duration: '21h 35m',
      distance: '1007 km',
      itinerary: [
        { icon: 'info', title: `Depart ${fromCity} Early Morning`, description: 'Arrives Anand Vihar — note: different terminus from NDLS.', time: '07:15' },
        { icon: 'train', title: 'Board Maurya Express', description: 'Slower but cheaper. Stops at major junctions en route.', time: '07:15' },
        { icon: 'food', title: 'Station Stops for Food', description: 'Multiple halts — buy food at platforms like Mughalsarai, Allahabad.', time: '12:00' },
        { icon: 'warning', title: 'Note: Anand Vihar Terminal', description: 'Arrives ANVT not NDLS. Metro Pink/Blue line available from ANVT.', time: '04:50' },
      ],
      tips: ['ANVT is in East Delhi — plan metro/cab accordingly', 'This train stops more often, expect slight delays', 'Good option if budget is priority over speed', 'Lowest available fare on this route'],
      tags: ['Cheapest', 'Sleeper', 'More Stops'],
      isTatkal: false,
      isBestChoice: false,
    },
    {
      id: 'D',
      label: 'Tatkal Fallback',
      badge: 'Emergency Option',
      trainNumber: '12393',
      trainName: 'Sampoorna Kranti Express',
      from: { station: `${fromCity} Junction`, code: 'PNBE', time: '19:20', date: thuStr },
      to: { station: `${toCity} (New Delhi)`, code: 'NDLS', time: '05:30', date: friStr },
      class: '3A',
      classLabel: 'AC 3 Tier (Tatkal)',
      fare: Math.round(budget * 1.3),
      successChance: 88,
      availableSeats: 12,
      duration: '10h 10m',
      distance: '1001 km',
      itinerary: [
        { icon: 'warning', title: 'Book Tatkal at 10:00 AM Sharp', description: 'Tatkal quota opens at 10:00 AM, one day before travel. Be ready!', time: '10:00' },
        { icon: 'info', title: 'Complete OTP/Aadhaar Verification', description: 'Tatkal requires Aadhaar linking. Complete at IRCTC account settings now.', time: '' },
        { icon: 'train', title: 'Evening Departure', description: 'Comfortable evening train. Arrive Delhi early Friday morning.', time: '19:20' },
        { icon: 'train', title: `Arrive ${toCity}`, description: 'Early morning arrival. Well before your 8 AM deadline.', time: '05:30' },
      ],
      tips: ['USE THIS ONLY if Plans A/B fail', 'Tatkal opens exactly 24h before departure at 10:00 AM', 'Ensure Aadhaar is linked to IRCTC account', 'Have payment ready — Tatkal bookings close quickly'],
      tags: ['Tatkal', 'AC', 'Last Resort', 'Guaranteed'],
      isTatkal: true,
      isBestChoice: false,
    },
  ]

  return {
    goal,
    parsedGoal: {
      from: fromCity,
      to: toCity,
      deadline: `Friday, 8:00 AM`,
      budget,
    },
    plans,
    responseMs: 1200,
  }
}

export const Route = createFileRoute('/api/journey')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const startMs = Date.now()
        const { goal } = await request.json() as { goal: string }

        if (!goal?.trim()) {
          return Response.json({ error: 'Goal is required' }, { status: 400 })
        }

        try {
          const apiKey = process.env.ANTHROPIC_API_KEY
          const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com'

          if (!apiKey) {
            const mock = generateMockData(goal)
            mock.responseMs = Date.now() - startMs
            return Response.json(mock)
          }

          const aiResponse = await fetch(`${baseUrl}/v1/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-haiku-4-5',
              max_tokens: 3500,
              system: SYSTEM_PROMPT,
              messages: [{ role: 'user', content: `Generate journey plans for this travel goal: ${goal}` }],
            }),
          })

          if (!aiResponse.ok) {
            const mock = generateMockData(goal)
            mock.responseMs = Date.now() - startMs
            return Response.json(mock)
          }

          const aiData = await aiResponse.json() as { content: Array<{ text: string }> }
          const rawText = aiData.content?.[0]?.text || ''

          // Extract JSON - try direct parse first, then extract from text
          let parsed: Omit<JourneyData, 'goal' | 'responseMs'>
          try {
            parsed = JSON.parse(rawText)
          } catch {
            const jsonMatch = rawText.match(/\{[\s\S]+\}/)
            if (!jsonMatch) throw new Error('No JSON in response')
            parsed = JSON.parse(jsonMatch[0])
          }

          return Response.json({
            ...parsed,
            goal,
            responseMs: Date.now() - startMs,
          } satisfies JourneyData)
        } catch (err) {
          console.error('Journey API error:', err)
          const mock = generateMockData(goal)
          mock.responseMs = Date.now() - startMs
          return Response.json(mock)
        }
      },
    },
  },
})
