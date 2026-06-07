import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import {
  Train, ChevronLeft, MapPin, Clock, IndianRupee, CheckCircle, Users,
  CalendarDays, ArrowRight, Brain, Info, Sparkles, AlertCircle, Zap
} from 'lucide-react'
import type { JourneyData, JourneyPlan } from '@/lib/journey-types'

export const Route = createFileRoute('/review')({
  validateSearch: (search: Record<string, unknown>) => ({
    planId: String(search.planId ?? 'A'),
    goal: String(search.goal ?? ''),
  }),
  component: JourneyReview,
})

const PLAN_COLORS: Record<string, { bg: string; light: string; text: string; border: string; btn: string; badgeText: string }> = {
  A: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', btn: 'bg-emerald-500 hover:bg-emerald-600', badgeText: 'text-emerald-800' },
  B: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', btn: 'bg-blue-500 hover:bg-blue-600', badgeText: 'text-blue-800' },
  C: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', btn: 'bg-amber-500 hover:bg-amber-600', badgeText: 'text-amber-800' },
  D: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', btn: 'bg-purple-500 hover:bg-purple-600', badgeText: 'text-purple-800' },
}

function extractPassengerCount(goal: string): number {
  const match = goal.match(/(\d+)\s*(?:passenger|person|people|adult|ticket)/i)
  return match ? parseInt(match[1]) : 1
}

function getTrainTypeLabel(plan: JourneyPlan): string {
  if (plan.isTatkal) return 'Tatkal (Emergency Quota)'
  if (['1A', '2A', '3A', 'EC', 'CC'].includes(plan.class)) return `Air Conditioned — ${plan.classLabel}`
  if (['SL', '2S'].includes(plan.class)) return `Sleeper — ${plan.classLabel}`
  return plan.classLabel
}

