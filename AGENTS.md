# EXCELDOR Agent Bootstrap

## Mission
Transform this repository into EXCELDOR Core: a real-estate financial modeling engine for Excel automation, investor simulations, payment plans, return analysis, mortgage/debt analysis, source governance, QA, and client-ready outputs.

## Operating rules
- Inspect the repository before changing code.
- Preserve existing behavior until tests are added.
- Do not invent financial, market, legal, tax, rent, mortgage, FX, or macro assumptions.
- Mark missing assumptions as `Needs Verification`.
- Keep internal logic separate from client-facing output.
- Add tests for every calculation engine.
- Do not use guaranteed-return language in client-facing materials.
- Do not commit secrets, API keys, or private client data.

## Required disclaimer for investor-facing outputs
המידע מוצג כסימולציה תחשיבית ותמונת מצב על בסיס הנחות עבודה ומקורות זמינים. אין לראות בו ייעוץ השקעות, ייעוץ משכנתאות, ייעוץ מס או התחייבות לתשואה. כל החלטה דורשת בדיקה אישית, משפטית, פיננסית ומיסויית.

## First task order
1. Read README.md, package.json, index.js, tests, docs, examples, and data.
2. Create `docs/00_repo_intelligence_report.md`.
3. Add tests around the current formulas.
4. Create `/src/engines`, `/src/governance`, `/src/qa`, `/data`, `/outputs`, `/examples`, and `/templates` as needed.
5. Build MVP engines for payment plans, returns, mortgage/debt, rental revenue, appreciation, FX sensitivity, source governance, and output safety.
6. Produce a structured implementation report after every meaningful change.

## MVP acceptance criteria
- `npm test` runs real tests.
- Existing functions are covered before refactoring.
- Payment plans must total 100%.
- Return calculations must not divide by zero silently.
- Mortgage/debt engine must expose LTV, debt service, amortization, and DSCR.
- All assumptions must have source-governance metadata.
- Client-facing outputs must pass compliance checks.
