export const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
]

export const CHANNELS = [
  'Facebook', 'Instagram', 'Meta Combined', 'Google Search', 'Google Display',
  'YouTube', 'TikTok', 'LinkedIn', 'Taboola', 'Outbrain', 'Content Articles',
  'Landing Page', 'WhatsApp Campaign', 'SMS', 'Email', 'Referral', 'Organic',
  'Influencer', 'Broker Collaboration', 'Event / Conference', 'Other',
]

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  missing: 'חסרה',
  uploaded: 'הועלתה',
  pending_review: 'ממתין לבדיקה',
  approved: 'מאושרת',
  paid: 'שולמה',
  rejected: 'נדחתה',
  unmatched: 'לא מותאמת',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'ממתין',
  paid: 'שולם',
  partial: 'חלקי',
  rejected: 'נדחה',
}

export const TASK_STATUS_LABELS: Record<string, string> = {
  open: 'פתוח',
  in_progress: 'בתהליך',
  waiting: 'ממתין',
  done: 'הושלם',
  cancelled: 'בוטל',
}

export const ISSUE_TYPE_LABELS: Record<string, string> = {
  missing_invoice: 'חשבונית חסרה',
  high_cpl: 'עלות ליד גבוהה',
  low_meeting_rate: 'שיעור פגישות נמוך',
  low_closing_rate: 'שיעור סגירות נמוך',
  overspend: 'חריגת תקציב',
  no_data: 'אין נתונים',
  campaign_to_stop: 'עצור קמפיין',
  campaign_to_scale: 'הגדל קמפיין',
  need_creative: 'קריאייטיב חדש',
  need_lp_fix: 'תיקון דף נחיתה',
  need_sales_followup: 'פולואו-אפ מכירות',
  other: 'אחר',
}

export const PRIORITY_LABELS: Record<string, string> = {
  high: 'גבוהה',
  medium: 'בינונית',
  low: 'נמוכה',
}

export const QA_STATUS_LABELS: Record<string, string> = {
  ok: 'תקין',
  review: 'לבדיקה',
  blocked: 'חסום',
}

export const CAMPAIGN_DECISION_LABELS: Record<string, string> = {
  scale: 'הגדל',
  keep: 'המשך',
  pause: 'השהה',
  stop: 'עצור',
  test_again: 'בדוק שוב',
  needs_creative: 'צריך קריאייטיב',
  needs_lp: 'צריך דף נחיתה',
  needs_sales: 'צריך מכירות',
}

export const MATCHING_STATUS_LABELS: Record<string, string> = {
  matched: 'תואם',
  review: 'לבדיקה',
  missing: 'חסר',
  unlinked: 'לא מקושר',
  pending: 'ממתין',
}

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  active: 'פעיל',
  paused: 'מושהה',
  stopped: 'עצור',
  completed: 'הושלם',
}

export const YEARS = [2024, 2025, 2026, 2027]

export const DEFAULT_TARGETS = {
  cpl: 500,
  cost_per_meeting: 2000,
  cost_per_closing: 15000,
  lead_to_meeting_rate: 0.15,
  meeting_to_closing_rate: 0.25,
  roi: 3,
}
