-- ============================================================
-- EXEL Marketing Performance OS — Database Schema
-- Supabase / PostgreSQL
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---- channels ----------------------------------------------------
CREATE TABLE IF NOT EXISTS channels (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  type       TEXT NOT NULL DEFAULT 'paid',  -- paid|organic|referral|content|messaging|event|other
  status     TEXT NOT NULL DEFAULT 'active', -- active|inactive
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO channels (name, type, status) VALUES
  ('Facebook',              'paid',      'active'),
  ('Instagram',             'paid',      'active'),
  ('Meta Combined',         'paid',      'active'),
  ('Google Search',         'paid',      'active'),
  ('Google Display',        'paid',      'active'),
  ('YouTube',               'paid',      'active'),
  ('TikTok',                'paid',      'active'),
  ('LinkedIn',              'paid',      'active'),
  ('Taboola',               'paid',      'active'),
  ('Outbrain',              'paid',      'active'),
  ('Content Articles',      'content',   'active'),
  ('Landing Page',          'content',   'active'),
  ('WhatsApp Campaign',     'messaging', 'active'),
  ('SMS',                   'messaging', 'active'),
  ('Email',                 'messaging', 'active'),
  ('Referral',              'referral',  'active'),
  ('Organic',               'organic',   'active'),
  ('Influencer',            'paid',      'active'),
  ('Broker Collaboration',  'referral',  'active'),
  ('Event / Conference',    'event',     'active'),
  ('Other',                 'other',     'active')
ON CONFLICT (name) DO NOTHING;

-- ---- campaigns ---------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  channel_id        UUID REFERENCES channels(id),
  campaign_name     TEXT NOT NULL,
  objective         TEXT,
  project_or_offer  TEXT,
  audience          TEXT,
  creative_angle    TEXT,
  landing_page_url  TEXT,
  whatsapp_link     TEXT,
  start_date        DATE,
  end_date          DATE,
  status            TEXT DEFAULT 'active',  -- active|paused|stopped|completed
  marketing_owner   TEXT,
  sales_owner       TEXT,
  decision          TEXT,  -- scale|keep|pause|stop|test_again|needs_creative|needs_lp|needs_sales
  creative_notes    TEXT,
  what_worked       TEXT,
  what_failed       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ---- monthly_marketing_records ------------------------------------
CREATE TABLE IF NOT EXISTS monthly_marketing_records (
  id                     UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  year                   INTEGER NOT NULL,
  month                  INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  month_key              TEXT NOT NULL,  -- yyyy-mm
  channel_id             UUID REFERENCES channels(id),
  campaign_id            UUID REFERENCES campaigns(id),
  project_or_offer       TEXT,
  marketing_owner        TEXT,
  sales_owner            TEXT,
  currency               TEXT DEFAULT 'ILS',
  -- Spend
  gross_spend            NUMERIC(12,2) DEFAULT 0,
  vat                    NUMERIC(12,2) DEFAULT 0,
  net_spend              NUMERIC(12,2) DEFAULT 0,
  -- Invoice
  invoice_required       BOOLEAN DEFAULT TRUE,
  invoice_status         TEXT DEFAULT 'missing',  -- missing|uploaded|pending_review|approved|paid|rejected
  invoice_link           TEXT,
  payment_status         TEXT DEFAULT 'pending',  -- pending|paid|partial|rejected
  payment_date           DATE,
  -- Funnel
  leads_received         INTEGER DEFAULT 0,
  qualified_leads        INTEGER DEFAULT 0,
  whatsapp_conversations INTEGER DEFAULT 0,
  calls_made             INTEGER DEFAULT 0,
  meetings_scheduled     INTEGER DEFAULT 0,
  office_meetings_held   INTEGER DEFAULT 0,
  no_shows               INTEGER DEFAULT 0,
  -- Deals
  closed_deals           INTEGER DEFAULT 0,
  reserved_deals         INTEGER DEFAULT 0,
  cancelled_deals        INTEGER DEFAULT 0,
  -- Revenue
  expected_revenue       NUMERIC(12,2) DEFAULT 0,
  actual_revenue         NUMERIC(12,2) DEFAULT 0,
  gross_profit           NUMERIC(12,2) DEFAULT 0,
  -- Meta
  notes                  TEXT,
  next_action            TEXT,
  status                 TEXT DEFAULT 'active',
  data_owner             TEXT,
  last_updated_by        TEXT,
  qa_status              TEXT DEFAULT 'ok',  -- ok|review|blocked
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ---- invoices ---------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
  id                     UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  year                   INTEGER NOT NULL,
  month                  INTEGER NOT NULL,
  month_key              TEXT NOT NULL,
  supplier_name          TEXT,
  channel_id             UUID REFERENCES channels(id),
  campaign_id            UUID REFERENCES campaigns(id),
  invoice_number         TEXT,
  invoice_date           DATE,
  payment_date           DATE,
  currency               TEXT DEFAULT 'ILS',
  gross_amount           NUMERIC(12,2) DEFAULT 0,
  vat_amount             NUMERIC(12,2) DEFAULT 0,
  net_amount             NUMERIC(12,2) DEFAULT 0,
  payment_method         TEXT,
  paid_by                TEXT,
  invoice_status         TEXT DEFAULT 'uploaded',  -- missing|uploaded|pending_review|approved|paid|rejected|unmatched
  payment_status         TEXT DEFAULT 'pending',
  file_url               TEXT,
  google_drive_file_id   TEXT,
  related_record_id      UUID REFERENCES monthly_marketing_records(id),
  matching_status        TEXT DEFAULT 'pending',  -- matched|review|missing|unlinked|pending
  approval_status        TEXT DEFAULT 'pending',  -- pending|approved|rejected
  notes                  TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ---- budgets ---------------------------------------------------
CREATE TABLE IF NOT EXISTS budgets (
  id                        UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  year                      INTEGER NOT NULL,
  month                     INTEGER NOT NULL,
  month_key                 TEXT NOT NULL,
  channel_id                UUID REFERENCES channels(id),
  planned_budget            NUMERIC(12,2) DEFAULT 0,
  planned_leads             INTEGER DEFAULT 0,
  planned_meetings          INTEGER DEFAULT 0,
  planned_closings          INTEGER DEFAULT 0,
  target_cpl                NUMERIC(12,2) DEFAULT 0,
  target_cost_per_meeting   NUMERIC(12,2) DEFAULT 0,
  target_cost_per_closing   NUMERIC(12,2) DEFAULT 0,
  notes                     TEXT,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, month, channel_id)
);

-- ---- tasks ---------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id                   UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  priority             TEXT DEFAULT 'medium',  -- high|medium|low
  owner                TEXT,
  related_month_key    TEXT,
  related_channel_id   UUID REFERENCES channels(id),
  related_campaign_id  UUID REFERENCES campaigns(id),
  issue_type           TEXT,
  description          TEXT,
  next_action          TEXT,
  due_date             DATE,
  status               TEXT DEFAULT 'open',  -- open|in_progress|waiting|done|cancelled
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ---- audit_logs ---------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID,
  user_email   TEXT,
  action       TEXT NOT NULL,  -- create|update|delete
  entity_type  TEXT NOT NULL,
  entity_id    UUID,
  old_value    JSONB,
  new_value    JSONB,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ---- imports ---------------------------------------------------
CREATE TABLE IF NOT EXISTS imports (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source_type    TEXT,  -- excel|google_sheets|csv|manual
  file_name      TEXT,
  file_url       TEXT,
  imported_by    TEXT,
  import_status  TEXT DEFAULT 'pending',  -- pending|processing|completed|failed
  rows_imported  INTEGER DEFAULT 0,
  rows_failed    INTEGER DEFAULT 0,
  error_report   JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ---- settings ---------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       TEXT,
  description TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value, description) VALUES
  ('default_currency',          'ILS',    'מטבע ברירת מחדל'),
  ('default_vat_percent',       '17',     'אחוזת מעמ מחדל'),
  ('target_cpl',                '500',    'יעד עלות ליד (שקלים)'),
  ('target_cost_per_meeting',   '2000',   'יעד עלות פגישה (שקלים)'),
  ('target_cost_per_closing',   '15000',  'יעד עלות סגירה (שקלים)'),
  ('target_lead_to_meeting',    '0.15',   'יעד יחס ליד לפגישה (15%)'),
  ('target_meeting_to_closing', '0.25',   'יעד יחס פגישה לסגירה (25%)'),
  ('target_roi',                '3',      'יעד ROI (פי 3)'),
  ('active_year',               '2026',   'שנה פעילה'),
  ('active_month',              '6',      'חודש פעיל')
ON CONFLICT (key) DO NOTHING;

-- ---- indexes ----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_records_month_key ON monthly_marketing_records(month_key);
CREATE INDEX IF NOT EXISTS idx_records_channel   ON monthly_marketing_records(channel_id);
CREATE INDEX IF NOT EXISTS idx_records_year_month ON monthly_marketing_records(year, month);
CREATE INDEX IF NOT EXISTS idx_invoices_month_key ON invoices(month_key);
CREATE INDEX IF NOT EXISTS idx_campaigns_channel  ON campaigns(channel_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status       ON tasks(status);

-- ---- Row Level Security (RLS) ------------------------------------
ALTER TABLE channels                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_marketing_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE imports                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings                   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all" ON channels                   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON campaigns                  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON monthly_marketing_records  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON invoices                   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON budgets                    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON tasks                      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_read" ON audit_logs                FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_all" ON imports                    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON settings                   FOR ALL TO authenticated USING (true) WITH CHECK (true);
