'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('פרטי ההתחברות שגויים. בדוק אימייל וסיסמא.')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
          <span className="text-white text-2xl font-bold">EX</span>
        </div>
        <h1 className="text-2xl font-bold text-white">EXEL Marketing OS</h1>
        <p className="text-brand-200 mt-1 text-sm">נדל״ן שנבדק</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">התחברות למערכת</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">סיסמא</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {loading ? 'מתחבר...' : 'כניסה למערכת'}
          </button>
        </form>
      </div>

      <p className="text-center text-brand-300 text-xs mt-6">
        EXEL Marketing OS v2.0 &mdash; הנדל&quot;ן שנבדק
      </p>
    </div>
  )
}
