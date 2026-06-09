'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { FilterBar } from '@/components/ui/FilterBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { buildChannelSummaries, formatCurrency, formatPercent } from '@/lib/calculations'
import { hebrewMonth, monthKey } from '@/lib/utils'
import type { MonthlyRecord, ChannelSummary, Channel } from '@/types'

export default function ChannelsPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [channels, setChannels] = useState<Channel[]>([])
  const [summaries, setSummaries] = useState<ChannelSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadChannels() }, [])
  useEffect(() => { loadData() }, [year, month])

  async function loadChannels() {
    const { data } = await createClient().from('channels').select('*').order('name')
    setChannels((data || []) as Channel[])
  }

  async function loadData() {
    setLoading(true)
    const key = monthKey(year, month)
    const { data } = await createClient()
      .from('monthly_marketing_records')
      .select('*, channel:channels(*)')
      .eq('month_key', key)
    const recs = (data || []) as MonthlyRecord[]
    setSummaries(buildChannelSummaries(recs).sort((a, b) => b.total_spend - a.total_spend))
    setLoading(false)
  }

  const totalSpend = summaries.reduce((s, c) => s + c.total_spend, 0)

  return (
    <div className="min-h-screen">
      <Header
        title="ביצועי ערוצים"
        subtitle="נתוני ביצוע לפי ערוץ פרסום"
        actions={
          <FilterBar year={year} month={month} channels={channels}
            onYearChange={setYear} onMonthChange={m => m && setMonth(m)} />
        }
      />

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* KPI סיכום */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="kpi-card"><p className="section-label mb-2">ערוצים פעילים</p><p className="text-2xl font-bold">{summaries.length}</p></div>
              <div className="kpi-card"><p className="section-label mb-2">הוצאה כוללת</p><p className="text-2xl font-bold">{formatCurrency(totalSpend)}</p></div>
              <div className="kpi-card border-green-200 bg-green-50/30"><p className="section-label mb-2">להגדלה</p><p className="text-2xl font-bold text-green-700">{summaries.filter(c => c.recommendation === 'הגדל תקציב').length}</p></div>
              <div className="kpi-card border-red-200 bg-red-50/30"><p className="section-label mb-2">לעצירה</p><p className="text-2xl font-bold text-red-700">{summaries.filter(c => c.recommendation.includes('עצור')).length}</p></div>
            </div>

            {/* טבלת ערוצים */}
            <div className="card">
              <div className="card-header">
                <h2 className="section-title">ערוץ פרסום — {hebrewMonth(month)} {year}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ערוץ</th>
                      <th>הוצאה</th>
                      <th>% מהסה&quot;כ</th>
                      <th>לידים</th>
                      <th>לידים מוכשרים</th>
                      <th>פגישות</th>
                      <th>סגירות</th>
                      <th>CPL</th>
                      <th>עלות פגישה</th>
                      <th>עלות סגירה</th>
                      <th>ROI</th>
                      <th>המלצה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaries.length === 0 ? (
                      <tr><td colSpan={12} className="text-center text-gray-400 py-12">אין נתונים לחודש זה</td></tr>
                    ) : summaries.map(ch => (
                      <tr key={ch.channel_id}>
                        <td className="font-semibold text-gray-900">{ch.channel_name}</td>
                        <td className="font-medium">{formatCurrency(ch.total_spend)}</td>
                        <td className="text-gray-500">
                          {totalSpend > 0 ? `${((ch.total_spend / totalSpend) * 100).toFixed(1)}%` : '—'}
                        </td>
                        <td>{ch.leads}</td>
                        <td>{ch.qualified_leads}</td>
                        <td>{ch.meetings}</td>
                        <td className="font-semibold">{ch.closings}</td>
                        <td>{formatCurrency(ch.cpl)}</td>
                        <td>{formatCurrency(ch.cost_per_meeting)}</td>
                        <td>{formatCurrency(ch.cost_per_closing)}</td>
                        <td className={ch.roi != null ? (ch.roi > 0 ? 'text-green-600 font-medium' : 'text-red-500') : ''}>
                          {formatPercent(ch.roi)}
                        </td>
                        <td>
                          <StatusBadge variant={
                            ch.recommendation === 'הגדל תקציב' ? 'ok' :
                            ch.recommendation.includes('עצור') ? 'blocked' :
                            ch.recommendation === 'המשך לעקוב' ? 'neutral' : 'review'
                          }>
                            {ch.recommendation}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* כרטיסי ערוץ */}
            {summaries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {summaries.map(ch => (
                  <div key={ch.channel_id} className="card">
                    <div className="card-header">
                      <h3 className="font-semibold">{ch.channel_name}</h3>
                      <StatusBadge variant={
                        ch.recommendation === 'הגדל תקציב' ? 'ok' :
                        ch.recommendation.includes('עצור') ? 'blocked' : 'review'
                      }>
                        {ch.recommendation}
                      </StatusBadge>
                    </div>
                    <div className="card-body">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { l: 'הוצאה', v: formatCurrency(ch.total_spend) },
                          { l: 'לידים', v: String(ch.leads) },
                          { l: 'פגישות', v: String(ch.meetings) },
                          { l: 'סגירות', v: String(ch.closings) },
                          { l: 'CPL', v: formatCurrency(ch.cpl) },
                          { l: 'ROI', v: formatPercent(ch.roi) },
                        ].map(({ l, v }) => (
                          <div key={l} className="text-sm">
                            <span className="text-gray-400 block text-xs">{l}</span>
                            <span className="font-semibold text-gray-900">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
