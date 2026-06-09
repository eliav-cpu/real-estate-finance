'use client'

import { FunnelStage } from '@/types'
import { formatNumber, formatPercent } from '@/lib/calculations'

interface FunnelChartProps {
  stages: FunnelStage[]
}

const STAGE_COLORS = [
  'bg-brand-600',
  'bg-brand-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
]

const STAGE_LABELS: Record<string, string> = {
  leads: 'לידים',
  qualified_leads: 'לידים מוסמכים',
  meetings: 'פגישות',
  offers_sent: 'הצעות',
  closings: 'סגירות',
}

export default function FunnelChart({ stages }: FunnelChartProps) {
  const maxValue = stages[0]?.value || 1

  return (
    <div className="space-y-3">
      {stages.map((stage, idx) => {
        const pct = Math.round((stage.value / maxValue) * 100)
        const color = STAGE_COLORS[idx % STAGE_COLORS.length]

        return (
          <div key={stage.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {STAGE_LABELS[stage.name] ?? stage.name}
              </span>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-gray-900">
                  {formatNumber(stage.value)}
                </span>
                {stage.conversionFromPrev !== undefined && (
                  <span className="text-xs text-gray-500">
                    ({formatPercent(stage.conversionFromPrev)} משלב קודם)
                  </span>
                )}
              </div>
            </div>
            <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className={`absolute right-0 top-0 h-full rounded-lg transition-all duration-500 ${color}`}
                style={{ width: `${pct}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-end pr-3 text-xs font-medium text-white">
                {pct}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
