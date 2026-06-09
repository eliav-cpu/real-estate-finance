'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { FilterBar } from '@/components/ui/FilterBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/calculations'
import { hebrewMonth, monthKey } from '@/lib/utils'
import type { MonthlyRecord, Channel } from '@/types'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

type QAIssue = {
  id: string
  record_id: string
  channel_name: string
  issue: string
  severity: 'error' | 'warning'
}

export default function QAPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [channels, setChannels] = useState<Channel[]>([])
  const [issues, setIssues] = useState<QAIssue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient().from('channels').select('*').order('name').then(({ data }) => setChannels((data || []) as Channel[]))
  }, [])
  useEffect(() => { runQA() }, [year, month])

  async function runQA() {
    setLoading(true)
    const key = monthKey(year, month)
    const { data } = await createClient()
      .from('monthly_marketing_records')
      .select('*, channel:channels(*)')
      .eq('month_key', key)

    const recs = (data || []) as MonthlyRecord[]
    const found: QAIssue[] = []

    for (const r of recs) {
      const ch = r.channel?.name || 'ערוץ לא ידוע'

      if (!r.channel_id) found.push({ id: `${r.id}-1`, record_id: r.id, channel_name: ch, issue: 'חסר ערוץ', severity: 'error' })
      if (r.net_spend > 0 && r.invoice_required && r.invoice_status === 'missing')
        found.push({ id: `${r.id}-2`, record_id: r.id, channel_name: ch, issue: `הוצאה ${formatCurrency(r.net_spend)} ללא חשבונית`, severity: 'error' })
      if (r.closed_deals > r.office_meetings_held && r.office_meetings_held > 0)
        found.push({ id: `${r.id}-3`, record_id: r.id, channel_name: ch, issue: `סגירות (${r.closed_deals}) > פגישות (${r.office_meetings_held})`, severity: 'error' })
      if (r.office_meetings_held > r.leads_received && r.leads_received > 0)
        found.push({ id: `${r.id}-4`, record_id: r.id, channel_name: ch, issue: `פגישות (${r.office_meetings_held}) > לידים (${r.leads_received})`, severity: 'warning' })
      if (r.actual_revenue > 0 && r.closed_deals === 0)
        found.push({ id: `${r.id}-5`, record_id: r.id, channel_name: ch, issue: `הכנסות ${formatCurrency(r.actual_revenue)} אך אין סגירות`, severity: 'warning' })
      if (r.net_spend < 0)
        found.push({ id: `${r.id}-6`, record_id: r.id, channel_name: ch, issue: `הוצאה שלילית: ${formatCurrency(r.net_spend)}`, severity: 'error' })
      if (!r.data_owner)
        found.push({ id: `${r.id}-7`, record_id: r.id, channel_name: ch, issue: 'אחראי נתונים חסר', severity: 'warning' })
    }

    setIssues(found)
    setLoading(false)
  }

  const errors = issues.filter(i => i.severity === 'error')
  const warnings = issues.filter(i => i.severity === 'warning')
  const systemStatus = errors.length > 0 ? 'blocked' : warnings.length > 0 ? 'review' : 'ok'

  return (
    <div className="min-h-screen">
      <Header
        title="QA ואיכות נתונים"
        subtitle="בדיקת נתונים וזיהוי בעיות"
        actions={
          <FilterBar year={year} month={month} channels={channels}
            onYearChange={setYear} onMonthChange={m => m && setMonth(m)} />
        }
      />

      <div className="p-6 space-y-5">
        {/* סטטוס המערכת */}
        <div className={`rounded-xl border p-5 flex items-center gap-4 ${
          systemStatus === 'ok' ? 'bg-green-50 border-green-200' :
          systemStatus === 'review' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        }`}>
          {systemStatus === 'ok' && <CheckCircle2 size={24} className="text-green-600" />}
          {systemStatus === 'review' && <AlertTriangle size={24} className="text-yellow-600" />}
          {systemStatus === 'blocked' && <XCircle size={24} className="text-red-600" />}
          <div>
            <h2 className={`font-bold text-lg ${
              systemStatus === 'ok' ? 'text-green-900' :
              systemStatus === 'review' ? 'text-yellow-900' : 'text-red-900'
            }`}>
              {systemStatus === 'ok' && 'סטטוס מערכת: תקין'}
              {systemStatus === 'review' && 'סטטוס מערכת: דרוש בדיקה'}
              {systemStatus === 'blocked' && 'סטטוס מערכת: בעיות קריטיות'}
            </h2>
            <p className="text-sm mt-0.5 opacity-70">{errors.length} שגיאות, {warnings.length} אזהרות &mdash; {hebrewMonth(month)} {year}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="kpi-card border-red-200 bg-red-50/30">
            <p className="section-label mb-2">שגיאות</p>
            <p className="text-3xl font-bold text-red-700">{errors.length}</p>
          </div>
          <div className="kpi-card border-yellow-200 bg-yellow-50/30">
            <p className="section-label mb-2">אזהרות</p>
            <p className="text-3xl font-bold text-yellow-700">{warnings.length}</p>
          </div>
          <div className="kpi-card border-green-200 bg-green-50/30">
            <p className="section-label mb-2">סטטוס כללי</p>
            <p className={`text-xl font-bold ${
              systemStatus === 'ok' ? 'text-green-700' :
              systemStatus === 'review' ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {systemStatus === 'ok' ? 'תקין' : systemStatus === 'review' ? 'לבדיקה' : 'חסום'}
            </p>
          </div>
        </div>

        {issues.length > 0 ? (
          <div className="card">
            <div className="card-header"><h2 className="section-title">רשימת בעיות</h2></div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>רמה</th>
                    <th>ערוץ</th>
                    <th>בעיה מזוהה</th>
                    <th>חומרתה</th>
                    <th>פעולה נדרשת</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue, i) => (
                    <tr key={issue.id}>
                      <td className="text-gray-400 text-xs">{i + 1}</td>
                      <td className="font-medium">{issue.channel_name}</td>
                      <td>{issue.issue}</td>
                      <td>
                        <StatusBadge variant={issue.severity === 'error' ? 'blocked' : 'review'}>
                          {issue.severity === 'error' ? 'שגיאה' : 'אזהרה'}
                        </StatusBadge>
                      </td>
                      <td className="text-sm text-gray-500">
                        {issue.severity === 'error' ? 'טיפול מיידי' : 'בדוק והשלם'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : !loading && (
          <div className="card">
            <div className="card-body text-center py-12">
              <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
              <p className="text-lg font-semibold text-gray-900">כל הנתונים תקינים</p>
              <p className="text-gray-500 mt-1">לא אותרו בעיות בנתונים של {hebrewMonth(month)} {year}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
