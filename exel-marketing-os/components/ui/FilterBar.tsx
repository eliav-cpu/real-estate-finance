'use client'

import { hebrewMonth } from '@/lib/utils'
import { YEARS } from '@/lib/constants'
import type { Channel } from '@/types'

interface FilterBarProps {
  year: number
  month: number | null
  channelId?: string
  channels?: Channel[]
  onYearChange: (y: number) => void
  onMonthChange: (m: number | null) => void
  onChannelChange?: (id: string) => void
  showMonthAll?: boolean
}

export function FilterBar({
  year, month, channelId, channels = [],
  onYearChange, onMonthChange, onChannelChange, showMonthAll = false,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Year */}
      <select
        value={year}
        onChange={e => onYearChange(Number(e.target.value))}
        className="input-field w-auto text-sm py-1.5"
      >
        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      {/* Month */}
      <select
        value={month ?? ''}
        onChange={e => onMonthChange(e.target.value ? Number(e.target.value) : null)}
        className="input-field w-auto text-sm py-1.5"
      >
        {showMonthAll && <option value="">כל השנה</option>}
        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
          <option key={m} value={m}>{hebrewMonth(m)}</option>
        ))}
      </select>

      {/* Channel */}
      {onChannelChange && (
        <select
          value={channelId ?? ''}
          onChange={e => onChannelChange(e.target.value)}
          className="input-field w-auto text-sm py-1.5"
        >
          <option value="">כל הערוצים</option>
          {channels.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      )}
    </div>
  )
}
