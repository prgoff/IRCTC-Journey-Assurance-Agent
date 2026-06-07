import { createFileRoute } from '@tanstack/react-router'
import { chat, maxIterations, toServerSentEventsResponse } from '@tanstack/ai'
import { anthropicText } from '@tanstack/ai-anthropic'
import { openaiText } from '@tanstack/ai-openai'
import { geminiText } from '@tanstack/ai-gemini'

const SYSTEM_PROMPT = `You are an IRCTC Journey Assurance AI assistant. You help Indian railway travellers with:
- Train booking questions (IRCTC website, app, quotas, classes)
- Tatkal booking rules (window opens 24h before departure at 10 AM for non-AC, 11 AM for AC)
- PNR status and ticket management
- Train classes: SL (Sleeper), 3A (AC 3 Tier), 2A (AC 2 Tier), 1A (First AC), CC (Chair Car), EC (Executive Chair Car)
- Quotas: General, Ladies, Senior Citizen, Defence, Emergency, Tatkal
- Cancellation and refund rules
- Station information and platform guidance
- Journey planning tips for Indian Railways

Be concise, friendly, and helpful. Use Indian numbering formats (₹, lakh, crore).
When mentioning fares, always add a note that prices vary and users should verify on IRCTC.
Keep responses brief — 2-4 sentences unless the question requires more detail.`

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestSignal = request.signal

        if (requestSignal.aborted) {
          return new Response(null, { status: 499 })
        }

        const abortController = new AbortController()

        try {
          const body = await request.json()
          const { messages } = body

          let provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic'
          let model: string = 'claude-haiku-4-5'

          if (process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
            provider = 'openai'
            model = 'gpt-4o-mini'
          } else if (process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
            provider = 'gemini'
            model = 'gemini-2.5-flash'
          }

          const adapter =
            provider === 'openai'
              ? openaiText(model as any)
              : provider === 'gemini'
                ? geminiText(model as any)
                : anthropicText(model as any)

          const stream = chat({
            adapter,
            tools: [],
            systemPrompts: [SYSTEM_PROMPT],
            agentLoopStrategy: maxIterations(3),
            messages,
            abortController,
          })

          return toServerSentEventsResponse(stream, { abortController })
        } catch (error: any) {
          console.error('Chat error:', error)
          if (error.name === 'AbortError' || abortController.signal.aborted) {
            return new Response(null, { status: 499 })
          }
          return new Response(
            JSON.stringify({ error: 'Failed to process chat request', message: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
