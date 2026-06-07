import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Train, CheckCircle, ArrowRight, Star, Clock, IndianRupee, HelpCircle, RotateCcw, Zap } from 'lucide-react'
import type { JourneyData, JourneyPlan } from '@/lib/journey-types'

export const Route = createFileRoute('/confirm')({
  validateSearch: (search: Record<string, unknown>) => ({
    planId: String(search.planId ?? 'A'),
    goal: String(search.goal ?? ''),
  }),
  component: Confirm,
})

function ChatBubble({ from, children, delay = 0 }: { from: 'ai' | 'user'; children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  if (!visible) return null

  if (from === 'user') {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="bg-blue-600 text-white text-sm rounded-2xl rounded-br-md px-4 py-2.5 max-w-xs shadow-sm">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5 animate-slide-up">
      <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        <Train className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white text-slate-700 text-sm rounded-2xl rounded-bl-md px-4 py-2.5 max-w-xs shadow-sm border border-slate-100">
        {children}
      </div>
    </div>
  )
}

function MetricCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function Confirm() {
  const { planId, goal } = Route.useSearch()
  const navigate = useNavigate()
  const [plan, setPlan] = useState<JourneyPlan | null>(null)
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null)
  const pnr = `421${Math.floor(1000000 + Math.random() * 9000000)}`

  useEffect(() => {
    const cached = sessionStorage.getItem('journeyData')
    if (cached) {
      const data: JourneyData = JSON.parse(cached)
      const found = data.plans.find((p) => p.id === planId)
      if (found) {
        setPlan(found)
        setJourneyData(data)
        return
      }
    }
    navigate({ to: '/home' })
  }, [planId, navigate])

  if (!plan || !journeyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  const isTatkal = plan.isTatkal

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Success header */}
      <div style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)' }}>
        <div className="max-w-lg mx-auto px-4 py-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Plan Confirmed!</h1>
          <p className="text-emerald-200 text-sm">Your journey is set. Have a great trip!</p>

          <div className="mt-4 bg-white/15 backdrop-blur rounded-2xl px-5 py-3 inline-flex flex-col items-center gap-1">
            <p className="text-emerald-100 text-xs uppercase tracking-wider">PNR Number (Demo)</p>
            <p className="text-white font-black text-2xl tracking-widest">{pnr}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Chat summary */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Journey Summary Chat</p>
          <div className="space-y-3">
            <ChatBubble from="user" delay={0}>
              Book Plan {plan.id} – {plan.trainName}
            </ChatBubble>
            <ChatBubble from="ai" delay={300}>
              <p className="font-semibold text-slate-800 mb-1">Your plan is set!</p>
              <p>
                <strong>{plan.trainName}</strong> #{plan.trainNumber} on {plan.from.date}.
                Departure {plan.from.time} from {plan.from.station} ({plan.from.code}).
              </p>
            </ChatBubble>
            <ChatBubble from="ai" delay={700}>
              <p>
                <strong>Arrival:</strong> {plan.to.station} ({plan.to.code}) at {plan.to.time} on {plan.to.date}.{' '}
                Total fare: <strong>₹{plan.fare.toLocaleString('en-IN')}</strong> · {plan.classLabel} · {plan.duration}.
              </p>
            </ChatBubble>
            {isTatkal && (
              <ChatBubble from="ai" delay={1100}>
                <p className="flex items-start gap-1.5">
                  <Zap className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Tatkal Reminder:</strong> Book at exactly <strong>10:00 AM</strong> tomorrow to secure this ticket. Ensure Aadhaar is linked to your IRCTC account.
                  </span>
                </p>
              </ChatBubble>
            )}
            <ChatBubble from="ai" delay={1400}>
              <p>
                <strong>Key tip:</strong>{' '}
                {plan.tips[0] || 'Carry a valid photo ID. Download your e-ticket.'}
              </p>
            </ChatBubble>
            <ChatBubble from="ai" delay={1800}>
              <p className="text-slate-600">
                Need help with the journey? Tap <strong>"Ask AI Help"</strong> below for any questions.
              </p>
            </ChatBubble>
          </div>
        </div>

        {/* Success metrics */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Demo Metrics</p>
          <div className="grid grid-cols-3 gap-3">
            <MetricCard value={`${plan.successChance}%`} label="Success Chance" sub="Based on availability" />
            <MetricCard value={`${journeyData.responseMs || 1200}ms`} label="AI Response" sub="End-to-end query" />
            <MetricCard value="~8 min" label="Time Saved" sub="vs manual search" />
          </div>
        </div>

        {/* Booking summary card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
            <p className="text-white font-bold text-sm">Booking Summary</p>
            <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">Demo</span>
          </div>
          <div className="p-4 space-y-2.5 text-sm">
            {[
              { label: 'Train', value: `${plan.trainName} (#${plan.trainNumber})` },
              { label: 'From', value: `${plan.from.station} at ${plan.from.time}, ${plan.from.date}` },
              { label: 'To', value: `${plan.to.station} at ${plan.to.time}, ${plan.to.date}` },
              { label: 'Class', value: plan.classLabel },
              { label: 'Fare', value: `₹${plan.fare.toLocaleString('en-IN')}` },
              { label: 'PNR', value: pnr },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-3">
                <span className="text-slate-400 flex-shrink-0">{label}</span>
                <span className="text-slate-800 font-semibold text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/help"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-md"
          >
            <HelpCircle className="w-5 h-5" />
            Ask AI Help
          </Link>
          <Link
            to="/home"
            onClick={() => sessionStorage.clear()}
            className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-2xl transition-colors border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            Plan Another Journey
          </Link>
        </div>

        <p className="text-center text-xs text-slate-400 pb-2">
          This is a demo prototype. No real booking was made.
        </p>
      </div>
    </div>
  )
}
