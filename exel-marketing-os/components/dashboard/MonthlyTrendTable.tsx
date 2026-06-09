'use client'

import { MonthlySnapshot } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/calculations'
import { HEBREW_MONTHS } from '@/lib/constants'

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
            const cpl = snap.leads > 0 ? snap.spend / snap.leads : 0
            const prevCpl = prev && prev.leads > 0 ? prev.spend / prev.leads : undefined
            const roi = snap.spend > 0 ? (snap.revenue - snap.spend) / snap.spend : 0
            const prevRoi =
              prev && prev.spend > 0
                ? (prev.revenue - prev.spend) / prev.spend
                : undefined

            return (
              <tr key={snap.monthKey}>
                <td className="font-medium">
                  {HEBREW_MONTHS[snap.month - 1]} {snap.year}
                </td>
                <td>
                  <span className={trendClass(snap.spend, prev?.spend, false)}>
                    {trendArrow(snap.spend, prev?.spend)}
                  </span>{' '}
                  {formatCurrency(snap.spend)}
                </td>
                <td>
                  <span className={trendClass(snap.leads, prev?.leads)}>
                    {trendArrow(snap.leads, prev?.leads)}
                  </span>{' '}
                  {formatNumber(snap.leads)}
                </td>
                <td>
                  <span className={trendClass(snap.meetings, prev?.meetings)}>
                    {trendArrow(snap.meetings, prev?.meetings)}
                  </span>{' '}
                  {formatNumber(snap.meetings)}
                </td>
                <td>
                  <span className={trendClass(snap.closings, prev?.closings)}>
                    {trendArrow(snap.closings, prev?.closings)}
                  </span>{' '}
                  {formatNumber(snap.closings)}
                </td>
                <td>
                  <span className={trendClass(cpl, prevCpl, false)}>
                    {prevCpl !== undefined ? trendArrow(cpl, prevCpl) : ''}
                  </span>{' '}
                  {snap.leads > 0 ? formatCurrency(cpl) : '—'}
                </td>
                <td>
                  <span className={trendClass(roi, prevRoi)}>
                    {prevRoi !== undefined ? trendArrow(roi, prevRoi) : ''}
                  </span>{' '}
                  {snap.spend > 0 ? `${roi.toFixed(1)}×` : '—'}
                </td>
                <td>
                  <span className={trendClass(snap.revenue, prev?.revenue)}>
                    {trendArrow(snap.revenue, prev?.revenue)}
                  </span>{' '}
                  {formatCurrency(snap.revenue)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
