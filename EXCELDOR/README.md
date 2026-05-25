# EXCELDOR

## Purpose

EXCELDOR is the structured real-estate finance and Excel automation layer for this repository.

The existing `real-estate-finance` package already contains useful finance primitives such as gross potential income, net operating income, GRM, cap rate, cash flow, break-even ratio, and return on equity. EXCELDOR turns those primitives into a controlled operating system for building investor simulators, payment engines, dashboards, client proposals, and project-specific underwriting models.

## Core Mission

Build a reusable framework that can transform any real-estate project into four connected layers:

1. **Data Layer** - project inventory, unit pricing, payment paths, assumptions, expenses, financing, and market benchmarks.
2. **Calculation Layer** - NOI, ADR, occupancy, RevPAR, cap rate, cash flow, payment value, equity, ROI, sensitivity, and scenario logic.
3. **Sales Layer** - client profiling, PRIME money engines, payment track selection, investor fit, offer output, and proposal logic.
4. **Presentation Layer** - Excel dashboard, client-facing output, PDF/export package, RTL support, governance, and quality gates.

## Target Use Cases

- King Tamar simulator
- Wyndham Garden Bucharest Airport model
- Payment Value Engine
- Investor proposal generator
- PRIME client journey finance output
- Hotel / residential / mixed-use underwriting dashboards
- Google Sheets and Excel export-ready models

## Folder Map

```text
EXCELDOR/
  README.md
  ARCHITECTURE.md
  FORMULA_MAP.md
  ROADMAP.md
  QA_CHECKLIST.md
```

## Operating Principle

EXCELDOR is not just another spreadsheet. It is a repeatable financial product architecture:

**input -> assumptions -> calculation engine -> scenario logic -> QA gate -> investor output**

Every model should be:

- clear to a sales representative
- reliable for management
- transparent for an investor
- structured enough for future SaaS migration
- exportable to Excel, Google Sheets, PDF, and CRM workflows
