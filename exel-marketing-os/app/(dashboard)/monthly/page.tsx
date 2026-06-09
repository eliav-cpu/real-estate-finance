'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { buildMonthlySnapshots, formatCurrency, formatPercent } from '@/lib/calculations'
import { YEARS } from '@/lib/constants'
import type { MonthlyRecord, MonthlySnapshot } from '@/types'

export default function MonthlyPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [year])

  async function loadData() {
    setLoading(true)
    const { data } = await createClient()
      .from('monthly_marketing_records')
      .select('*, channel:channels(*)')
      .eq('year', year)
    const recs = (data || []) as MonthlyRecord[]
    setSnapshots(buildMonthlySnapshots(recs, year))
    setLoading(false)
  }

  const prev = (i: number) => snapshots[i - 1]
  const trend = (curr: number, prevVal: number | null, lowerBetter = false) => {
    if (prevVal === null || prevVal === 0) return ''
    const diff = curr - prevVal
    if (diff === 0) return ''
    const up = diff > 0
    const good = lowerBetter ? !up : up
    return good
      ? <span className="text-green-600 text-xs">↑</span>
      : <span className="text-red-500 text-xs">↓</span>
  }

  return (
    <div className="min-h-screen">
      <Header
        title="מגמה חודשית"
        subtitle="השוואת ביצועים מחודש לחודש"
        actions={
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="input-field w-auto text-sm py-1.5">
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        }
      />

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <div className="card-header">
              <h2 className="section-title">סיכום שנתי — {year}</h2>
            </div>
            <table className="data-table" style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th>חודש</th>
                  <th>הוצאה</th>
                  <th>לידים</th>
                  <th>פגישות</th>
                  <th>סגירות</th>
                  <th>הכנסות</th>
                  <th>CPL</th>
                  <th>ROI</th>
                  <th>ערוץ מוביל</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((s, i) => {
                  const p = prev(i)
                  const isEmpty = s.total_spend === 0 && s.leads === 0
                  return (
                    <tr key={s.month_key} className={isEmpty ? 'opacity-40' : ''}>
                      <td className="font-semibold text-gray-900">{s.month_name}</td>
                      <td>
                        <span className="font-medium">{formatCurrency(s.total_spend)}</span>
                        {p && trend(s.total_spend, p.total_spend)}
                      </td>
                      <td>
                        {s.leads}
                        {p && trend(s.leads, p.leads)}
                      </td>
                      <td>
                        {s.office_meetings}
                        {p && trend(s.office_meetings, p.office_meetings)}
                      </td>
                      <td className="font-semibold">
                        {s.closed_deals}
                        {p && trend(s.closed_deals, p.closed_deals)}
                      </td>
                      <td className={s.actual_revenue > 0 ? 'text-green-700 font-medium' : ''}>
                        {formatCurrency(s.actual_revenue)}
                      </td>
                      <td>{formatCurrency(s.cpl)}</td>
                      <td className={s.roi != null ? (s.roi > 0 ? 'text-green-600 font-medium' : 'text-red-500') : ''}>
                        {formatPercent(s.roi)}
                      </td>
                      <td className="text-gray-500">{s.best_channel || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-3">סה&quot;כ</td>
                  <td className="px-4 py-3">{formatCurrency(snapshots.reduce((s, r) => s + r.total_spend, 0))}</td>
                  <td className="px-4 py-3">{snapshots.reduce((s, r) => s + r.leads, 0)}</td>
                  <td className="px-4 py-3">{snapshots.reduce((s, r) => s + r.office_meetings, 0)}</td>
                  <td className="px-4 py-3">{snapshots.reduce((s, r) => s + r.closed_deals, 0)}</td>
                  <td className="px-4 py-3">{formatCurrency(snapshots.reduce((s, r) => s + r.actual_revenue, 0))}</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
