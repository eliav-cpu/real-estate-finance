import { cn } from '@/lib/utils'

type Variant = 'ok' | 'review' | 'blocked' | 'neutral' | 'info'

const variants: Record<Variant, string> = {
  ok:      'bg-green-50 text-green-700 border-green-200',
  review:  'bg-yellow-50 text-yellow-700 border-yellow-200',
  blocked: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-gray-50 text-gray-600 border-gray-200',
  info:    'bg-blue-50 text-blue-700 border-blue-200',
}

interface StatusBadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ variant = 'neutral', children, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export function InvoiceStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: Variant; label: string }> = {
    missing:       { variant: 'blocked', label: 'חסרה' },
    uploaded:      { variant: 'info',    label: 'הועלתה' },
    pending_review:{ variant: 'review',  label: 'לבדיקה' },
    approved:      { variant: 'ok',      label: 'מאושרת' },
    paid:          { variant: 'ok',      label: 'שולמה' },
    rejected:      { variant: 'blocked', label: 'נדחתה' },
    unmatched:     { variant: 'review',  label: 'לא מותאמת' },
  }
  const { variant, label } = map[status] || { variant: 'neutral' as Variant, label: status }
  return <StatusBadge variant={variant}>{label}</StatusBadge>
}

export function QAStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: Variant; label: string }> = {
    ok:      { variant: 'ok',      label: 'תקין' },
    review:  { variant: 'review',  label: 'לבדיקה' },
    blocked: { variant: 'blocked', label: 'חסום' },
  }
  const { variant, label } = map[status] || { variant: 'neutral' as Variant, label: status }
  return <StatusBadge variant={variant}>{label}</StatusBadge>
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { variant: Variant; label: string }> = {
    high:   { variant: 'blocked', label: 'גבוהה' },
    medium: { variant: 'review',  label: 'בינונית' },
    low:    { variant: 'neutral', label: 'נמוכה' },
  }
  const { variant, label } = map[priority] || { variant: 'neutral' as Variant, label: priority }
  return <StatusBadge variant={variant}>{label}</StatusBadge>
}
