'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/calculations'
import { hebrewMonth, monthKey } from '@/lib/utils'
import { YEARS } from '@/lib/constants'
import type { Budget, Channel } from '@/types'
import { Plus } from 'lucide-react'

export default function BudgetPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [channels, setChannels] = useState<Channel[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [actuals, setActuals] = useState<Record<string, number>>({})
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ channel_id: '', planned_budget: 0, planned_leads: 0, planned_meetings: 0, planned_closings: 0, target_cpl: 0, target_cost_per_meeting: 0, target_cost_per_closing: 0, notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    createClient().from('channels').select('*').order('name').then(({ data }) => setChannels((data || []) as Channel[]))
  }, [])
  useEffect(() => { loadData() }, [year, month])

  async function loadData() {
    const key = monthKey(year, month)
    const [budgetRes, actualRes] = await Promise.all([
      createClient().from('budgets').select('*, channel:channels(*)').eq('month_key', key),
      createClient().from('monthly_marketing_records').select('channel_id, net_spend').eq('month_key', key),
    ])
    setBudgets((budgetRes.data || []) as Budget[])
    const acc: Record<string, number> = {}
    for (const r of (actualRes.data || []) as { channel_id: string; net_spend: number }[]) {
      acc[r.channel_id] = (acc[r.channel_id] || 0) + (r.net_spend || 0)
    }
    setActuals(acc)
  }

  async function handleSave() {
    setSaving(true)
    const key = monthKey(year, month)
    await createClient().from('budgets').upsert({ ...form, year, month, month_key: key }, { onConflict: 'year,month,channel_id' })
    setSaving(false)
    setShowForm(false)
    setForm({ channel_id: '', planned_budget: 0, planned_leads: 0, planned_meetings: 0, planned_closings: 0, target_cpl: 0, target_cost_per_meeting: 0, target_cost_per_closing: 0, notes: '' })
    loadData()
  }

  const getBudgetStatus = (planned: number, actual: number) => {
    if (planned === 0) return 'neutral'
    const ratio = actual / planned
    if (ratio <= 1) return 'ok'
    if (ratio <= 1.15) return 'review'
    return 'blocked'
  }

  const getBudgetLabel = (planned: number, actual: number) => {
    if (planned === 0) return 'אין תקציב'
    const ratio = actual / planned
    if (ratio < 0.9) return 'מתחת תקציב'
    if (ratio <= 1) return 'במסלול'
    if (ratio <= 1.15) return 'קרוב לגבול'
    return 'חריגה!'
  }

  return (
    <div className="min-h-screen">
      <Header
        title="תקציב מול ביצוע"
        subtitle="תכנון תקציב מול הוצאה בפועל"
        actions={
          <div className="flex items-center gap-2">
            <select value={year} onChange={e => setYear(Number(e.target.value))} className="input-field w-auto text-sm py-1.5">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={month} onChange={e => setMonth(Number(e.target.value))} className="input-field w-auto text-sm py-1.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{hebrewMonth(m)}</option>)}
            </select>
            <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={14} /> הוסף תקציב</button>
          </div>
        }
      />

      <div className="p-6">
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-6">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold">הגדרת תקציב</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ערוץ</label>
                  <select value={form.channel_id} onChange={e => setForm(p => ({ ...p, channel_id: e.target.value }))} className="input-field">
                    <option value="">בחר ערוץ</option>
                    {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'planned_budget', label: 'תקציב מתוכנן' },
                    { key: 'planned_leads', label: 'לידים מתוכננים' },
                    { key: 'planned_meetings', label: 'פגישות מתוכננות' },
                    { key: 'planned_closings', label: 'סגירות מתוכננות' },
                    { key: 'target_cpl', label: 'יעד CPL' },
                    { key: 'target_cost_per_closing', label: 'יעד עלות סגירה' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                      <input type="number" value={(form as Record<string, unknown>)[key] as number} onChange={e => setForm(p => ({ ...p, [key]: Number(e.target.value) }))} className="input-field" min="0" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="btn-secondary">בטל</button>
                <button onClick={handleSave} className="btn-primary" disabled={saving}>{saving ? 'שומר...' : 'שמור'}</button>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2 className="section-title">תקציב מול ביצוע — {hebrewMonth(month)} {year}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ערוץ</th>
                  <th>תקציב מתוכנן</th>
                  <th>הוצאה בפועל</th>
                  <th>סטייה</th>
                  <th>אחוזה</th>
                  <th>לידים מתוכננים</th>
                  <th>סגירות מתוכננות</th>
                  <th>סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {budgets.length === 0 ? (
                  <tr><td colSpan={8} className="text-center text-gray-400 py-12">אין תקציבות. לחץ "הוסף תקציב" להתחלת הקלט.</td></tr>
                ) : budgets.map(b => {
                  const actual = actuals[b.channel_id] || 0
                  const variance = actual - b.planned_budget
                  const pct = b.planned_budget > 0 ? (actual / b.planned_budget) * 100 : 0
                  return (
                    <tr key={b.id}>
                      <td className="font-medium">{b.channel?.name || '—'}</td>
                      <td>{formatCurrency(b.planned_budget)}</td>
                      <td className="font-semibold">{formatCurrency(actual)}</td>
                      <td className={variance > 0 ? 'text-red-500' : 'text-green-600'}>
                        {variance > 0 ? '+' : ''}{formatCurrency(variance)}
                      </td>
                      <td className={pct > 115 ? 'text-red-500 font-bold' : ''}>{pct.toFixed(0)}%</td>
                      <td>{b.planned_leads}</td>
                      <td>{b.planned_closings}</td>
                      <td>
                        <StatusBadge variant={getBudgetStatus(b.planned_budget, actual) as 'ok' | 'review' | 'blocked' | 'neutral'}>
                          {getBudgetLabel(b.planned_budget, actual)}
                        </StatusBadge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
