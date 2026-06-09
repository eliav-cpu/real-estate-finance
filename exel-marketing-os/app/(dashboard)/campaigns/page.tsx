'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CAMPAIGN_STATUS_LABELS, CAMPAIGN_DECISION_LABELS } from '@/lib/constants'
import type { Campaign, Channel } from '@/types'
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react'

const EMPTY_FORM = {
  channel_id: '',
  campaign_name: '',
  objective: '',
  project_or_offer: '',
  audience: '',
  creative_angle: '',
  landing_page_url: '',
  whatsapp_link: '',
  start_date: '',
  end_date: '',
  status: 'active' as const,
  marketing_owner: '',
  sales_owner: '',
  decision: '',
  creative_notes: '',
  what_worked: '',
  what_failed: '',
}

export default function CampaignsPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    loadChannels()
    loadCampaigns()
  }, [])

  async function loadChannels() {
    const { data } = await createClient().from('channels').select('*').order('name')
    setChannels((data || []) as Channel[])
  }

  async function loadCampaigns() {
    setLoading(true)
    const { data } = await createClient()
      .from('campaigns')
      .select('*, channel:channels(*)')
      .order('created_at', { ascending: false })
    setCampaigns((data || []) as Campaign[])
    setLoading(false)
  }

  function startEdit(c: Campaign) {
    setEditId(c.id)
    setForm({
      channel_id: c.channel_id,
      campaign_name: c.campaign_name,
      objective: c.objective || '',
      project_or_offer: c.project_or_offer || '',
      audience: c.audience || '',
      creative_angle: c.creative_angle || '',
      landing_page_url: c.landing_page_url || '',
      whatsapp_link: c.whatsapp_link || '',
      start_date: c.start_date || '',
      end_date: c.end_date || '',
      status: c.status,
      marketing_owner: c.marketing_owner || '',
      sales_owner: c.sales_owner || '',
      decision: c.decision || '',
      creative_notes: c.creative_notes || '',
      what_worked: c.what_worked || '',
      what_failed: c.what_failed || '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    if (editId) {
      await supabase.from('campaigns').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editId)
    } else {
      await supabase.from('campaigns').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
    setForm({ ...EMPTY_FORM })
    loadCampaigns()
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק קמפיין זה?')) return
    await createClient().from('campaigns').delete().eq('id', id)
    loadCampaigns()
  }

  const f = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const filtered = filterStatus ? campaigns.filter(c => c.status === filterStatus) : campaigns

  const decisionVariant = (d: string | undefined) => {
    if (!d) return 'neutral' as const
    if (d === 'scale') return 'ok' as const
    if (d === 'stop') return 'blocked' as const
    if (d === 'pause') return 'review' as const
    return 'neutral' as const
  }

  return (
    <div className="min-h-screen">
      <Header
        title="קמפיינים"
        subtitle="ניהול ומעקב קמפיינים פעילים"
        actions={
          <div className="flex items-center gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-auto text-sm py-1.5">
              <option value="">כל הסטטוסים</option>
              <option value="active">פעיל</option>
              <option value="paused">מושהה</option>
              <option value="stopped">עצור</option>
              <option value="completed">הושלם</option>
            </select>
            <button onClick={() => { setEditId(null); setForm({ ...EMPTY_FORM }); setShowForm(true) }} className="btn-primary">
              <Plus size={14} /> קמפיין חדש
            </button>
          </div>
        }
      />

      <div className="p-6">
        {/* טופס */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold">{editId ? 'עריכת קמפיין' : 'קמפיין חדש'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">שם קמפיין *</label>
                    <input type="text" value={form.campaign_name} onChange={f('campaign_name')} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ערוץ *</label>
                    <select value={form.channel_id} onChange={f('channel_id')} className="input-field">
                      <option value="">בחר ערוץ</option>
                      {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">מטרה</label>
                    <input type="text" value={form.objective} onChange={f('objective')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">פרויקט / הצעה</label>
                    <input type="text" value={form.project_or_offer} onChange={f('project_or_offer')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סטטוס</label>
                    <select value={form.status} onChange={f('status')} className="input-field">
                      <option value="active">פעיל</option>
                      <option value="paused">מושהה</option>
                      <option value="stopped">עצור</option>
                      <option value="completed">הושלם</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">החלטה</label>
                    <select value={form.decision} onChange={f('decision')} className="input-field">
                      <option value="">ללא החלטה</option>
                      <option value="scale">הגדל</option>
                      <option value="keep">המשך</option>
                      <option value="pause">השהה</option>
                      <option value="stop">עצור</option>
                      <option value="test_again">בדוק שוב</option>
                      <option value="needs_creative">צריך קריאייטיב</option>
                      <option value="needs_lp">צריך דף נחיתה</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">תאריך התחלה</label>
                    <input type="date" value={form.start_date} onChange={f('start_date')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">תאריך סיום</label>
                    <input type="date" value={form.end_date} onChange={f('end_date')} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">דף נחיתה (URL)</label>
                  <input type="url" value={form.landing_page_url} onChange={f('landing_page_url')} className="input-field" dir="ltr" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">מה עבד</label>
                    <textarea value={form.what_worked} onChange={f('what_worked')} className="input-field h-16 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">מה לא עבד</label>
                    <textarea value={form.what_failed} onChange={f('what_failed')} className="input-field h-16 resize-none" />
                  </div>
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
            <h2 className="section-title">כל הקמפיינים ({filtered.length})</h2>
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
                    <th>שם קמפיין</th>
                    <th>ערוץ</th>
                    <th>פרויקט</th>
                    <th>סטטוס</th>
                    <th>החלטה</th>
                    <th>דף נחיתה</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-gray-400 py-12">אין קמפיינים</td></tr>
                  ) : filtered.map(c => (
                    <tr key={c.id}>
                      <td className="font-medium text-gray-900">{c.campaign_name}</td>
                      <td>{c.channel?.name || '—'}</td>
                      <td>{c.project_or_offer || '—'}</td>
                      <td>
                        <StatusBadge variant={
                          c.status === 'active' ? 'ok' :
                          c.status === 'stopped' ? 'blocked' :
                          c.status === 'paused' ? 'review' : 'neutral'
                        }>
                          {CAMPAIGN_STATUS_LABELS[c.status] || c.status}
                        </StatusBadge>
                      </td>
                      <td>
                        {c.decision ? (
                          <StatusBadge variant={decisionVariant(c.decision)}>
                            {CAMPAIGN_DECISION_LABELS[c.decision] || c.decision}
                          </StatusBadge>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td>
                        {c.landing_page_url ? (
                          <a href={c.landing_page_url} target="_blank" rel="noopener" className="text-brand-600 hover:underline flex items-center gap-1 text-xs">
                            <ExternalLink size={11} />קישור
                          </a>
                        ) : '—'}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(c)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <Edit2 size={13} className="text-gray-400" />
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
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
