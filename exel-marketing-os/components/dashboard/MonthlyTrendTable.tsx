'use client'

import { MonthlySnapshot } from '@/types'
import { formatCurrency, formatMultiplier } from '@/lib/calculations'
import { formatNumber } from '@/lib/utils'

interface MonthlyTrendTableProps {
  snapshots: MonthlySnapshot[]
}

function trendArrow(current: number, prev: number | undefined): string {
  if (prev === undefined || prev === 0) return ''
  return current > prev ? '↑' : current < prev ? '↓' : ''
}

function trendClass(current: number, prev: number | undefined, higherIsBetter = true): string {
  if (prev === undefined || prev === 0) return 'text-gray-500'
  const better = higherIsBetter ? current > prev : current < prev
  return better ? 'text-emerald-600' : 'text-red-500'
}

export default function MonthlyTrendTable({ snapshots }: MonthlyTrendTableProps) {
  if (snapshots.length === 0) {
    return <div className="text-center py-8 text-gray-500">אין נתונים לתצוגה</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table text-sm">
        <thead>
          <tr>
            <th>חודש</th>
            <th>הוצאה</th>
            <th>לידים</th>
            <th>פגישות</th>
            <th>סגירות</th>
            <th>CPL</th>
            <th>ROI</th>
            <th>הכנסה</th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map((snap, idx) => {
            const prev = snapshots[idx - 1]

            return (
              <tr key={snap.month_key}>
                <td className="font-medium">{snap.month_name}</td>
                <td>
                  <span className={trendClass(snap.total_spend, prev?.total_spend, false)}>
                    {trendArrow(snap.total_spend, prev?.total_spend)}
                  </span>{' '}
                  {formatCurrency(snap.total_spend)}
                </td>
                <td>
                  <span className={trendClass(snap.leads, prev?.leads)}>
                    {trendArrow(snap.leads, prev?.leads)}
                  </span>{' '}
                  {formatNumber(snap.leads)}
                </td>
                <td>
                  <span className={trendClass(snap.office_meetings, prev?.office_meetings)}>
                    {trendArrow(snap.office_meetings, prev?.office_meetings)}
                  </span>{' '}
                  {formatNumber(snap.office_meetings)}
                </td>
                <td>
                  <span className={trendClass(snap.closed_deals, prev?.closed_deals)}>
                    {trendArrow(snap.closed_deals, prev?.closed_deals)}
                  </span>{' '}
                  {formatNumber(snap.closed_deals)}
                </td>
                <td>
                  <span className={trendClass(snap.cpl ?? 0, prev?.cpl ?? undefined, false)}>
                    {prev?.cpl != null && snap.cpl != null ? trendArrow(snap.cpl, prev.cpl) : ''}
                  </span>{' '}
                  {snap.cpl !== null ? formatCurrency(snap.cpl) : '—'}
                </td>
                <td>
                  <span className={trendClass(snap.roi ?? 0, prev?.roi ?? undefined)}>
                    {prev?.roi != null && snap.roi != null ? trendArrow(snap.roi, prev.roi) : ''}
                  </span>{' '}
                  {snap.roi !== null ? formatMultiplier(snap.roi) : '—'}
                </td>
                <td>
                  <span className={trendClass(snap.actual_revenue, prev?.actual_revenue)}>
                    {trendArrow(snap.actual_revenue, prev?.actual_revenue)}
                  </span>{' '}
                  {formatCurrency(snap.actual_revenue)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
