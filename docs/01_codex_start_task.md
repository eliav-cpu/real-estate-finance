# EXCELDOR Codex Start Task

## Objective
Start building EXCELDOR Core in this repository.

## Read first
1. `AGENTS.md`
2. `docs/00_repo_intelligence_report.md`
3. `README.md`
4. `package.json`
5. `index.js`

## First implementation phase
1. Create a branch named `exceldor-core-mvp`.
2. Add a real JavaScript test runner.
3. Add baseline tests for all existing exported functions before refactoring.
4. Identify formula/API mismatches between README and `index.js`.
5. Add safe input validation utilities.
6. Create modular folders: `/src/engines`, `/src/governance`, `/src/qa`, `/data`, `/examples`, `/outputs`, `/templates`.
7. Build MVP engines for payment plans, returns, debt, rental revenue, appreciation, source governance, and client-output safety.
8. Update README with EXCELDOR Core usage.
9. Produce MVP audit outputs.

## Acceptance criteria
- `npm test` runs and passes.
- Existing formulas are covered before migration.
- Payment plans must total 100%.
- Calculations must not return silent `NaN` or `Infinity`.
- Debt engine returns LTV, debt service, amortization, and DSCR.
- Example assumptions include governance metadata.
- Client-facing text blocks unsupported guarantee language.

## Guardrails
- Do not invent financial or market data.
- Missing assumptions must be marked `Needs Verification`.
- Do not use guaranteed-return language.
- Do not commit secrets, API keys, or private client data.
