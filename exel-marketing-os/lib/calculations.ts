import type {
  MonthlyRecord,
  RecordKPIs,
  DashboardKPIs,
  ChannelSummary,
  FunnelStage,
  MonthlySnapshot,
} from '@/types'
import { hebrewMonth } from './utils'

const safe = (n: number | undefined | null): number => n || 0

export function calcKPIs(r: MonthlyRecord): RecordKPIs {
  const spend = safe(r.net_spend)
  const leads = safe(r.leads_received)
  const qualified = safe(r.qualified_leads)
  const meetings = safe(r.office_meetings_held)
  const closings = safe(r.closed_deals)
  const scheduled = safe(r.meetings_scheduled)
  const no_shows = safe(r.no_shows)
  const revenue = safe(r.actual_revenue)

  return {
    cost_per_lead: leads > 0 ? spend / leads : null,
    cost_per_qualified_lead: qualified > 0 ? spend / qualified : null,
    cost_per_meeting: meetings > 0 ? spend / meetings : null,
    cost_per_closing: closings > 0 ? spend / closings : null,
    lead_to_meeting_rate: leads > 0 ? meetings / leads : null,
    meeting_to_closing_rate: meetings > 0 ? closings / meetings : null,
    lead_to_closing_rate: leads > 0 ? closings / leads : null,
    no_show_rate: scheduled > 0 ? no_shows / scheduled : null,
    roas: spend > 0 ? revenue / spend : null,
    roi: spend > 0 ? (revenue - spend) / spend : null,
    profit_after_spend: revenue - spend,
  }
}

export function aggregateKPIs(records: MonthlyRecord[]): DashboardKPIs {
  const total_spend = records.reduce((s, r) => s + safe(r.net_spend), 0)
  const total_leads = records.reduce((s, r) => s + safe(r.leads_received), 0)
  const qualified_leads = records.reduce((s, r) => s + safe(r.qualified_leads), 0)
  const office_meetings = records.reduce((s, r) => s + safe(r.office_meetings_held), 0)
  const closed_deals = records.reduce((s, r) => s + safe(r.closed_deals), 0)
  const actual_revenue = records.reduce((s, r) => s + safe(r.actual_revenue), 0)
  const gross_profit = records.reduce((s, r) => s + safe(r.gross_profit), 0)
  const profit_after_spend = actual_revenue - total_spend

  return {
    total_spend,
    total_leads,
    qualified_leads,
    office_meetings,
    closed_deals,
    actual_revenue,
    gross_profit,
    profit_after_spend,
    cost_per_lead: total_leads > 0 ? total_spend / total_leads : null,
    cost_per_meeting: office_meetings > 0 ? total_spend / office_meetings : null,
    cost_per_closing: closed_deals > 0 ? total_spend / closed_deals : null,
    lead_to_meeting_rate: total_leads > 0 ? office_meetings / total_leads : null,
    meeting_to_closing_rate: office_meetings > 0 ? closed_deals / office_meetings : null,
    lead_to_closing_rate: total_leads > 0 ? closed_deals / total_leads : null,
    roi: total_spend > 0 ? (actual_revenue - total_spend) / total_spend : null,
    roas: total_spend > 0 ? actual_revenue / total_spend : null,
    missing_invoices: records.filter(r => r.invoice_required && r.invoice_status === 'missing').length,
    unmatched_invoices: 0,
    open_tasks: 0,
  }
}

export function buildChannelSummaries(records: MonthlyRecord[]): ChannelSummary[] {
  const byChannel: Record<string, MonthlyRecord[]> = {}
  for (const r of records) {
    if (!byChannel[r.channel_id]) byChannel[r.channel_id] = []
    byChannel[r.channel_id].push(r)
  }

  return Object.entries(byChannel).map(([channel_id, recs]) => {
    const spend = recs.reduce((s, r) => s + safe(r.net_spend), 0)
    const leads = recs.reduce((s, r) => s + safe(r.leads_received), 0)
    const qualified = recs.reduce((s, r) => s + safe(r.qualified_leads), 0)
    const meetings = recs.reduce((s, r) => s + safe(r.office_meetings_held), 0)
    const closings = recs.reduce((s, r) => s + safe(r.closed_deals), 0)
    const revenue = recs.reduce((s, r) => s + safe(r.actual_revenue), 0)
    const roi = spend > 0 ? (revenue - spend) / spend : null

    return {
      channel_id,
      channel_name: recs[0]?.channel?.name || 'לא ידוע',
      total_spend: spend,
      leads,
      qualified_leads: qualified,
      meetings,
      closings,
      actual_revenue: revenue,
      cpl: leads > 0 ? spend / leads : null,
      cost_per_meeting: meetings > 0 ? spend / meetings : null,
      cost_per_closing: closings > 0 ? spend / closings : null,
      roi,
      recommendation: getChannelRecommendation({ spend, leads, meetings, closings, roi }),
    }
  })
}

