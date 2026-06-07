import { useState, useRef, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Send, Train, ChevronLeft, HelpCircle, Square } from 'lucide-react'
import { useAIChat } from '@/lib/ai-hook'

export const Route = createFileRoute('/help')({
  component: Help,
})

const QUICK_QUESTIONS = [
  'How does Tatkal booking work?',
  'What is quota booking in IRCTC?',
  'How to check PNR status?',
  'What classes are available on Rajdhani?',
  'Can I cancel a Tatkal ticket?',
]

function Help() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, stop } = useAIChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #001f4d 0%, #003580 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/home" className="text-white/70 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                <Train className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">IRCTC Help</p>
                <p className="text-blue-300 text-xs">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-emerald-300 text-xs font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-1">IRCTC Help</h2>
              <p className="text-slate-500 text-sm mb-6">Ask anything about Indian Railways travel</p>

              <div className="grid gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl px-4 py-2.5 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Train className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md text-sm rounded-2xl px-4 py-2.5 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-md'
                }`}
              >
                {message.parts.map((part, i) => (
                  part.type === 'text' && part.content
                    ? <p key={i} className="leading-relaxed whitespace-pre-wrap">{part.content}</p>
                    : null
                ))}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                <Train className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300 loading-dot"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300 loading-dot"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300 loading-dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 py-3 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-2">
          {isLoading && (
            <button
              onClick={stop}
              className="px-3 py-2 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask about IRCTC, trains, booking…"
            className="flex-1 rounded-xl border border-slate-200 focus:border-blue-400 focus:outline-none px-4 py-2.5 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
