'use client'

import { useState } from 'react'
import { MonthlyRecord, Channel } from '@/types'
import { INVOICE_STATUS_LABELS, PAYMENT_STATUS_LABELS, QA_STATUS_LABELS } from '@/lib/constants'
import { monthKey } from '@/lib/utils'

interface RecordFormProps {
  record?: Partial<MonthlyRecord>
  channels: Channel[]
  onSave: (data: Partial<MonthlyRecord>) => Promise<void>
  onCancel: () => void
}

export default function RecordForm({ record, channels, onSave, onCancel }: RecordFormProps) {
  const [form, setForm] = useState<Partial<MonthlyRecord>>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    spend: 0,
    impressions: 0,
    clicks: 0,
    leads: 0,
    qualified_leads: 0,
    meetings: 0,
    offers_sent: 0,
    closings: 0,
    revenue: 0,
    avg_deal_value: 0,
    commission_rate: 0,
    invoice_status: 'missing',
    invoice_amount: 0,
    payment_status: 'pending',
    qa_status: 'pending',
    ...record,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key: keyof MonthlyRecord, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.channel_id || !form.year || !form.month) {
      setError('ערוץ, שנה, וחודש הם שדות חובה')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSave({
        ...form,
        month_key: monthKey(form.year!, form.month!),
      })
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
        <h4 className="section-label mb-3">זיהוי</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ערוץ *</label>
            <select
              className="input-field"
              value={form.channel_id || ''}
              onChange={(e) => set('channel_id', e.target.value)}
              required
            >
              <option value="">בחר ערוץ...</option>
              {channels.filter((c) => c.is_active).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שנה *</label>
            <select
              className="input-field"
              value={form.year || ''}
              onChange={(e) => set('year', Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">חודש *</label>
            <select
              className="input-field"
              value={form.month || ''}
              onChange={(e) => set('month', Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* הוצאות */}
      <div>
        <h4 className="section-label mb-3">הוצאות וחשיפות</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הוצאה (₪)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.spend ?? ''}
              onChange={(e) => set('spend', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">חשיפות</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.impressions ?? ''}
              onChange={(e) => set('impressions', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">קליקים</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.clicks ?? ''}
              onChange={(e) => set('clicks', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* משפך */}
      <div>
        <h4 className="section-label mb-3">משפך מכירות</h4>
        <div className="grid grid-cols-3 gap-4">
          {([
            ['leads', 'לידים'],
            ['qualified_leads', 'לידים מוסמכים'],
            ['meetings', 'פגישות'],
            ['offers_sent', 'הצעות'],
            ['closings', 'סגירות'],
          ] as [keyof MonthlyRecord, string][]).map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={(form[key] as number) ?? ''}
                onChange={(e) => set(key, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* עסקאות */}
      <div>
        <h4 className="section-label mb-3">נתוני עסקאות</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הכנסה (₪)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.revenue ?? ''}
              onChange={(e) => set('revenue', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ערך עסקה ממוצע (₪)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.avg_deal_value ?? ''}
              onChange={(e) => set('avg_deal_value', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אחוז עמלה (0–1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              className="input-field"
              value={form.commission_rate ?? ''}
              onChange={(e) => set('commission_rate', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* חשבונית */}
      <div>
        <h4 className="section-label mb-3">חשבונית</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
            <select
              className="input-field"
              value={form.invoice_status || 'missing'}
              onChange={(e) => set('invoice_status', e.target.value)}
            >
              {Object.entries(INVOICE_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סכום (₪)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.invoice_amount ?? ''}
              onChange={(e) => set('invoice_amount', Number(e.target.value))}
            />
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
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">קישור Google Drive</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://drive.google.com/..."
              value={form.invoice_drive_link || ''}
              onChange={(e) => set('invoice_drive_link', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* QA */}
      <div>
        <h4 className="section-label mb-3">QA והערות</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס QA</label>
            <select
              className="input-field"
              value={form.qa_status || 'pending'}
              onChange={(e) => set('qa_status', e.target.value)}
            >
              {Object.entries(QA_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות QA</label>
            <input
              type="text"
              className="input-field"
              value={form.qa_notes || ''}
              onChange={(e) => set('qa_notes', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות כלליות</label>
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
