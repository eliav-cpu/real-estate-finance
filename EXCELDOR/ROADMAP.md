# EXCELDOR Roadmap

## Phase 1 — Repository foundation
Goal: create a clean EXCELDOR folder inside `real-estate-finance`.

Deliverables:
- README
- Architecture
- Formula Map
- QA Checklist
- Skill files
- Roadmap

## Phase 2 — Formula refactor
Goal: turn existing finance primitives into safe reusable modules.

Actions:
- refactor function signatures;
- add input validation;
- add unit tests;
- split formula groups into income, valuation, cash flow, debt, hotel, residential, payment value, and client fit.

## Phase 3 — Excel generator
Goal: generate project-ready workbooks from structured configuration.

Actions:
- create workbook template schema;
- create tab generator;
- add formatting system;
- add data validation rules;
- add QA Gate tab;
- add export tabs.

## Phase 4 — Project models
Goal: build repeatable project engines.

Priority models:
1. Wyndham Garden Bucharest Airport.
2. King Tamar.
3. Generic residential pre-sale simulator.
4. Generic hotel room investment simulator.
5. Payment Value Engine.

## Phase 5 — Client proposal engine
Goal: convert calculations into sales-ready outputs.

Actions:
- client intake schema;
- money engine recommendation;
- payment path recommendation;
- proposal summary;
- PDF export;
- CRM summary output.

## Phase 6 — SaaS readiness
Goal: make every Excel module ready for online migration.

Actions:
- define database schema;
- define API-ready calculation engine;
- define project, unit, client, scenario, assumption, and proposal entities;
- map Excel tabs to SaaS modules;
- create audit and versioning logic.

## Phase 7 — Operating system maturity
Goal: turn EXCELDOR into a repeatable internal platform.

Actions:
- standard workbook factory;
- source ledger templates;
- QA automation;
- investor-pack generator;
- Google Sheets export;
- Excel export;
- PDF export;
- internal training manual.
