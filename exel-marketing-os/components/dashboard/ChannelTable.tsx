'use client'

import { ChannelSummary } from '@/types'
import { formatCurrency, formatPercent, formatMultiplier } from '@/lib/calculations'

interface ChannelTableProps {
  channels: ChannelSummary[]
  onChannelClick?: (channelId: string) => void
}

const RECOMMENDATION_COLORS: Record<string, string> = {
  'להגדיל': 'text-emerald-700 bg-emerald-50',
  'לעצור': 'text-red-700 bg-red-50',
  'לבדוק קמפיין': 'text-amber-700 bg-amber-50',
  'לתקן משפך': 'text-blue-700 bg-blue-50',
  'לבחון צוות מכירות': 'text-purple-700 bg-purple-50',
  'אזהרה': 'text-orange-700 bg-orange-50',
}

function recColor(rec: string): string {
  for (const [key, cls] of Object.entries(RECOMMENDATION_COLORS)) {
    if (rec.startsWith(key)) return cls
  }
  return 'text-gray-700 bg-gray-50'
}

export default function ChannelTable({ channels, onChannelClick }: ChannelTableProps) {
  if (channels.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        אין נתוני ערוץ לתצוגה
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>ערוץ</th>
            <th>הוצאה</th>
            <th>לידים</th>
            <th>פגישות</th>
            <th>סגירות</th>
            <th>CPL</th>
            <th>ROI</th>
            <th>המרה L→M</th>
            <th>המלצה</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((ch) => (
            <tr
              key={ch.channelId}
              className={onChannelClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              onClick={() => onChannelClick?.(ch.channelId)}
            >
              <td className="font-medium text-gray-900">{ch.channelName}</td>
              <td>{formatCurrency(ch.totalSpend)}</td>
              <td>{ch.totalLeads.toLocaleString()}</td>
              <td>{ch.totalMeetings.toLocaleString()}</td>
              <td>{ch.totalClosings.toLocaleString()}</td>
              <td>
                {ch.totalLeads > 0
                  ? formatCurrency(ch.totalSpend / ch.totalLeads)
                  : '—'}
              </td>
              <td>
                {ch.totalSpend > 0
                  ? formatMultiplier((ch.totalRevenue - ch.totalSpend) / ch.totalSpend)
                  : '—'}
              </td>
              <td>
                {ch.totalLeads > 0
                  ? formatPercent((ch.totalMeetings / ch.totalLeads) * 100)
                  : '—'}
              </td>
              <td>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${recColor(
                    ch.recommendation
                  )}`}
                >
                  {ch.recommendation}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
