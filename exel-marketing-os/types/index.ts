// ─── Core Entities ───────────────────────────────────────────────────────────

export type Channel = {
  id: string
  name: string
  type: 'paid' | 'organic' | 'referral' | 'content' | 'messaging' | 'event' | 'other'
  status: 'active' | 'inactive'
  created_at: string
}

export type Campaign = {
  id: string
  channel_id: string
  campaign_name: string
  objective?: string
  project_or_offer?: string
  audience?: string
  creative_angle?: string
  landing_page_url?: string
  whatsapp_link?: string
  start_date?: string
  end_date?: string
  status: 'active' | 'paused' | 'stopped' | 'completed'
  marketing_owner?: string
  sales_owner?: string
  decision?: string
  creative_notes?: string
  what_worked?: string
  what_failed?: string
  created_at: string
  updated_at: string
  channel?: Channel
}

export type MonthlyRecord = {
  id: string
  year: number
  month: number
  month_key: string
  channel_id: string
  campaign_id?: string
  project_or_offer?: string
  marketing_owner?: string
  sales_owner?: string
  currency: string
  // Spend
  gross_spend: number
  vat: number
  net_spend: number
  // Invoice
  invoice_required: boolean
  invoice_status: InvoiceStatus
  invoice_link?: string
  payment_status: PaymentStatus
  payment_date?: string
  // Funnel
  leads_received: number
  qualified_leads: number
  whatsapp_conversations: number
  calls_made: number
  meetings_scheduled: number
  office_meetings_held: number
  no_shows: number
  // Deals
  closed_deals: number
  reserved_deals: number
  cancelled_deals: number
  // Revenue
  expected_revenue: number
  actual_revenue: number
  gross_profit: number
  // Meta
  notes?: string
  next_action?: string
  status: string
  data_owner?: string
  last_updated_by?: string
  qa_status: QAStatus
  created_at: string
  updated_at: string
  channel?: Channel
  campaign?: Campaign
}

export type Invoice = {
  id: string
  year: number
  month: number
  month_key: string
  supplier_name?: string
  channel_id?: string
  campaign_id?: string
  invoice_number?: string
  invoice_date?: string
  payment_date?: string
  currency: string
  gross_amount: number
  vat_amount: number
  net_amount: number
  payment_method?: string
  paid_by?: string
  invoice_status: InvoiceStatus
  payment_status: PaymentStatus
  file_url?: string
  google_drive_file_id?: string
  related_record_id?: string
  matching_status: MatchingStatus
  approval_status: ApprovalStatus
  notes?: string
  created_at: string
  updated_at: string
  channel?: Channel
  campaign?: Campaign
}

export type Budget = {
  id: string
  year: number
  month: number
  month_key: string
  channel_id: string
  planned_budget: number
  planned_leads: number
  planned_meetings: number
  planned_closings: number
  target_cpl: number
  target_cost_per_meeting: number
  target_cost_per_closing: number
  notes?: string
  channel?: Channel
}

export type Task = {
  id: string
  priority: 'high' | 'medium' | 'low'
  owner?: string
  related_month_key?: string
  related_channel_id?: string
  related_campaign_id?: string
  issue_type: IssueType
  description?: string
  next_action?: string
  due_date?: string
  status: TaskStatus
  notes?: string
  created_at: string
  updated_at: string
  channel?: Channel
}

export type Setting = {
  id: string
  key: string
  value: string
  description?: string
}

// ─── Status Types ─────────────────────────────────────────────────────────────

export type InvoiceStatus = 'missing' | 'uploaded' | 'pending_review' | 'approved' | 'paid' | 'rejected' | 'unmatched'
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'rejected'
export type MatchingStatus = 'matched' | 'review' | 'missing' | 'unlinked' | 'pending'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'
export type QAStatus = 'ok' | 'review' | 'blocked'
export type TaskStatus = 'open' | 'in_progress' | 'waiting' | 'done' | 'cancelled'
export type IssueType =
  | 'missing_invoice'
  | 'high_cpl'
  | 'low_meeting_rate'
  | 'low_closing_rate'
  | 'overspend'
  | 'no_data'
  | 'campaign_to_stop'
  | 'campaign_to_scale'
  | 'need_creative'
  | 'need_lp_fix'
  | 'need_sales_followup'
  | 'other'

// ─── Calculated / Derived ─────────────────────────────────────────────────────

export type RecordKPIs = {
  cost_per_lead: number | null
  cost_per_qualified_lead: number | null
  cost_per_meeting: number | null
  cost_per_closing: number | null
  lead_to_meeting_rate: number | null
  meeting_to_closing_rate: number | null
  lead_to_closing_rate: number | null
  no_show_rate: number | null
  roas: number | null
  roi: number | null
  profit_after_spend: number
}

export type DashboardKPIs = {
  total_spend: number
  total_leads: number
  qualified_leads: number
  office_meetings: number
  closed_deals: number
  actual_revenue: number
  gross_profit: number
  profit_after_spend: number
  cost_per_lead: number | null
  cost_per_meeting: number | null
  cost_per_closing: number | null
  lead_to_meeting_rate: number | null
  meeting_to_closing_rate: number | null
  lead_to_closing_rate: number | null
  roi: number | null
  roas: number | null
  missing_invoices: number
  unmatched_invoices: number
  open_tasks: number
}

export type ChannelSummary = {
  channel_id: string
  channel_name: string
  total_spend: number
  leads: number
  qualified_leads: number
  meetings: number
  closings: number
  actual_revenue: number
  cpl: number | null
  cost_per_meeting: number | null
  cost_per_closing: number | null
  roi: number | null
  recommendation: string
}

export type FunnelStage = {
  label: string
  hebrewLabel: string
  value: number
  rate: number | null
  rateLabel: string | null
}

export type MonthlySnapshot = {
  month_key: string
  month_name: string
  year: number
  month: number
  total_spend: number
  leads: number
  office_meetings: number
  closed_deals: number
  actual_revenue: number
  roi: number | null
  cpl: number | null
  best_channel: string | null
}

export type DashboardFilters = {
  year?: number
  month?: number
  channel_id?: string
  campaign_id?: string
  project_or_offer?: string
  owner?: string
}
