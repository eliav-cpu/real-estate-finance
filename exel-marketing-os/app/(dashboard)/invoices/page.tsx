'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { FilterBar } from '@/components/ui/FilterBar'
import { InvoiceStatusBadge, StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/calculations'
import { hebrewMonth, monthKey, formatDate } from '@/lib/utils'
import type { Invoice, Channel } from '@/types'
import { Plus, Edit2, Trash2, FileText, ExternalLink } from 'lucide-react'

type InvoiceFormState = Omit<typeof EMPTY_FORM, 'invoice_status' | 'payment_status' | 'approval_status'> & {
  invoice_status: Invoice['invoice_status']
  payment_status: Invoice['payment_status']
  approval_status: Invoice['approval_status']
}

const EMPTY_FORM = {
  supplier_name: '',
  channel_id: '',
  invoice_number: '',
  invoice_date: '',
  payment_date: '',
  currency: 'ILS',
  gross_amount: 0,
  vat_amount: 0,
  net_amount: 0,
  payment_method: '',
  paid_by: '',
  invoice_status: 'uploaded' as const,
  payment_status: 'pending' as const,
  file_url: '',
  google_drive_file_id: '',
  related_record_id: '',
  approval_status: 'pending' as const,
  notes: '',
}

export default function InvoicesPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [channels, setChannels] = useState<Channel[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<InvoiceFormState>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadChannels() }, [])
  useEffect(() => { loadInvoices() }, [year, month])

  async function loadChannels() {
    const { data } = await createClient().from('channels').select('*').order('name')
    setChannels((data || []) as Channel[])
  }

  async function loadInvoices() {
    setLoading(true)
    const key = monthKey(year, month)
    const { data } = await createClient()
      .from('invoices')
      .select('*, channel:channels(*)')
      .eq('month_key', key)
      .order('created_at', { ascending: false })
    setInvoices((data || []) as Invoice[])
    setLoading(false)
  }

  function startEdit(inv: Invoice) {
    setEditId(inv.id)
    setForm({
      supplier_name: inv.supplier_name || '',
      channel_id: inv.channel_id || '',
      invoice_number: inv.invoice_number || '',
      invoice_date: inv.invoice_date || '',
      payment_date: inv.payment_date || '',
      currency: inv.currency,
      gross_amount: inv.gross_amount,
      vat_amount: inv.vat_amount,
      net_amount: inv.net_amount,
      payment_method: inv.payment_method || '',
      paid_by: inv.paid_by || '',
      invoice_status: inv.invoice_status,
      payment_status: inv.payment_status,
      file_url: inv.file_url || '',
      google_drive_file_id: inv.google_drive_file_id || '',
      related_record_id: inv.related_record_id || '',
      approval_status: inv.approval_status,
      notes: inv.notes || '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    const key = monthKey(year, month)
    const payload = { ...form, year, month, month_key: key, matching_status: 'pending' }
    const supabase = createClient()
    if (editId) {
      await supabase.from('invoices').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editId)
    } else {
      await supabase.from('invoices').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
    setForm({ ...EMPTY_FORM })
    loadInvoices()
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק חשבונית זו?')) return
    await createClient().from('invoices').delete().eq('id', id)
    loadInvoices()
  }

  const f = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const totalAmount = invoices.reduce((s, i) => s + i.net_amount, 0)
  const missingCount = invoices.filter(i => i.invoice_status === 'missing').length
  const pendingCount = invoices.filter(i => i.payment_status === 'pending').length

  return (
    <div className="min-h-screen">
      <Header
        title="רישום חשבוניות"
        subtitle="ניהול חשבוניות ותשלומים — מקור אמת פיננסי"
        actions={
          <div className="flex items-center gap-2">
            <FilterBar year={year} month={month} channels={channels} onYearChange={setYear} onMonthChange={m => m && setMonth(m)} />
            <button onClick={() => { setEditId(null); setForm({ ...EMPTY_FORM }); setShowForm(true) }} className="btn-primary">
              <Plus size={14} /> הוסף חשבונית
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-5">
        {/* סיכום */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="kpi-card">
            <p className="section-label mb-2">סה&quot;כ חשבוניות</p>
            <p className="text-2xl font-bold">{invoices.length}</p>
          </div>
          <div className="kpi-card">
            <p className="section-label mb-2">סה&quot;כ סכום</p>
            <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
          </div>
          <div className={`kpi-card ${missingCount > 0 ? 'border-red-200 bg-red-50/40' : 'border-green-200 bg-green-50/40'}`}>
            <p className="section-label mb-2">חשבוניות חסרות</p>
            <p className="text-2xl font-bold">{missingCount}</p>
          </div>
          <div className="kpi-card">
            <p className="section-label mb-2">בהמתנת תשלום</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
        </div>

        {/* טופס */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold">{editId ? 'עריכת חשבונית' : 'הוספת חשבונית'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ספק / פלטפורמה</label>
                    <input type="text" value={form.supplier_name} onChange={f('supplier_name')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ערוץ</label>
                    <select value={form.channel_id} onChange={f('channel_id')} className="input-field">
                      <option value="">בחר ערוץ</option>
                      {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">מספר חשבונית</label>
                    <input type="text" value={form.invoice_number} onChange={f('invoice_number')} className="input-field" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">תאריך חשבונית</label>
                    <input type="date" value={form.invoice_date} onChange={f('invoice_date')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סכום ברוטו</label>
                    <input type="number" value={form.gross_amount} onChange={f('gross_amount')} className="input-field" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">מעמ</label>
                    <input type="number" value={form.vat_amount} onChange={f('vat_amount')} className="input-field" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סכום נטו</label>
                    <input type="number" value={form.net_amount} onChange={f('net_amount')} className="input-field" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סטטוס</label>
                    <select value={form.invoice_status} onChange={f('invoice_status')} className="input-field">
                      <option value="uploaded">הועלתה</option>
                      <option value="pending_review">לבדיקה</option>
                      <option value="approved">מאושרת</option>
                      <option value="paid">שולמה</option>
                      <option value="rejected">נדחתה</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סטטוס אישור</label>
                    <select value={form.approval_status} onChange={f('approval_status')} className="input-field">
                      <option value="pending">ממתין</option>
                      <option value="approved">מאושר</option>
                      <option value="rejected">נדחה</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">קישור קובץ (URL)</label>
                  <input type="url" value={form.file_url} onChange={f('file_url')} className="input-field" dir="ltr" placeholder="https://drive.google.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">הערות</label>
                  <textarea value={form.notes} onChange={f('notes')} className="input-field h-16 resize-none" />
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
            <h2 className="section-title">חשבוניות — {hebrewMonth(month)} {year}</h2>
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
                    <th>ספק</th>
                    <th>ערוץ</th>
                    <th>מספר</th>
                    <th>תאריך</th>
                    <th>סכום נטו</th>
                    <th>סטטוס</th>
                    <th>תשלום</th>
                    <th>אישור</th>
                    <th>קובץ</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr><td colSpan={10} className="text-center text-gray-400 py-12">אין חשבוניות. לחץ "הוסף חשבונית" להתחלת הקלט.</td></tr>
                  ) : invoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="font-medium">{inv.supplier_name || '—'}</td>
                      <td>{inv.channel?.name || '—'}</td>
                      <td dir="ltr" className="text-left text-gray-500">{inv.invoice_number || '—'}</td>
                      <td>{formatDate(inv.invoice_date)}</td>
                      <td className="font-semibold">{formatCurrency(inv.net_amount)}</td>
                      <td><InvoiceStatusBadge status={inv.invoice_status} /></td>
                      <td>
                        <StatusBadge variant={inv.payment_status === 'paid' ? 'ok' : inv.payment_status === 'pending' ? 'review' : 'neutral'}>
                          {inv.payment_status === 'paid' ? 'שולם' : inv.payment_status === 'pending' ? 'ממתין' : inv.payment_status}
                        </StatusBadge>
                      </td>
                      <td>
                        <StatusBadge variant={inv.approval_status === 'approved' ? 'ok' : inv.approval_status === 'rejected' ? 'blocked' : 'neutral'}>
                          {inv.approval_status === 'approved' ? 'מאושר' : inv.approval_status === 'rejected' ? 'נדחה' : 'ממתין'}
                        </StatusBadge>
                      </td>
                      <td>
                        {inv.file_url ? (
                          <a href={inv.file_url} target="_blank" rel="noopener" className="p-1.5 hover:bg-blue-50 rounded-lg inline-flex text-blue-500">
                            <ExternalLink size={13} />
                          </a>
                        ) : <span className="text-gray-300"><FileText size={13} /></span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(inv)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <Edit2 size={13} className="text-gray-400" />
                          </button>
                          <button onClick={() => handleDelete(inv.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
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
