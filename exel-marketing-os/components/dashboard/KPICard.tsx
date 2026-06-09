import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type Trend = 'up' | 'down' | 'neutral'
type Status = 'good' | 'warning' | 'bad' | 'neutral'

interface KPICardProps {
  label: string
  value: string
  subValue?: string
  trend?: Trend
  trendLabel?: string
  status?: Status
  icon?: React.ReactNode
  className?: string
}

const statusBorder: Record<Status, string> = {
  good:    'border-green-200 bg-green-50/40',
  warning: 'border-yellow-200 bg-yellow-50/40',
  bad:     'border-red-200 bg-red-50/40',
  neutral: 'border-gray-100 bg-white',
}

const trendColor: Record<Trend, string> = {
  up:      'text-green-600',
  down:    'text-red-500',
  neutral: 'text-gray-400',
}

const TrendIcon = ({ trend }: { trend: Trend }) => {
  if (trend === 'up')      return <TrendingUp size={13} />
  if (trend === 'down')    return <TrendingDown size={13} />
  return <Minus size={13} />
}

export function KPICard({ label, value, subValue, trend, trendLabel, status = 'neutral', icon, className }: KPICardProps) {
  return (
    <div className={cn('kpi-card', statusBorder[status], className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="section-label">{label}</p>
        {icon && <span className="text-gray-300">{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-2xl font-bold text-gray-900 leading-none truncate">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
        {trend && trendLabel && (
          <div className={cn('flex items-center gap-1 text-xs font-medium flex-shrink-0', trendColor[trend])}>
            <TrendIcon trend={trend} />
            <span>{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
