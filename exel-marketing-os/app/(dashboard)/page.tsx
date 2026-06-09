'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { KPICard } from '@/components/dashboard/KPICard'
import { Header } from '@/components/layout/Header'
import { FilterBar } from '@/components/ui/FilterBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  aggregateKPIs, buildChannelSummaries,
  formatCurrency, formatPercent,
} from '@/lib/calculations'
import { hebrewMonth, monthKey } from '@/lib/utils'
import type { MonthlyRecord, DashboardKPIs, ChannelSummary, Channel } from '@/types'
import {
  DollarSign, Users, CalendarCheck, CheckCircle2, TrendingUp,
  Wallet, ArrowUpRight, AlertTriangle, FileWarning, RefreshCw,
} from 'lucide-react'

export default function ControlCenterPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [channels, setChannels] = useState<Channel[]>([])
  const [records, setRecords] = useState<MonthlyRecord[]>([])
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [summaries, setSummaries] = useState<ChannelSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadChannels() }, [])
  useEffect(() => { loadData() }, [year, month])

  async function loadChannels() {
    const { data } = await createClient().from('channels').select('*').eq('status', 'active').order('name')
    setChannels((data || []) as Channel[])
  }

  async function loadData() {
    setLoading(true)
    const key = monthKey(year, month)
    const { data } = await createClient()
      .from('monthly_marketing_records')
      .select('*, channel:channels(*), campaign:campaigns(*)')
      .eq('month_key', key)

    const recs = (data || []) as MonthlyRecord[]
    setRecords(recs)
    setKpis(aggregateKPIs(recs))
    setSummaries(buildChannelSummaries(recs).sort((a, b) => b.total_spend - a.total_spend))
    setLoading(false)
  }

  const topChannel = summaries[0]
  const worstChannel = summaries.filter(s => s.closings === 0 && s.total_spend > 2000)[0]

  return (
    <div className="min-h-screen">
      <Header
        title="מרכז פיקוד"
        subtitle={`EXEL Marketing OS — ${hebrewMonth(month)} ${year}`}
        actions={
          <div className="flex items-center gap-2">
            <FilterBar
              year={year} month={month} channels={channels}
              onYearChange={setYear} onMonthChange={m => m && setMonth(m)}
            />
            <button onClick={loadData} className="btn-secondary py-1.5 px-3">
              <RefreshCw size={13} />
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* סיכום חודשי */}
            <section>
              <h2 className="section-label mb-4">סיכום חודשי — {hebrewMonth(month)} {year}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <KPICard label="הוצאה כוללת" value={formatCurrency(kpis?.total_spend)} icon={<DollarSign size={15} />} />
                <KPICard label="לידים" value={String(kpis?.total_leads ?? 0)} subValue={`מוכשרים: ${kpis?.qualified_leads ?? 0}`} icon={<Users size={15} />} />
                <KPICard label="פגישות משרד" value={String(kpis?.office_meetings ?? 0)} icon={<CalendarCheck size={15} />} />
                <KPICard
                  label="עסקאות סגורות"
                  value={String(kpis?.closed_deals ?? 0)}
                  icon={<CheckCircle2 size={15} />}
                  status={(kpis?.closed_deals ?? 0) > 0 ? 'good' : 'neutral'}
                />
                <KPICard label="עלות ליד (CPL)" value={formatCurrency(kpis?.cost_per_lead)} icon={<TrendingUp size={15} />} />
                <KPICard label="עלות פגישה" value={formatCurrency(kpis?.cost_per_meeting)} icon={<TrendingUp size={15} />} />
                <KPICard label="עלות סגירה" value={formatCurrency(kpis?.cost_per_closing)} icon={<Wallet size={15} />} />
                <KPICard
                  label="הכנסות"
                  value={formatCurrency(kpis?.actual_revenue)}
                  icon={<ArrowUpRight size={15} />}
                  status={(kpis?.actual_revenue ?? 0) > 0 ? 'good' : 'neutral'}
                />
                <KPICard
                  label="רווח אחרי הוצאות"
                  value={formatCurrency(kpis?.profit_after_spend)}
                  status={(kpis?.profit_after_spend ?? 0) > 0 ? 'good' : 'bad'}
                />
                <KPICard
                  label="ROI"
                  value={formatPercent(kpis?.roi)}
                  status={kpis?.roi != null ? (kpis.roi > 0 ? 'good' : 'bad') : 'neutral'}
                />
                <KPICard
                  label="חשבוניות חסרות"
                  value={String(kpis?.missing_invoices ?? 0)}
                  icon={<FileWarning size={15} />}
                  status={(kpis?.missing_invoices ?? 0) > 0 ? 'bad' : 'good'}
                />
                <KPICard label="ליד → פגישה" value={formatPercent(kpis?.lead_to_meeting_rate)} />
              </div>
            </section>

            {/* גריד תחתון */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ביצועי ערוצים */}
              <div className="lg:col-span-2 card">
                <div className="card-header">
                  <h2 className="section-title">ביצועי ערוצים</h2>
                  <a href="/channels" className="text-xs text-brand-600 hover:underline">הצג הכל</a>
                </div>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ערוץ</th>
                        <th>הוצאה</th>
                        <th>לידים</th>
                        <th>פגישות</th>
                        <th>סגירות</th>
                        <th>ROI</th>
                        <th>המלצה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaries.length === 0 ? (
                        <tr><td colSpan={7} className="text-center text-gray-400 py-10">אין נתונים לחודש זה</td></tr>
                      ) : summaries.map(ch => (
                        <tr key={ch.channel_id}>
                          <td className="font-medium text-gray-900">{ch.channel_name}</td>
                          <td>{formatCurrency(ch.total_spend)}</td>
                          <td>{ch.leads}</td>
                          <td>{ch.meetings}</td>
                          <td className="font-semibold">{ch.closings}</td>
                          <td className={ch.roi != null ? (ch.roi > 0 ? 'text-green-600 font-medium' : 'text-red-500') : ''}>
                            {formatPercent(ch.roi)}
                          </td>
                          <td>
                            <StatusBadge
                              variant={
                                ch.recommendation === 'הגדל תקציב' ? 'ok' :
                                ch.recommendation.includes('עצור') ? 'blocked' :
                                'review'
                              }
                            >
                              {ch.recommendation}
                            </StatusBadge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* פנל ימין */}
              <div className="space-y-4">
                {/* דגלים אדומים */}
                {((kpis?.missing_invoices ?? 0) > 0 ||
                  summaries.some(c => c.total_spend > 3000 && c.closings === 0)) && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={16} className="text-red-600" />
                      <h3 className="font-semibold text-red-900">דגלים אדומים</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-red-700">
                      {(kpis?.missing_invoices ?? 0) > 0 && (
                        <li className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />{kpis?.missing_invoices} חשבוניות חסרות</li>
                      )}
                      {summaries.filter(c => c.total_spend > 3000 && c.closings === 0).map(c => (
                        <li key={c.channel_id} className="flex gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                          {c.channel_name}: הוצאה גבוהה ללא סגירות
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* יחסי המרה */}
                <div className="card">
                  <div className="card-header"><h3 className="section-title">יחסי המרה</h3></div>
                  <div className="card-body space-y-3">
                    {[
                      { label: 'ליד → פגישה', value: formatPercent(kpis?.lead_to_meeting_rate) },
                      { label: 'פגישה → סגירה', value: formatPercent(kpis?.meeting_to_closing_rate) },
                      { label: 'ליד → סגירה', value: formatPercent(kpis?.lead_to_closing_rate) },
                      { label: 'ROAS', value: kpis?.roas != null ? `${kpis.roas.toFixed(2)}x` : '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* המלצות ניהול */}
                <div className="card">
                  <div className="card-header"><h3 className="section-title">המלצות ניהול</h3></div>
                  <div className="card-body">
                    {records.length === 0 ? (
                      <p className="text-sm text-gray-400">אין נתונים. הוסף רשומות בלשונית נתוני פרסום.</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {summaries.filter(c => c.recommendation === 'הגדל תקציב').map(c => (
                          <li key={c.channel_id} className="flex items-start gap-2.5 text-sm">
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">↑</span>
                            <span><strong>{c.channel_name}</strong> — הגדל תקציב</span>
                          </li>
                        ))}
                        {summaries.filter(c => c.recommendation.includes('עצור')).map(c => (
                          <li key={c.channel_id} className="flex items-start gap-2.5 text-sm">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">×</span>
                            <span><strong>{c.channel_name}</strong> — {c.recommendation}</span>
                          </li>
                        ))}
                        {summaries.filter(c => c.recommendation.includes('בדיקה')).map(c => (
                          <li key={c.channel_id} className="flex items-start gap-2.5 text-sm">
                            <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">!</span>
                            <span><strong>{c.channel_name}</strong> — {c.recommendation}</span>
                          </li>
                        ))}
                        {summaries.every(c => !['הגדל תקציב'].includes(c.recommendation)) &&
                          summaries.filter(c => c.recommendation.includes('עצור')).length === 0 &&
                          summaries.filter(c => c.recommendation.includes('בדיקה')).length === 0 && (
                            <li className="text-sm text-gray-400">כל הערוצים במצב סביר</li>
                          )}
                      </ul>
                    )}
                  </div>
                </div>

                {/* מידע על ערוץ מוביל / כושל */}
                {(topChannel || worstChannel) && (
                  <div className="card">
                    <div className="card-header"><h3 className="section-title">ספוטלייט</h3></div>
                    <div className="card-body space-y-3 text-sm">
                      {topChannel && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">ערוץ מוביל</span>
                          <span className="font-semibold text-green-700">{topChannel.channel_name}</span>
                        </div>
                      )}
                      {worstChannel && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">ערוץ בעייתי</span>
                          <span className="font-semibold text-red-600">{worstChannel.channel_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
