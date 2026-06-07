import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import {
  Train, ChevronLeft, MapPin, Clock, IndianRupee, CheckCircle, AlertTriangle,
  Info, Car, UtensilsCrossed, Footprints, Zap, ArrowRight, Trophy, Star
} from 'lucide-react'
import type { JourneyData, JourneyPlan, ItineraryIcon } from '@/lib/journey-types'

export const Route = createFileRoute('/plan/$planId')({
  validateSearch: (search: Record<string, unknown>) => ({
    goal: String(search.goal ?? ''),
  }),
  component: PlanDetail,
})

const PLAN_COLORS: Record<string, { bg: string; text: string; border: string; light: string; btn: string }> = {
  A: { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50', btn: 'bg-emerald-500 hover:bg-emerald-600' },
  B: { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200', light: 'bg-blue-50', btn: 'bg-blue-500 hover:bg-blue-600' },
  C: { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200', light: 'bg-amber-50', btn: 'bg-amber-500 hover:bg-amber-600' },
  D: { bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-200', light: 'bg-purple-50', btn: 'bg-purple-500 hover:bg-purple-600' },
}

const PLAN_ICONS: Record<string, React.ElementType> = {
  A: Trophy, B: Star, C: IndianRupee, D: Zap,
}

const STEP_ICONS: Record<ItineraryIcon, React.ElementType> = {
  train: Train,
  walk: Footprints,
  taxi: Car,
  food: UtensilsCrossed,
  info: Info,
  warning: AlertTriangle,
}

const STEP_COLORS: Record<ItineraryIcon, string> = {
  train: 'bg-blue-500',
  walk: 'bg-slate-400',
  taxi: 'bg-amber-500',
  food: 'bg-orange-500',
  info: 'bg-blue-400',
  warning: 'bg-red-500',
}

function PlanDetail() {
  const { planId } = Route.useParams()
  const { goal } = Route.useSearch()
  const navigate = useNavigate()
  const [plan, setPlan] = useState<JourneyPlan | null>(null)
  const [allPlans, setAllPlans] = useState<JourneyPlan[]>([])

  useEffect(() => {
    const cached = sessionStorage.getItem('journeyData')
    if (cached) {
      const data: JourneyData = JSON.parse(cached)
      const found = data.plans.find((p) => p.id === planId)
      if (found) {
        setPlan(found)
        setAllPlans(data.plans.filter((p) => p.id !== planId))
        return
      }
    }
    if (goal) {
      navigate({ to: '/plans', search: { goal } })
    } else {
      navigate({ to: '/home' })
    }
  }, [planId, goal, navigate])

  const handleConfirm = () => {
    sessionStorage.setItem('confirmedPlan', planId)
    navigate({ to: '/confirm', search: { planId, goal } })
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading plan details…</p>
        </div>
      </div>
    )
  }

  const colors = PLAN_COLORS[plan.id] || PLAN_COLORS.A
  const PlanIcon = PLAN_ICONS[plan.id] || Trophy

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #001f4d 0%, #003580 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/plans"
              search={{ goal }}
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              All Plans
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <Train className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold text-sm">Plan {plan.id} Details</span>
            </div>
            <div className="w-16"></div>
          </div>

          {/* Plan hero */}
          <div className={`rounded-2xl p-4 mb-4 ${colors.light} border ${colors.border}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <PlanIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`font-black text-base ${colors.text}`}>Plan {plan.id} – {plan.label}</p>
                  <p className="text-slate-500 text-xs">{plan.badge}</p>
                </div>
              </div>
              {plan.isTatkal && (
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Tatkal
                </span>
              )}
            </div>

            <p className="font-bold text-slate-800 text-lg">{plan.trainName}</p>
            <p className="text-slate-500 text-xs mb-3">#{plan.trainNumber} · {plan.classLabel}</p>

            {/* Route */}
            <div className="bg-white rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0 text-center">
                <p className="font-black text-2xl text-slate-800 leading-none">{plan.from.time}</p>
                <p className="text-xs font-bold text-slate-600 mt-0.5">{plan.from.code}</p>
                <p className="text-xs text-slate-400 truncate">{plan.from.station}</p>
                <p className="text-xs text-slate-400">{plan.from.date}</p>
              </div>
              <div className="flex flex-col items-center flex-shrink-0">
                <Train className="w-5 h-5 text-slate-400 mb-1" />
                <div className="w-16 h-px bg-slate-300"></div>
                <p className="text-xs text-slate-500 mt-1">{plan.duration}</p>
                <p className="text-xs text-slate-400">{plan.distance}</p>
              </div>
              <div className="flex-1 min-w-0 text-center">
                <p className="font-black text-2xl text-slate-800 leading-none">{plan.to.time}</p>
                <p className="text-xs font-bold text-slate-600 mt-0.5">{plan.to.code}</p>
                <p className="text-xs text-slate-400 truncate">{plan.to.station}</p>
                <p className="text-xs text-slate-400">{plan.to.date}</p>
              </div>
            </div>

            {/* Key stats */}
            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-800">₹{plan.fare.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <div className="flex items-center gap-1">
                <CheckCircle className={`w-4 h-4 ${plan.successChance >= 90 ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className="font-semibold text-slate-700">{plan.successChance}% success</span>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <span className="text-slate-500 text-xs">{plan.availableSeats} seats</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Itinerary */}
        <div>
          <h2 className="font-black text-slate-800 text-base mb-4">Step-by-Step Itinerary</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-200"></div>

            <div className="space-y-4">
              {plan.itinerary.map((step, i) => {
                const StepIcon = STEP_ICONS[step.icon]
                const dotColor = STEP_COLORS[step.icon]
                return (
                  <div key={i} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className={`w-10 h-10 rounded-xl ${dotColor} flex items-center justify-center flex-shrink-0 shadow-sm z-10`}>
                      <StepIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl p-3 flex-1 shadow-sm border border-slate-100">
                      <div className="flex items-start justify-between">
                        <p className="font-bold text-slate-800 text-sm">{step.title}</p>
                        {step.time && (
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                            {step.time}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div>
          <h2 className="font-black text-slate-800 text-base mb-3">Pro Tips</h2>
          <div className="space-y-2">
            {plan.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm leading-snug">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* If this plan fails... */}
        {allPlans.length > 0 && (
          <div className={`rounded-2xl p-4 border ${colors.border} ${colors.light}`}>
            <p className={`font-bold text-sm mb-2 ${colors.text} flex items-center gap-1.5`}>
              <AlertTriangle className="w-4 h-4" />
              If this plan fails, alternatives are highlighted:
            </p>
            <div className="flex flex-wrap gap-2">
              {allPlans.map((alt) => (
                <Link
                  key={alt.id}
                  to="/plan/$planId"
                  params={{ planId: alt.id }}
                  search={{ goal }}
                  className="flex items-center gap-1.5 bg-white text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-400 transition-colors"
                >
                  <Train className="w-3 h-3" />
                  Plan {alt.id}: {alt.trainName}
                  {alt.isTatkal && <span className="text-purple-600">(Tatkal)</span>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky confirm bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-4 shadow-xl">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Link
            to="/plans"
            search={{ goal }}
            className="flex items-center justify-center gap-1 text-slate-600 font-semibold text-sm border border-slate-200 rounded-2xl px-5 py-3 hover:border-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <button
            onClick={handleConfirm}
            className={`flex-1 flex items-center justify-center gap-2 text-white font-bold text-base rounded-2xl py-3 transition-all hover:opacity-90 shadow-lg ${colors.btn}`}
          >
            <CheckCircle className="w-5 h-5" />
            Confirm Plan {plan.id}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
