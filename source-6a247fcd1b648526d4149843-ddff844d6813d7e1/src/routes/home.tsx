import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Train, ArrowRight, Lightbulb, AlertCircle, ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/home')({
  component: Home,
})

const EXAMPLES = [
  'Patna to Delhi by Friday 8 AM under ₹1500',
  'Mumbai to Pune by 5 PM under ₹500',
  'Chennai to Bangalore tomorrow morning under ₹800',
  'Kolkata to Varanasi Sunday evening under ₹1200',
]

function Home() {
  const [goal, setGoal] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = goal.trim()

    if (!trimmed) {
      setError('Please enter your travel goal.')
      return
    }
    if (!trimmed.toLowerCase().includes(' to ')) {
      setError('Please enter both source and destination (e.g. "Patna to Delhi").')
      return
    }

    setError('')
    navigate({ to: '/plans', search: { goal: trimmed } })
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #001f4d 0%, #003580 40%, #1e40af 100%)' }}>
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center">
            <Train className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wider">IRCTC</span>
        </div>
        <Link to="/help" className="text-white/70 hover:text-white text-sm transition-colors">Help</Link>
      </header>

      {/* Main card */}
      <main className="flex items-start justify-center px-4 pt-8 pb-16">
        <div className="w-full max-w-lg">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              AI Journey Assurance
            </h1>
            <p className="text-blue-200 text-base">
              Describe your travel goal and we'll build your perfect plan.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <form onSubmit={handleSubmit}>
              <label className="block text-slate-700 font-semibold text-sm mb-2">
                Where do you need to go?
              </label>
              <div className="relative">
                <textarea
                  value={goal}
                  onChange={(e) => { setGoal(e.target.value); setError('') }}
                  placeholder="E.g. Reach Delhi by Friday 8 AM under ₹1500"
                  rows={3}
                  className="w-full rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none px-4 py-3 text-slate-800 text-base resize-none transition-colors placeholder:text-slate-400"
                  style={{ fontFamily: 'inherit' }}
                />
              </div>

              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold text-base py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-200"
              >
                <Train className="w-5 h-5" />
                Plan My Journey
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Examples */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Try an example</span>
              </div>
              <div className="flex flex-col gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => { setGoal(ex); setError('') }}
                    className="text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl px-3 py-2 transition-colors border border-transparent hover:border-blue-100"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-blue-300/80 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              Live train data
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              4 backup plans
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              Tatkal fallback
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
