# EXCELDOR Repository Intelligence Report

## Repository
- Repository: `eliav-cpu/real-estate-finance`
- Default branch: `master`
- Current purpose: legacy JavaScript package for real-estate finance formulas.
- Target purpose: EXCELDOR Core, a hardened real-estate financial modeling and investor simulation engine.

## Existing structure observed
- `README.md`
- `package.json`
- `index.js`

## Existing financial engines
The current README and `index.js` expose the following formula functions:
- `annualGrossPotentialIncome`
- `netOperatingIncome`
- `grossRentalMultiplier`
- `estimatedPropertyValueByGRM`
- `grossOperatingIncome`
- `capitalizationRate`
- `estimatedPropertyValueByCapRate`
- `cashFlowBeforeTaxes`
- `cashFlowAfterTaxes`
- `breakEvenRatio`
- `returnOnEquity`

## Immediate findings
1. The repository is useful as a formula seed, but it is not yet a production-grade modeling system.
2. The package currently has no real test suite. `npm test` is configured to fail by default.
3. The formula API style appears inconsistent with the README examples: functions use object destructuring while older examples show positional parameters.
4. Source governance is missing.
5. Assumptions registry is missing.
6. Client-output compliance checks are missing.
7. No Excel export layer exists yet.
8. No payment-plan engine exists yet.
9. No mortgage/debt engine exists yet.
10. No rental revenue or hotel KPI engine exists yet.

## Fragile areas
- Possible mismatch between function signatures and documentation.
- Possible `Object.values(arguments)` misuse inside destructured-parameter functions.
- No validation for missing or zero denominators.
- No protection against NaN, Infinity, or string inputs.
- No structured error model.
- No QA gate for investor-facing outputs.

## Highest-value upgrades
1. Add test runner and baseline tests for legacy formulas.
2. Add input validation utilities.
3. Create modular `/src/engines` structure.
4. Implement payment-plan validation.
5. Implement debt and amortization logic.
6. Implement return/yield engine.
7. Implement source governance registry.
8. Implement client-output safety checker.
9. Add example project model and audit output.
10. Update README into EXCELDOR Core documentation.

## MVP plan
### Phase 1: Stabilize
- Add tests around existing formulas.
- Fix documentation/API mismatch only after tests prove current behavior.
- Add calculation safety helpers.

### Phase 2: Modularize
Create:
- `/src/engines/paymentPlan.js`
- `/src/engines/returns.js`
- `/src/engines/debt.js`
- `/src/engines/rentalRevenue.js`
- `/src/engines/appreciation.js`
- `/src/governance/sourceGovernance.js`
- `/src/qa/clientOutputSafety.js`

### Phase 3: Example output
Create:
- `/data/assumptions_registry.json`
- `/data/source_registry.json`
- `/examples/project_model_brief.json`
- `/outputs/mvp_scenario_report.json`
- `/outputs/mvp_investor_summary.md`
- `/outputs/mvp_audit_report.md`

## Required next GitHub/Codex task
Open a branch named `exceldor-core-mvp` and implement Phase 1 first: tests, validation, and repository cleanup. Do not refactor formulas before coverage exists.
