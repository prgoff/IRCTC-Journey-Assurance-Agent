import { createFileRoute, Link } from '@tanstack/react-router'
import { Train, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Splash,
})

function Splash() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #001f4d 0%, #003580 50%, #004aad 100%)' }}>
      {/* Header bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <Train className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wider uppercase">IRCTC</span>
        </div>
        <span className="text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-400/30 bg-blue-900/30">
          Beta Preview
        </span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Train graphic */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-900/50 mx-auto">
            <Train className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="mb-3">
          <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase">Welcome to</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Journey<br />
          <span className="text-orange-400">Assurance</span>
        </h1>
        <p className="text-blue-200 text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Tell us your travel goal in plain English. Our AI plans your entire railway journey — with backups.
        </p>

        {/* Example prompt */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-5 py-3 mb-10 max-w-sm mx-auto">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Try saying</p>
          <p className="text-white font-medium text-sm italic">"Reach Delhi by Friday 8 AM under ₹1500"</p>
        </div>

        <Link
          to="/home"
          className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-xl shadow-orange-900/40 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </Link>
      </main>

      {/* Feature highlights */}
      <section className="px-6 py-8 border-t border-white/10">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4">
          {[
            { icon: Zap, label: 'Instant Plans', desc: 'AI response in ~1.2s' },
            { icon: Shield, label: '4 Backup Plans', desc: 'Always a fallback' },
            { icon: Train, label: 'Real Train Data', desc: 'Live IRCTC schedules' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-blue-200" />
              </div>
              <p className="text-white font-semibold text-xs">{label}</p>
              <p className="text-blue-300 text-xs mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 px-6">
        <p className="text-blue-400/60 text-xs">
          Prototype · Demo data used · Not affiliated with official IRCTC
        </p>
      </footer>
    </div>
  )
}
