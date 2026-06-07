import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Train, ChevronLeft, Clock, MapPin, IndianRupee, Zap, Trophy, Star, AlertTriangle, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react'
import type { JourneyData, JourneyPlan } from '@/lib/journey-types'

export const Route = createFileRoute('/plans')({
  validateSearch: (search: Record<string, unknown>) => ({
    goal: String(search.goal ?? ''),
  }),
  component: Plans,
})

const PLAN_STYLES: Record<string, { border: string; bg: string; badge: string; badgeBg: string; accent: string; icon: React.ElementType }> = {
  A: { border: 'border-t-4 border-t-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-800', badgeBg: 'bg-emerald-500', accent: 'text-emerald-700', icon: Trophy },
  B: { border: 'border-t-4 border-t-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800', badgeBg: 'bg-blue-500', accent: 'text-blue-700', icon: Star },
  C: { border: 'border-t-4 border-t-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800', badgeBg: 'bg-amber-500', accent: 'text-amber-700', icon: IndianRupee },
  D: { border: 'border-t-4 border-t-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-800', badgeBg: 'bg-purple-500', accent: 'text-purple-700', icon: Zap },
}

function SuccessBar({ chance }: { chance: number }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { setTimeout(() => setWidth(chance), 100) }, [chance])
  const color = chance >= 90 ? 'bg-emerald-500' : chance >= 75 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-slate-500">Success Probability</span>
        <span className={chance >= 90 ? 'text-emerald-600' : chance >= 75 ? 'text-amber-600' : 'text-red-600'}>{chance}%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full success-bar-fill ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

function PlanCard({ plan, onSelect, index }: { plan: JourneyPlan; onSelect: () => void; index: number }) {
  const style = PLAN_STYLES[plan.id] || PLAN_STYLES.A
  const IconComp = style.icon

  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden animate-slide-up ${style.border}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card header */}
      <div className={`px-5 py-3 flex items-center justify-between ${style.bg}`}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${style.badgeBg} flex items-center justify-center`}>
            <IconComp className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black text-slate-800 text-base">Plan {plan.id}</span>
            <span className={`ml-2 text-xs font-semibold ${style.accent}`}>{plan.label}</span>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.badge}`}>
          {plan.badge}
        </span>
      </div>

      {/* Train info */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-slate-800 text-base leading-tight">{plan.trainName}</p>
            <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
              <Train className="w-3 h-3" />
              #{plan.trainNumber} · {plan.classLabel}
            </p>
          </div>
          {plan.isTatkal && (
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" /> Tatkal
            </span>
          )}
          {plan.isBestChoice && (
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Best
            </span>
          )}
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-3 bg-slate-50 rounded-xl p-3">
          <div className="text-center flex-1 min-w-0">
            <p className="font-black text-slate-800 text-lg leading-none">{plan.from.time}</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{plan.from.code}</p>
            <p className="text-xs text-slate-400 truncate">{plan.from.date}</p>
          </div>
          <div className="flex flex-col items-center flex-shrink-0 px-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <div className="w-10 h-px bg-slate-300"></div>
              <Train className="w-4 h-4 text-slate-400" />
              <div className="w-10 h-px bg-slate-300"></div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">{plan.duration}</p>
          </div>
          <div className="text-center flex-1 min-w-0">
            <p className="font-black text-slate-800 text-lg leading-none">{plan.to.time}</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{plan.to.code}</p>
            <p className="text-xs text-slate-400 truncate">{plan.to.date}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-3 text-sm">
          <div className="flex items-center gap-1 text-slate-600">
            <IndianRupee className="w-3.5 h-3.5" />
            <span className="font-bold">₹{plan.fare.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3.5 h-3.5" />
            <span>{plan.distance}</span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <span>{plan.availableSeats} seats left</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {plan.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>

        <SuccessBar chance={plan.successChance} />
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 flex gap-2">
        <Link
          to="/plan/$planId"
          params={{ planId: plan.id }}
          search={(s) => s}
          className="flex-1 text-center text-sm font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl py-2.5 transition-colors"
        >
          Details
        </Link>
        <button
          onClick={onSelect}
          className={`flex-[2] flex items-center justify-center gap-1.5 text-white font-bold text-sm rounded-xl py-2.5 transition-all hover:opacity-90 active:scale-98 ${style.badgeBg}`}
        >
          Select Plan {plan.id}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-200 rounded-lg"></div>
              <div className="w-24 h-5 bg-slate-200 rounded"></div>
            </div>
            <div className="w-20 h-5 bg-slate-200 rounded-full"></div>
          </div>
          <div className="w-48 h-5 bg-slate-200 rounded mb-2"></div>
          <div className="w-32 h-4 bg-slate-100 rounded mb-4"></div>
          <div className="h-14 bg-slate-100 rounded-xl mb-3"></div>
          <div className="h-4 bg-slate-100 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  )
}

function Plans() {
  const { goal } = Route.useSearch()
  const navigate = useNavigate()
  const [data, setData] = useState<JourneyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!goal) {
      navigate({ to: '/home' })
      return
    }

    // Check cache
    const cached = sessionStorage.getItem('journeyData')
    if (cached) {
      try {
        const parsed: JourneyData = JSON.parse(cached)
        if (parsed.goal === goal) {
          setData(parsed)
          setLoading(false)
          return
        }
      } catch { /* ignore */ }
    }

    // Fetch from API
    setLoading(true)
    fetch('/api/journey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    })
      .then((r) => r.json())
      .then((d: JourneyData) => {
        sessionStorage.setItem('journeyData', JSON.stringify(d))
        setData(d)
      })
      .catch(() => setError('Could not generate plans. Please try again.'))
      .finally(() => setLoading(false))
  }, [goal, navigate])

  const handleSelect = (plan: JourneyPlan) => {
    sessionStorage.setItem('selectedPlan', plan.id)
    navigate({ to: '/review', search: { planId: plan.id, goal } })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #001f4d 0%, #003580 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/home" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm">
              <ChevronLeft className="w-4 h-4" />
              New Goal
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <Train className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold text-sm">Journey Assurance</span>
            </div>
            <Link to="/help" className="text-white/70 hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </Link>
          </div>

          {/* Goal summary */}
          <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 mb-4">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Your goal</p>
            <p className="text-white font-semibold text-sm leading-snug">"{goal}"</p>
            {data && (
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-blue-200">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{data.parsedGoal.from} → {data.parsedGoal.to}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />By {data.parsedGoal.deadline}</span>
                <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />Budget ₹{data.parsedGoal.budget.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          {data && (
            <div className="flex items-center gap-4 pb-4 text-xs text-blue-200">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" />AI responded in {data.responseMs}ms</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" />{data.plans.length} plans generated</span>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 pb-4 text-blue-200 text-sm">
              <span>Planning your journey</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 loading-dot"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 loading-dot"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 loading-dot"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading && <LoadingSkeleton />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-700 font-semibold">{error}</p>
            <Link to="/home" className="mt-3 inline-block text-red-600 hover:text-red-800 text-sm font-medium underline">
              Try again
            </Link>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-slate-800">Your Journey Plans</h2>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Select any plan</span>
            </div>
            {data.plans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} onSelect={() => handleSelect(plan)} />
            ))}

            {/* Metrics callout */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-2">
              <p className="text-blue-800 font-bold text-sm mb-2">Demo Metrics</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <p className="text-xl font-black text-blue-800">{data.responseMs}ms</p>
                  <p className="text-blue-500">AI Response</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <p className="text-xl font-black text-emerald-700">~8 min</p>
                  <p className="text-blue-500">Time Saved vs Manual</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
