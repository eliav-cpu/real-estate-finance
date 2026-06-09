'use client'

import { useState } from 'react'
import { Invoice, Channel } from '@/types'
import { INVOICE_STATUS_LABELS, PAYMENT_STATUS_LABELS, MATCHING_STATUS_LABELS } from '@/lib/constants'
import { currentMonthKey } from '@/lib/utils'

interface InvoiceFormProps {
  invoice?: Partial<Invoice>
  channels: Channel[]
  onSave: (data: Partial<Invoice>) => Promise<void>
  onCancel: () => void
}

export default function InvoiceForm({ invoice, channels, onSave, onCancel }: InvoiceFormProps) {
  const [form, setForm] = useState<Partial<Invoice>>({
    month_key: currentMonthKey(),
    status: 'received',
    payment_status: 'pending',
    matching_status: 'unmatched',
    amount: 0,
    vat_amount: 0,
    total_amount: 0,
    ...invoice,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key: keyof Invoice, value: unknown) =>
    setForm((f) => {
      const updated = { ...f, [key]: value }
      if (key === 'amount') {
        const vat = Math.round((Number(value) * 0.17) * 100) / 100
        updated.vat_amount = vat
        updated.total_amount = Math.round((Number(value) + vat) * 100) / 100
      }
      return updated
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.channel_id || !form.vendor_name) {
      setError('ערוץ ושם ספק הם שדות חובה')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSave(form)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירה')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* זיהוי */}
      <div>
        <h4 className="section-label mb-3">פרטי החשבונית</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ערוץ *</label>
            <select
              className="input-field"
              value={form.channel_id || ''}
              onChange={(e) => set('channel_id', e.target.value)}
              required
            >
              <option value="">בחר ערוץ...</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">חודש</label>
            <input
              type="text"
              className="input-field"
              placeholder="2026-06"
              value={form.month_key || ''}
              onChange={(e) => set('month_key', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם ספק *</label>
            <input
              type="text"
              className="input-field"
              value={form.vendor_name || ''}
              onChange={(e) => set('vendor_name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מספר חשבונית</label>
            <input
              type="text"
              className="input-field"
              value={form.invoice_number || ''}
              onChange={(e) => set('invoice_number', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* סכומות */}
      <div>
        <h4 className="section-label mb-3">סכומות</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סכום לפני מע"מ (₪)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field"
              value={form.amount ?? ''}
              onChange={(e) => set('amount', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מע"מ (₪)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field"
              value={form.vat_amount ?? ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סה"כ כולל מע"ם (₪)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field bg-gray-50"
              value={form.total_amount ?? ''}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* תאריכים */}
      <div>
        <h4 className="section-label mb-3">תאריכים</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תאריך חשבונית</label>
            <input
              type="date"
              className="input-field"
              value={form.invoice_date || ''}
              onChange={(e) => set('invoice_date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תאריך תשלום</label>
            <input
              type="date"
              className="input-field"
              value={form.due_date || ''}
              onChange={(e) => set('due_date', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* סטטוסים */}
      <div>
        <h4 className="section-label mb-3">סטטוסים</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס חשבונית</label>
            <select
              className="input-field"
              value={form.status || 'received'}
              onChange={(e) => set('status', e.target.value)}
            >
              {Object.entries(INVOICE_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס תשלום</label>
            <select
              className="input-field"
              value={form.payment_status || 'pending'}
              onChange={(e) => set('payment_status', e.target.value)}
            >
              {Object.entries(PAYMENT_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס התאמה</label>
            <select
              className="input-field"
              value={form.matching_status || 'unmatched'}
              onChange={(e) => set('matching_status', e.target.value)}
            >
              {Object.entries(MATCHING_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* קובץ */}
      <div>
        <h4 className="section-label mb-3">קובץ וקישורים</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם קובץ</label>
            <input
              type="text"
              className="input-field"
              value={form.file_name || ''}
              onChange={(e) => set('file_name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">קישור Google Drive</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://drive.google.com/..."
              value={form.file_url || ''}
              onChange={(e) => set('file_url', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
            <textarea
              className="input-field"
              rows={2}
              value={form.notes || ''}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          ביטול
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'שומר...' : 'שמור'}
        </button>
      </div>
    </form>
  )
}
