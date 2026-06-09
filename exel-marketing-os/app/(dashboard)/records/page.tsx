'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { FilterBar } from '@/components/ui/FilterBar'
import { InvoiceStatusBadge, QAStatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/calculations'
import { hebrewMonth, monthKey } from '@/lib/utils'
import type { MonthlyRecord, Channel } from '@/types'
import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react'

type RecordFormState = Omit<typeof EMPTY_FORM, 'invoice_status' | 'payment_status' | 'qa_status'> & {
  invoice_status: MonthlyRecord['invoice_status']
  payment_status: MonthlyRecord['payment_status']
  qa_status: MonthlyRecord['qa_status']
}

const EMPTY_FORM = {
  channel_id: '',
  project_or_offer: '',
  marketing_owner: '',
  sales_owner: '',
  currency: 'ILS',
  gross_spend: 0,
  vat: 0,
  net_spend: 0,
  invoice_required: true,
  invoice_status: 'missing' as const,
  invoice_link: '',
  payment_status: 'pending' as const,
  payment_date: '',
  leads_received: 0,
  qualified_leads: 0,
  whatsapp_conversations: 0,
  calls_made: 0,
  meetings_scheduled: 0,
  office_meetings_held: 0,
  no_shows: 0,
  closed_deals: 0,
  reserved_deals: 0,
  cancelled_deals: 0,
  expected_revenue: 0,
  actual_revenue: 0,
  gross_profit: 0,
  notes: '',
  next_action: '',
  status: 'active',
  data_owner: '',
  qa_status: 'ok' as const,
}

export default function RecordsPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [channels, setChannels] = useState<Channel[]>([])
  const [records, setRecords] = useState<MonthlyRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<RecordFormState>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadChannels() }, [])
  useEffect(() => { loadRecords() }, [year, month])

  async function loadChannels() {
    const { data } = await createClient().from('channels').select('*').eq('status', 'active').order('name')
    setChannels((data || []) as Channel[])
  }

  async function loadRecords() {
    setLoading(true)
    const key = monthKey(year, month)
    const { data } = await createClient()
      .from('monthly_marketing_records')
      .select('*, channel:channels(*)')
      .eq('month_key', key)
      .order('created_at', { ascending: false })
    setRecords((data || []) as MonthlyRecord[])
    setLoading(false)
  }

  function startEdit(rec: MonthlyRecord) {
    setEditId(rec.id)
    setForm({
      channel_id: rec.channel_id,
      project_or_offer: rec.project_or_offer || '',
      marketing_owner: rec.marketing_owner || '',
      sales_owner: rec.sales_owner || '',
      currency: rec.currency,
      gross_spend: rec.gross_spend,
      vat: rec.vat,
      net_spend: rec.net_spend,
      invoice_required: rec.invoice_required,
      invoice_status: rec.invoice_status,
      invoice_link: rec.invoice_link || '',
      payment_status: rec.payment_status,
      payment_date: rec.payment_date || '',
      leads_received: rec.leads_received,
      qualified_leads: rec.qualified_leads,
      whatsapp_conversations: rec.whatsapp_conversations,
      calls_made: rec.calls_made,
      meetings_scheduled: rec.meetings_scheduled,
      office_meetings_held: rec.office_meetings_held,
      no_shows: rec.no_shows,
      closed_deals: rec.closed_deals,
      reserved_deals: rec.reserved_deals,
      cancelled_deals: rec.cancelled_deals,
      expected_revenue: rec.expected_revenue,
      actual_revenue: rec.actual_revenue,
      gross_profit: rec.gross_profit,
      notes: rec.notes || '',
      next_action: rec.next_action || '',
      status: rec.status,
      data_owner: rec.data_owner || '',
      qa_status: rec.qa_status,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    const key = monthKey(year, month)
    const payload = {
      ...form,
      year,
      month,
      month_key: key,
    }
    const supabase = createClient()
    if (editId) {
      await supabase.from('monthly_marketing_records').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editId)
    } else {
      await supabase.from('monthly_marketing_records').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
    setForm({ ...EMPTY_FORM })
    loadRecords()
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק רשומה זו?')) return
    await createClient().from('monthly_marketing_records').delete().eq('id', id)
    loadRecords()
  }

  const f = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="min-h-screen">
      <Header
        title="נתוני פרסום"
        subtitle="טבלת הקלט חודשית — מקור האמת"
        actions={
          <div className="flex items-center gap-2">
            <FilterBar year={year} month={month} channels={channels} onYearChange={setYear} onMonthChange={m => m && setMonth(m)} />
            <button onClick={() => { setEditId(null); setForm({ ...EMPTY_FORM }); setShowForm(true) }} className="btn-primary">
              <Plus size={14} /> הוסף רשומה
            </button>
          </div>
        }
      />

      <div className="p-6">
        {/* טופס */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-6">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold">{editId ? 'עריכת רשומה' : 'הוספת רשומה חדשה'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              <div className="p-6 space-y-5">
                {/* בסיסי */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ערוץ *</label>
                    <select value={form.channel_id} onChange={f('channel_id')} className="input-field" required>
                      <option value="">בחר ערוץ</option>
                      {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">פרויקט / הצעה</label>
                    <input type="text" value={form.project_or_offer} onChange={f('project_or_offer')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">אחראי שיווק</label>
                    <input type="text" value={form.marketing_owner} onChange={f('marketing_owner')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">אחראי מכירות</label>
                    <input type="text" value={form.sales_owner} onChange={f('sales_owner')} className="input-field" />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* הוצאות */}
                <h3 className="font-semibold text-gray-800">הוצאות פרסום</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">הוצאה ברוטו</label>
                    <input type="number" value={form.gross_spend} onChange={f('gross_spend')} className="input-field" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">מעמ</label>
                    <input type="number" value={form.vat} onChange={f('vat')} className="input-field" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">הוצאה נטו</label>
                    <input type="number" value={form.net_spend} onChange={f('net_spend')} className="input-field" min="0" />
                  </div>
                </div>

                {/* חשבונית */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סטטוס חשבונית</label>
                    <select value={form.invoice_status} onChange={f('invoice_status')} className="input-field">
                      <option value="missing">חסרה</option>
                      <option value="uploaded">הועלתה</option>
                      <option value="pending_review">לבדיקה</option>
                      <option value="approved">מאושרת</option>
                      <option value="paid">שולמה</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סטטוס תשלום</label>
                    <select value={form.payment_status} onChange={f('payment_status')} className="input-field">
                      <option value="pending">ממתין</option>
                      <option value="paid">שולם</option>
                      <option value="partial">חלקי</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">קישור לחשבונית (URL)</label>
                    <input type="url" value={form.invoice_link} onChange={f('invoice_link')} className="input-field" dir="ltr" />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* משפך לידים */}
                <h3 className="font-semibold text-gray-800">משפך לידים</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { key: 'leads_received', label: 'לידים' },
                    { key: 'qualified_leads', label: 'לידים מוכשרים' },
                    { key: 'whatsapp_conversations', label: 'וואטסאפ ' },
                    { key: 'calls_made', label: 'שיחות' },
                    { key: 'meetings_scheduled', label: 'פגישות מתוזמנות' },
                    { key: 'office_meetings_held', label: 'פגישות משרד' },
                    { key: 'no_shows', label: 'לא הגיעו' },
                    { key: 'closed_deals', label: 'סגירות' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                      <input type="number" value={(form as Record<string, unknown>)[key] as number} onChange={f(key as keyof typeof EMPTY_FORM)} className="input-field" min="0" />
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100" />

                {/* הכנסות */}
                <h3 className="font-semibold text-gray-800">הכנסות</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">הכנסות צפויה</label>
                    <input type="number" value={form.expected_revenue} onChange={f('expected_revenue')} className="input-field" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">הכנסות בפועל</label>
                    <input type="number" value={form.actual_revenue} onChange={f('actual_revenue')} className="input-field" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">רווח גולמי</label>
                    <input type="number" value={form.gross_profit} onChange={f('gross_profit')} className="input-field" min="0" />
                  </div>
                </div>

                {/* הערות */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">הערות</label>
                    <textarea value={form.notes} onChange={f('notes')} className="input-field h-20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">צעד הבא</label>
                    <textarea value={form.next_action} onChange={f('next_action')} className="input-field h-20 resize-none" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="btn-secondary">בטל</button>
                <button onClick={handleSave} className="btn-primary" disabled={saving}>
                  {saving ? 'שומר...' : 'שמור'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* טבלה */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="section-title">{hebrewMonth(month)} {year}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{records.length} רשומות</p>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ערוץ</th>
                    <th>הוצאה נטו</th>
                    <th>לידים</th>
                    <th>פגישות</th>
                    <th>סגירות</th>
                    <th>חשבונית</th>
                    <th>QA</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={8} className="text-center text-gray-400 py-12">אין רשומות לחודש זה. לחץ "הוסף רשומה" להתחלת הקלט.</td></tr>
                  ) : records.map(rec => (
                    <tr key={rec.id}>
                      <td className="font-medium">{rec.channel?.name || '—'}</td>
                      <td className="font-semibold text-gray-900">{formatCurrency(rec.net_spend)}</td>
                      <td>{rec.leads_received}</td>
                      <td>{rec.office_meetings_held}</td>
                      <td className="font-semibold">{rec.closed_deals}</td>
                      <td><InvoiceStatusBadge status={rec.invoice_status} /></td>
                      <td><QAStatusBadge status={rec.qa_status} /></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(rec)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit2 size={13} className="text-gray-400" />
                          </button>
                          <button onClick={() => handleDelete(rec.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={13} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
