'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { FilterBar } from '@/components/ui/FilterBar'
import { buildFunnelData, formatCurrency } from '@/lib/calculations'
import { hebrewMonth, monthKey } from '@/lib/utils'
import type { MonthlyRecord, FunnelStage, Channel } from '@/types'
import { AlertTriangle } from 'lucide-react'

export default function FunnelPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [channels, setChannels] = useState<Channel[]>([])
  const [stages, setStages] = useState<FunnelStage[]>([])
  const [totalSpend, setTotalSpend] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient().from('channels').select('*').order('name').then(({ data }) => setChannels((data || []) as Channel[]))
  }, [])

  useEffect(() => { loadData() }, [year, month])

  async function loadData() {
    setLoading(true)
    const key = monthKey(year, month)
    const { data } = await createClient()
      .from('monthly_marketing_records')
      .select('*')
      .eq('month_key', key)
    const recs = (data || []) as MonthlyRecord[]
    setStages(buildFunnelData(recs))
    setTotalSpend(recs.reduce((s, r) => s + (r.net_spend || 0), 0))
    setLoading(false)
  }

  const maxVal = Math.max(...stages.map(s => s.value), 1)

  const diagnostics: string[] = []
  if (stages.length > 0) {
    const leads = stages.find(s => s.label === 'leads')?.value || 0
    const qualified = stages.find(s => s.label === 'qualified')?.value || 0
    const meetings = stages.find(s => s.label === 'meetings')?.value || 0
    const closings = stages.find(s => s.label === 'closings')?.value || 0

    if (leads > 20 && qualified / leads < 0.3) diagnostics.push('לידים גבוהים אבל מיעוטים מוכשרים — בעיית טרגוט')
    if (qualified > 10 && meetings / qualified < 0.15) diagnostics.push('לידים טובים אבל פעירות פגישות נמוכה — שפר פולואו-אפ מכירותי')
    if (meetings > 5 && closings === 0) diagnostics.push('פגישות אבל אין סגירות — בדוק תהליך מכירות / מחיר')
    if (totalSpend > 5000 && leads === 0) diagnostics.push('הוצאה גבוהה ואין לידים — בדק מיידית!')
  }

  return (
    <div className="min-h-screen">
      <Header
        title="משפך שיווקי"
        subtitle="המרה מהוצאות לסגירות"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* משפך */}
            <div className="lg:col-span-2 card">
              <div className="card-header">
                <h2 className="section-title">משפך שיווקי — {hebrewMonth(month)} {year}</h2>
                <span className="text-sm text-gray-500">הוצאה: {formatCurrency(totalSpend)}</span>
              </div>
              <div className="card-body space-y-3">
                {stages.map((stage, i) => (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{stage.hebrewLabel}</span>
                      <div className="flex items-center gap-3">
                        {stage.rateLabel && (
                          <span className="text-xs text-gray-400">המרה: {stage.rateLabel}</span>
                        )}
                        <span className="text-base font-bold text-gray-900">{stage.value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-7 relative overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-3 transition-all"
                        style={{
                          width: `${Math.max((stage.value / maxVal) * 100, stage.value > 0 ? 5 : 0)}%`,
                          background: `hsl(${220 - i * 22}, 80%, ${55 + i * 3}%)`,
                        }}
                      >
                        {stage.value > 0 && (
                          <span className="text-white text-xs font-semibold">{stage.value}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* דיאגנוסטיקה */}
            <div className="space-y-4">
              <div className="card">
                <div className="card-header"><h3 className="section-title">יחסי המרה</h3></div>
                <div className="card-body space-y-3">
                  {stages.filter(s => s.rateLabel).map(s => (
                    <div key={s.label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{s.hebrewLabel}</span>
                      <span className="font-semibold text-gray-900">{s.rateLabel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {diagnostics.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={15} className="text-amber-600" />
                    <h3 className="font-semibold text-amber-900">אבחנות משפך</h3>
                  </div>
                  <ul className="space-y-2">
                    {diagnostics.map((d, i) => (
                      <li key={i} className="flex gap-2 text-sm text-amber-800">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnostics.length === 0 && stages.some(s => s.value > 0) && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <p className="text-sm text-green-800 font-medium">✅ המשפך נראה תקין</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
