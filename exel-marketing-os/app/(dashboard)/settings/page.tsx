'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import type { Setting, Channel } from '@/types'
import { Plus, Save, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [newChannel, setNewChannel] = useState('')
  const [addingChannel, setAddingChannel] = useState(false)

  useEffect(() => {
    loadSettings()
    loadChannels()
  }, [])

  async function loadSettings() {
    const { data } = await createClient().from('settings').select('*').order('key')
    setSettings((data || []) as Setting[])
  }

  async function loadChannels() {
    const { data } = await createClient().from('channels').select('*').order('name')
    setChannels((data || []) as Channel[])
  }

  async function saveSetting(id: string, value: string) {
    setSaving(id)
    await createClient().from('settings').update({ value, updated_at: new Date().toISOString() }).eq('id', id)
    setSaving(null)
  }

  async function addChannel() {
    if (!newChannel.trim()) return
    setAddingChannel(true)
    await createClient().from('channels').insert({ name: newChannel.trim(), type: 'paid', status: 'active' })
    setNewChannel('')
    setAddingChannel(false)
    loadChannels()
  }

  async function toggleChannel(id: string, currentStatus: string) {
    const status = currentStatus === 'active' ? 'inactive' : 'active'
    await createClient().from('channels').update({ status }).eq('id', id)
    loadChannels()
  }

  const configSettings = settings.filter(s => !['active_year', 'active_month'].includes(s.key))

  return (
    <div className="min-h-screen">
      <Header title="הגדרות" subtitle="הגדרות מערכת, רשימות ויעדים" />

      <div className="p-6 space-y-6">
        {/* הגדרות מערכת */}
        <div className="card">
          <div className="card-header"><h2 className="section-title">יעדים והגדרות</h2></div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {configSettings.map(s => (
                <div key={s.id} className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">{s.description || s.key}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue={s.value}
                      onBlur={e => {
                        if (e.target.value !== s.value) saveSetting(s.id, e.target.value)
                      }}
                      className="input-field flex-1"
                    />
                    {saving === s.id && (
                      <span className="text-xs text-brand-600">שומר...</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{s.key}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* רשימת ערוצים */}
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">ערוצי פרסום</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newChannel}
                onChange={e => setNewChannel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addChannel()}
                placeholder="שם ערוץ חדש..."
                className="input-field py-1.5 text-sm"
              />
              <button onClick={addChannel} className="btn-primary py-1.5" disabled={addingChannel}>
                <Plus size={14} /> הוסף
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
              {channels.map(c => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${
                    c.status === 'active' ? 'border-brand-200 bg-brand-50 text-brand-900' : 'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  <span>{c.name}</span>
                  <button
                    onClick={() => toggleChannel(c.id, c.status)}
                    className="text-xs hover:underline mr-1"
                  >
                    {c.status === 'active' ? 'בטל' : 'הפעל'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* הסבר */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
          <h3 className="font-semibold mb-2">איך להשתמש בהגדרות</h3>
          <ul className="space-y-1 list-disc list-inside text-blue-700">
            <li>שנה וחודש פעילים לא משפיעים על הסננים בדפי הנתונים</li>
            <li>הגדרת יעד CPL משפיעה על המלצות בביצועי ערוצים</li>
            <li>יעד ROI משמש לקביעת צבע האינדיקטור</li>
            <li>ערוץ חדש יופיע אוטומטית בכל הדרופ-דאונים</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
