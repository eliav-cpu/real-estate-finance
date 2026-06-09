'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { PriorityBadge, StatusBadge } from '@/components/ui/StatusBadge'
import { TASK_STATUS_LABELS, ISSUE_TYPE_LABELS, PRIORITY_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import type { Task, Channel } from '@/types'
import { Plus, Edit2, Trash2 } from 'lucide-react'

const EMPTY_FORM = {
  priority: 'medium' as const,
  owner: '',
  related_month_key: '',
  related_channel_id: '',
  issue_type: 'other' as const,
  description: '',
  next_action: '',
  due_date: '',
  status: 'open' as const,
  notes: '',
}

export default function TasksPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    createClient().from('channels').select('*').order('name').then(({ data }) => setChannels((data || []) as Channel[]))
    loadTasks()
  }, [])

  async function loadTasks() {
    const { data } = await createClient()
      .from('tasks')
      .select('*, channel:channels(*)')
      .order('created_at', { ascending: false })
    setTasks((data || []) as Task[])
  }

  function startEdit(t: Task) {
    setEditId(t.id)
    setForm({
      priority: t.priority,
      owner: t.owner || '',
      related_month_key: t.related_month_key || '',
      related_channel_id: t.related_channel_id || '',
      issue_type: t.issue_type,
      description: t.description || '',
      next_action: t.next_action || '',
      due_date: t.due_date || '',
      status: t.status,
      notes: t.notes || '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    if (editId) {
      await supabase.from('tasks').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editId)
    } else {
      await supabase.from('tasks').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
    setForm({ ...EMPTY_FORM })
    loadTasks()
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק משימה?')) return
    await createClient().from('tasks').delete().eq('id', id)
    loadTasks()
  }

  const f = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const filtered = filterStatus ? tasks.filter(t => t.status === filterStatus) : tasks
  const openCount = tasks.filter(t => t.status === 'open').length
  const highCount = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length

  return (
    <div className="min-h-screen">
      <Header
        title="משימות ופעולות"
        subtitle="מעקב משימות תפעוליות"
        actions={
          <div className="flex items-center gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field w-auto text-sm py-1.5">
              <option value="">כל הסטטוסים</option>
              {Object.entries(TASK_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button onClick={() => { setEditId(null); setForm({ ...EMPTY_FORM }); setShowForm(true) }} className="btn-primary">
              <Plus size={14} /> משימה חדשה
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="kpi-card"><p className="section-label mb-2">סה&quot;כ משימות</p><p className="text-2xl font-bold">{tasks.length}</p></div>
          <div className={`kpi-card ${openCount > 0 ? 'border-yellow-200 bg-yellow-50/30' : ''}`}>
            <p className="section-label mb-2">פתוחות</p><p className="text-2xl font-bold">{openCount}</p>
          </div>
          <div className={`kpi-card ${highCount > 0 ? 'border-red-200 bg-red-50/30' : ''}`}>
            <p className="section-label mb-2">דחיפות גבוהה</p><p className="text-2xl font-bold text-red-700">{highCount}</p>
          </div>
          <div className="kpi-card border-green-200 bg-green-50/30">
            <p className="section-label mb-2">הושלמו</p><p className="text-2xl font-bold text-green-700">{tasks.filter(t => t.status === 'done').length}</p>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-6">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold">{editId ? 'עריכת משימה' : 'משימה חדשה'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">דחיפות</label>
                    <select value={form.priority} onChange={f('priority')} className="input-field">
                      <option value="high">גבוהה</option>
                      <option value="medium">בינונית</option>
                      <option value="low">נמוכה</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סטטוס</label>
                    <select value={form.status} onChange={f('status')} className="input-field">
                      {Object.entries(TASK_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">סוג בעיה</label>
                    <select value={form.issue_type} onChange={f('issue_type')} className="input-field">
                      {Object.entries(ISSUE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">אחראי</label>
                    <input type="text" value={form.owner} onChange={f('owner')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ערוץ קשור</label>
                    <select value={form.related_channel_id} onChange={f('related_channel_id')} className="input-field">
                      <option value="">—</option>
                      {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">תאריך יעד</label>
                    <input type="date" value={form.due_date} onChange={f('due_date')} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">תיאור</label>
                  <textarea value={form.description} onChange={f('description')} className="input-field h-16 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">צעד הבא</label>
                  <textarea value={form.next_action} onChange={f('next_action')} className="input-field h-16 resize-none" />
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
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>דחיפות</th>
                  <th>סוג בעיה</th>
                  <th>תיאור</th>
                  <th>ערוץ</th>
                  <th>אחראי</th>
                  <th>תאריך יעד</th>
                  <th>סטטוס</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center text-gray-400 py-12">אין משימות</td></tr>
                ) : filtered.map(t => (
                  <tr key={t.id}>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td>{ISSUE_TYPE_LABELS[t.issue_type] || t.issue_type}</td>
                    <td className="max-w-xs truncate text-gray-600">{t.description || '—'}</td>
                    <td>{t.channel?.name || '—'}</td>
                    <td>{t.owner || '—'}</td>
                    <td>{formatDate(t.due_date)}</td>
                    <td>
                      <StatusBadge variant={
                        t.status === 'done' ? 'ok' :
                        t.status === 'open' ? 'review' :
                        t.status === 'cancelled' ? 'blocked' : 'neutral'
                      }>
                        {TASK_STATUS_LABELS[t.status]}
                      </StatusBadge>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(t)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit2 size={13} className="text-gray-400" /></button>
                        <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={13} className="text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
