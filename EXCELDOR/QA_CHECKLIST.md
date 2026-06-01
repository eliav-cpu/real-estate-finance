# EXCELDOR QA Checklist

## Purpose
This checklist defines the minimum quality gate before an Excel, Google Sheets, PDF proposal, investor pack, or SaaS-ready model leaves internal work mode.

## Gate statuses

| Status | Meaning | External release |
|---|---|---|
| PASS | Model is clean, sourced, controlled, and ready for intended use | Allowed |
| REVIEW | Model works internally, but has open assumptions, design issues, or incomplete source verification | Internal only |
| BLOCKED | Model has critical issues that can mislead the user, client, investor, or management | Not allowed |

## 1. File integrity
- Workbook opens without repair warnings.
- No broken formulas in core sheets.
- No undocumented external links.
- No duplicated hidden calculation areas.
- No circular references unless intentionally documented.
- Critical formulas are not overwritten by static values.

## 2. Formula checks
Check all critical tabs for:
- REF errors.
- VALUE errors.
- DIV/0 errors.
- NAME errors.
- N/A errors where a value is required.
- Inconsistent formulas across rows.
- Manual overrides without notes.

## 3. Assumption governance
- All core assumptions sit in one assumptions registry.
- Assumption owner is clear.
- Source is documented.
- Date of source is documented.
- Status is marked as verified, pending, or blocked.
- No major assumption is hidden inside a formula.

## 4. Payment schedule checks
- Payment percentages equal 100 percent.
- Payment dates are logical.
- Delivery payment is clearly separated.
- Discounts and premiums are documented.
- Time-value adjustment is visible if used.
- Manager approval flag is triggered when needed.

## 5. Real-estate model checks
- Unit price is sourced.
- Unit type is mapped correctly.
- Finish package is included or marked as excluded.
- Parking is included or excluded clearly.
- Rent assumptions are sourced or marked as scenario assumptions.
- Appreciation assumptions are labeled as scenario assumptions, not promises.

## 6. Hospitality model checks
- Room count is verified.
- ADR source is documented.
- Occupancy source is documented.
- RevPAR is calculated consistently.
- Expense ratio is clear.
- Management and marketing fee logic is clear.
- Investor share logic is clear.
- Value per room and total value are traceable.

## 7. Client-facing output
- Hebrew output is RTL when relevant.
- Inputs and outputs are visually separated.
- No internal notes appear in client-facing sheets.
- No unsupported promise language appears.
- Scenario language is clear: conservative, base, optimistic.
- Currency is clear.
- VAT / tax treatment is clear or marked for advisor review.

## 8. Investor pack checks
- Source ledger is complete.
- Contradictions are flagged.
- Release status is visible.
- Model version is visible.
- Update date is visible.
- Owner / preparer is visible.
- Critical risks are not hidden.

## 9. BLOCKED examples
A model must be marked BLOCKED when:
- hotel room count conflicts across sources and is not resolved;
- key return assumptions are unsupported;
- source documents contain restrictions on external use;
- formula errors exist in investor output;
- payment totals are wrong;
- client output shows a final claim based on pending assumptions.

## 10. Final release note
Every delivery must include:
- what changed;
- what was added;
- what was not touched;
- what remains open;
- QA status;
- next recommended step.
