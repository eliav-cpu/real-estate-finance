# EXEL Marketing Performance OS

> מערכת ניהול ביצועי שיווק לנדל"ן — מבוססת Next.js + Supabase

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

## Overview

EXEL Marketing Performance OS is a production-ready, full-stack web application for managing and analyzing real-estate marketing performance. It replaces scattered spreadsheets with a single source of truth — a Hebrew-first, RTL executive dashboard connected to a PostgreSQL database.

### Key Features

- **12 Dashboard Modules**: Control Center, Monthly Records, Invoices, Campaigns, Channels, Monthly Trend, Funnel, Budget vs Actual, Tasks, QA Health, Settings
- **Automated KPI Engine**: CPL, CPM, Cost per Closing, ROI, ROAS, Profit after Spend, Funnel Conversion Rates
- **Channel Recommendation Engine**: Scale / Stop / Fix Funnel / Review / Warning — automatically computed per channel
- **Invoice Registry**: Track all marketing invoices, match to monthly records, detect missing invoices
- **Budget vs Actual**: Per-channel, per-month budget management with variance analysis
- **QA Alerts**: 8 automated data health checks with Hebrew diagnostic messages
- **Google Apps Script**: Legacy Google Sheets integration with custom menu for monthly input, PDF export, Drive folder creation
- **Hebrew RTL**: Full right-to-left layout, all labels in Hebrew
- **Role-Based Access**: Admin, Marketing Manager, Finance, Sales Manager, Viewer

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 App Router, React 18, TypeScript |
| Styling | Tailwind CSS 3, custom brand palette |
| Backend | Next.js API Routes (App Router) |
| Database | Supabase (PostgreSQL 15) |
| Auth | Supabase Auth + `@supabase/ssr` |
| Icons | lucide-react |
| Charts | recharts |
| Dates | date-fns |

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/eliav-cpu/real-estate-finance.git
cd real-estate-finance/exel-marketing-os
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full schema from `database/schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

### 6. Create first user

In Supabase Dashboard → **Authentication → Users → Add User**, create your admin account.

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set the **Root Directory** to `exel-marketing-os`
4. Add all environment variables from `.env.example`
5. Deploy

### Deploy to other platforms

This is a standard Next.js application. Any platform supporting Node.js 18+ and server-side rendering works:
- **Netlify**: Set root directory and add env vars
- **Railway**: Auto-detected as Next.js
- **Docker**: `npm run build && npm start`

---

## Project Structure

```
exel-marketing-os/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # All dashboard pages
│   │   ├── page.tsx           # Control Center
│   │   ├── records/           # Monthly Records
│   │   ├── invoices/          # Invoice Registry
│   │   ├── campaigns/         # Campaign Management
│   │   ├── channels/          # Channel Performance
│   │   ├── monthly/           # Monthly Trend
│   │   ├── funnel/            # Funnel Analysis
│   │   ├── budget/            # Budget vs Actual
│   │   ├── tasks/             # Tasks & Actions
│   │   ├── qa/                # QA Data Health
│   │   └── settings/          # Settings
│   └── api/                   # API Routes
│       ├── records/
│       ├── invoices/
│       ├── campaigns/
│       ├── channels/
│       └── dashboard/
├── components/
│   ├── layout/                # Sidebar, Header
│   ├── dashboard/             # KPICard
│   └── ui/                    # StatusBadge, FilterBar
├── lib/
│   ├── supabase/              # client.ts, server.ts
│   ├── calculations.ts        # KPI engine
│   ├── constants.ts           # Hebrew labels
│   └── utils.ts               # Helpers
├── types/index.ts             # All TypeScript types
├── database/schema.sql        # Full PostgreSQL schema
├── apps-script/               # Google Apps Script
├── middleware.ts              # Auth middleware
└── .env.example
```

---

## Google Apps Script (Legacy Sheets Integration)

For teams that still use Google Sheets as a secondary view:

1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Paste the contents of `apps-script/exel_marketing_os_apps_script.gs`
4. Save and **Authorize** the script
5. Refresh the sheet — a new menu **★ EXEL Marketing OS** appears
6. Use the menu to add monthly rows, run QA, generate reports, and export PDFs

---

## Monthly Workflow

1. At the start of each month, go to **Monthly Records** and add records per active channel
2. After campaigns run, update spend, leads, meetings, closings, revenue
3. Upload invoices in **Invoice Registry** and match them to records
4. Review **Control Center** for KPI alerts and channel recommendations
5. Check **QA/Data Health** for any missing or inconsistent data
6. Review **Budget vs Actual** to see variance by channel
7. Create action items in **Tasks & Actions**
8. Export summary report to Google Drive (PDF)

---

## Documentation

| File | Description |
|------|-------------|
| `SETUP.md` | Step-by-step setup guide in Hebrew |
| `DATA_DICTIONARY.md` | All fields, types, and business logic |
| `QA_CHECKLIST.md` | Production readiness checklist |
| `database/schema.sql` | Full PostgreSQL schema with seed data |

---

## License

Proprietary — EXEL Real Estate Investment & Marketing. All rights reserved.
