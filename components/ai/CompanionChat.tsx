'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message { role: 'user' | 'assistant'; content: string; flagged?: boolean }

export function CompanionChat() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi! I'm your Vida companion. I'm here to listen, support, and help you understand your wellness patterns. What's on your mind today?",
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, conversationId }) })
      const json = await res.json()
      if (json.data) {
        if (json.data.conversationId) setConversationId(json.data.conversationId)
        setMessages((prev) => [...prev, { role: 'assistant', content: json.data.content, flagged: json.data.flagged }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: "I'm sorry, I couldn't connect right now. Please try again." }])
    } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user' ? 'bg-[#5a8a6b] text-white rounded-br-sm'
              : msg.flagged ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-sm'
              : 'bg-white border border-[#e2d9d0] text-[#2d3748] rounded-bl-sm')}>
              {msg.flagged && <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Important safety information</p>}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#e2d9d0] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5">
                {[0,1,2].map((i) => <span key={i} className="w-2 h-2 bg-[#5a8a6b] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-[#e2d9d0]">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share what's on your mind…" className="flex-1" disabled={loading} />
        <Button type="submit" size="icon" disabled={loading || !input.trim()}><Send size={18} /></Button>
      </form>
    </div>
  )
}