function JourneyReview() {
  const { planId, goal } = Route.useSearch()
  const navigate = useNavigate()
  const [plan, setPlan] = useState<JourneyPlan | null>(null)
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('journeyData')
    if (cached) {
      try {
        const data: JourneyData = JSON.parse(cached)
        const found = data.plans.find((p) => p.id === planId)
        if (found) {
          setPlan(found)
          setJourneyData(data)
          return
        }
      } catch { /* ignore */ }
    }
    if (goal) {
      navigate({ to: '/plans', search: { goal } })
    } else {
      navigate({ to: '/home' })
    }
  }, [planId, goal, navigate])

  if (!plan || !journeyData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  const colors = PLAN_COLORS[plan.id] || PLAN_COLORS.A
  const { parsedGoal } = journeyData
  const passengerCount = extractPassengerCount(goal)
  const trainTypeLabel = getTrainTypeLabel(plan)

  const handleContinue = () => {
    sessionStorage.setItem('confirmedPlan', planId)
    navigate({ to: '/confirm', search: { planId, goal } })
  }

  const handleChangeJourney = () => {
    sessionStorage.clear()
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-36">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #001f4d 0%, #003580 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/plans"
              search={{ goal }}
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Plans
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <Train className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold text-sm">Journey Review</span>
            </div>
            <div className="w-20" />
          </div>

          <div className="mt-4 pb-5">
            {/* Progress steps */}
            <div className="flex items-center gap-1.5 mb-4">
              {['Search', 'Plans', 'Review', 'Payment', 'Confirmed'].map((step, i) => (
                <div key={step} className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className={`flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold
                    ${i < 2 ? 'w-5 h-5 bg-white/30 text-white' : i === 2 ? 'w-5 h-5 bg-orange-500 text-white' : 'w-5 h-5 bg-white/15 text-white/40'}`}
                  >
                    {i < 2 ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs truncate ${i === 2 ? 'text-white font-semibold' : i < 2 ? 'text-white/60' : 'text-white/30'}`}>
                    {step}
                  </span>
                  {i < 4 && <div className={`flex-1 h-px min-w-[4px] ${i < 2 ? 'bg-white/30' : 'bg-white/15'}`} />}
                </div>
              ))}
            </div>
            <h1 className="text-white font-black text-xl mb-1">Review Your Journey</h1>
            <p className="text-blue-200 text-sm">Verify the details below before proceeding to payment</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* AI Interpretation Banner */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-indigo-800 text-sm mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                How we interpreted your request
              </p>
              <div className="bg-white/70 rounded-xl px-3 py-2.5 border border-indigo-100 mb-2">
                <p className="text-indigo-900 text-sm leading-relaxed font-medium">
                  "{parsedGoal.from} → {parsedGoal.to}, by {parsedGoal.deadline},{' '}
                  {passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'},{' '}
                  under ₹{parsedGoal.budget.toLocaleString('en-IN')}"
                </p>
              </div>
              <p className="text-indigo-500 text-xs flex items-center gap-1">
                <Info className="w-3 h-3 flex-shrink-0" />
                If this doesn't match your intent, tap "Change Journey" below.
              </p>
            </div>
          </div>
        </div>

        {/* Selected Plan Summary */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-up"
          style={{ animationDelay: '60ms' }}
        >
          <div className={`px-4 py-3 flex items-center justify-between ${colors.light} border-b ${colors.border}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl ${colors.bg} flex items-center justify-center shadow-sm`}>
                <Train className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className={`font-black text-sm ${colors.text}`}>Plan {plan.id} Selected</p>
                <p className="text-slate-500 text-xs">{plan.label}</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.light} ${colors.badgeText} border ${colors.border}`}>
              {plan.badge}
            </span>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-slate-800 text-base leading-tight">{plan.trainName}</p>
                <p className="text-slate-500 text-xs mt-0.5">#{plan.trainNumber} · {plan.classLabel}</p>
              </div>
              {plan.isTatkal && (
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Tatkal
                </span>
              )}
            </div>

            {/* Route visualization */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 mb-4">
              <div className="text-center flex-1 min-w-0">
                <p className="font-black text-slate-800 text-xl leading-none">{plan.from.time}</p>
                <p className="text-xs font-bold text-slate-600 mt-0.5">{plan.from.code}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{plan.from.station}</p>
                <p className="text-xs text-slate-400">{plan.from.date}</p>
              </div>
              <div className="flex flex-col items-center flex-shrink-0 px-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="w-8 h-px bg-slate-300"></div>
                  <Train className="w-4 h-4 text-slate-400" />
                  <div className="w-8 h-px bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{plan.duration}</p>
                <p className="text-xs text-slate-400">{plan.distance}</p>
              </div>
              <div className="text-center flex-1 min-w-0">
                <p className="font-black text-slate-800 text-xl leading-none">{plan.to.time}</p>
                <p className="text-xs font-bold text-slate-600 mt-0.5">{plan.to.code}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{plan.to.station}</p>
                <p className="text-xs text-slate-400">{plan.to.date}</p>
              </div>
            </div>

            {/* Fare + success */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-slate-500" />
                <span className="font-black text-slate-800 text-lg">₹{plan.fare.toLocaleString('en-IN')}</span>
                <span className="text-slate-500 text-xs">total fare</span>
              </div>
              <div className="w-px h-4 bg-slate-200 ml-auto" />
              <div className="flex items-center gap-1">
                <CheckCircle className={`w-4 h-4 ${plan.successChance >= 90 ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className="text-sm font-semibold text-slate-700">{plan.successChance}% success</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Journey Details — verify before booking */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-up"
          style={{ animationDelay: '120ms' }}
        >
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <p className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              Key Trip Details — Please Verify
            </p>
          </div>
          <div className="divide-y divide-slate-50">
            {([
              { Icon: MapPin, label: 'Origin Station', value: `${plan.from.station} (${plan.from.code})`, highlight: 'text-blue-600' },
              { Icon: MapPin, label: 'Destination Station', value: `${plan.to.station} (${plan.to.code})`, highlight: 'text-red-500' },
              { Icon: CalendarDays, label: 'Travel Date', value: plan.from.date, highlight: '' },
              { Icon: Users, label: 'Passengers', value: `${passengerCount} Adult${passengerCount !== 1 ? 's' : ''}`, highlight: '' },
              { Icon: Train, label: 'Train Preference', value: trainTypeLabel, highlight: '' },
              { Icon: IndianRupee, label: 'Budget Limit', value: `₹${parsedGoal.budget.toLocaleString('en-IN')}`, highlight: '' },
            ] as { Icon: React.ElementType; label: string; value: string; highlight: string }[]).map(({ Icon, label, value, highlight }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3">
                <Icon className="w-4 h-4 text-slate-300 flex-shrink-0" />
                <span className="text-slate-500 text-sm flex-1">{label}</span>
                <span className={`font-semibold text-sm text-right ${highlight || 'text-slate-800'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Overview */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 animate-slide-up"
          style={{ animationDelay: '180ms' }}
        >
          <p className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            Route Overview
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-slate-800">12</p>
              <p className="text-xs text-slate-500 mt-0.5">Trains on this route</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-slate-800">{plan.duration}</p>
              <p className="text-xs text-slate-500 mt-0.5">Journey duration</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-slate-800">{plan.distance}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total distance</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-slate-800">{plan.availableSeats}</p>
              <p className="text-xs text-slate-500 mt-0.5">Seats available</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2.5 text-center">
            Duration range across all options: 7h 50m – 22h 30m
          </p>
        </div>

        {/* Before you proceed checklist */}
        <div
          className="bg-amber-50 border border-amber-100 rounded-2xl p-4 animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          <p className="font-bold text-amber-800 text-sm mb-2.5 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Before You Proceed
          </p>
          <ul className="space-y-2">
            {[
              'Verify your name matches the government ID you will carry',
              'Ensure your IRCTC account is active and Aadhaar is linked',
              plan.isTatkal
                ? 'Tatkal quota opens at 10:00 AM exactly — have payment ready'
                : `Only ${plan.availableSeats} seats remaining on this train — book promptly`,
              'Double-check the travel date and departure time before payment',
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-4 shadow-xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <Link
              to="/home"
              onClick={handleChangeJourney}
              className="flex items-center justify-center gap-1.5 text-slate-600 font-semibold text-sm border border-slate-200 rounded-2xl px-4 py-3.5 hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <ChevronLeft className="w-4 h-4" />
              Change Journey
            </Link>
            <button
              onClick={handleContinue}
              className={`flex-1 flex items-center justify-center gap-2 text-white font-bold text-sm rounded-2xl py-3.5 transition-all hover:opacity-90 active:scale-[0.98] shadow-lg ${colors.btn}`}
            >
              <CheckCircle className="w-4 h-4" />
              Continue to Payment
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            Review complete · Your details will be securely processed
          </p>
        </div>
      </div>
    </div>
  )
}