function getChannelRecommendation(d: {
  spend: number; leads: number; meetings: number; closings: number; roi: number | null
}): string {
  if (d.spend === 0) return 'אין נתונים'
  if (d.roi !== null && d.roi > 2 && d.closings > 0) return 'הגדל תקציב'
  if (d.spend > 5000 && d.leads === 0) return 'עצור מיידי — אין לידים'
  if (d.spend > 3000 && d.closings === 0) return 'בדיקה נדרשת'
  if (d.leads > 10 && d.meetings === 0) return 'שפר סינון לידים'
  if (d.meetings > 3 && d.closings === 0) return 'בדיקת מכירות'
  if (d.leads > 0 && d.meetings / d.leads < 0.05) return 'שפר פולואו-אפ'
  if (d.roi !== null && d.roi < 0) return 'בדוק — ROI שלילי'
  return 'המשך לעקוב'
}

export function buildFunnelData(records: MonthlyRecord[]): FunnelStage[] {
  const leads = records.reduce((s, r) => s + safe(r.leads_received), 0)
  const qualified = records.reduce((s, r) => s + safe(r.qualified_leads), 0)
  const whatsapp = records.reduce((s, r) => s + safe(r.whatsapp_conversations), 0)
  const calls = records.reduce((s, r) => s + safe(r.calls_made), 0)
  const scheduled = records.reduce((s, r) => s + safe(r.meetings_scheduled), 0)
  const meetings = records.reduce((s, r) => s + safe(r.office_meetings_held), 0)
  const closings = records.reduce((s, r) => s + safe(r.closed_deals), 0)

  const pct = (a: number, b: number): string | null =>
    b > 0 ? `${((a / b) * 100).toFixed(1)}%` : null

  return [
    { label: 'leads', hebrewLabel: 'לידים', value: leads, rate: null, rateLabel: null },
    { label: 'qualified', hebrewLabel: 'לידים מוכשרים', value: qualified, rate: leads > 0 ? qualified / leads : null, rateLabel: pct(qualified, leads) },
    { label: 'whatsapp', hebrewLabel: 'שיחות וואטסאפ', value: whatsapp, rate: qualified > 0 ? whatsapp / qualified : null, rateLabel: pct(whatsapp, qualified) },
    { label: 'calls', hebrewLabel: 'שיחות טלפון', value: calls, rate: whatsapp > 0 ? calls / whatsapp : null, rateLabel: pct(calls, whatsapp) },
    { label: 'scheduled', hebrewLabel: 'פגישות מתוזמנות', value: scheduled, rate: calls > 0 ? scheduled / calls : null, rateLabel: pct(scheduled, calls) },
    { label: 'meetings', hebrewLabel: 'פגישות משרד', value: meetings, rate: scheduled > 0 ? meetings / scheduled : null, rateLabel: pct(meetings, scheduled) },
    { label: 'closings', hebrewLabel: 'עסקאות סגורות', value: closings, rate: meetings > 0 ? closings / meetings : null, rateLabel: pct(closings, meetings) },
  ]
}

export function buildMonthlySnapshots(
  records: MonthlyRecord[],
  year: number
): MonthlySnapshot[] {
  const byMonth: Record<string, MonthlyRecord[]> = {}
  for (const r of records) {
    if (!byMonth[r.month_key]) byMonth[r.month_key] = []
    byMonth[r.month_key].push(r)
  }

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const key = `${year}-${String(month).padStart(2, '0')}`
    const recs = byMonth[key] || []
    const spend = recs.reduce((s, r) => s + safe(r.net_spend), 0)
    const leads = recs.reduce((s, r) => s + safe(r.leads_received), 0)
    const meetings = recs.reduce((s, r) => s + safe(r.office_meetings_held), 0)
    const closings = recs.reduce((s, r) => s + safe(r.closed_deals), 0)
    const revenue = recs.reduce((s, r) => s + safe(r.actual_revenue), 0)

    const byChannel: Record<string, number> = {}
    for (const r of recs) {
      byChannel[r.channel?.name || ''] = (byChannel[r.channel?.name || ''] || 0) + safe(r.closed_deals)
    }
    const best_channel = Object.entries(byChannel).sort((a, b) => b[1] - a[1])[0]?.[0] || null

    return {
      month_key: key,
      month_name: hebrewMonth(month),
      year,
      month,
      total_spend: spend,
      leads,
      office_meetings: meetings,
      closed_deals: closings,
      actual_revenue: revenue,
      roi: spend > 0 ? (revenue - spend) / spend : null,
      cpl: leads > 0 ? spend / leads : null,
      best_channel,
    }
  })
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatCurrency(n: number | null | undefined, symbol = '₪'): string {
  if (n === null || n === undefined) return '—'
  return `${symbol}${n.toLocaleString('he-IL', { maximumFractionDigits: 0 })}`
}

export function formatPercent(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return `${(n * 100).toFixed(1)}%`
}

export function formatMultiplier(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return `${(n + 1).toFixed(2)}x`
}

export function kpiStatusClass(value: number | null, target: number, lowerIsBetter = true): string {
  if (value === null) return 'text-gray-400'
  const ratio = value / target
  if (lowerIsBetter) {
    if (ratio <= 1) return 'text-green-600'
    if (ratio <= 1.3) return 'text-yellow-600'
    return 'text-red-600'
  } else {
    if (ratio >= 1) return 'text-green-600'
    if (ratio >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }
}
