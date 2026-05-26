# EXCELDOR Formula Map

This document maps the existing `real-estate-finance` formulas to EXCELDOR use cases.

## Existing Formula Primitives

| Existing Function | Business Meaning | EXCELDOR Use Case |
|---|---|---|
| `annualGrossPotentialIncome` | Annualized rental / income potential | Residential rent model, hotel room revenue baseline |
| `grossOperatingIncome` | Income after estimated vacancy / loss | Scenario engine, conservative/base/optimistic revenue |
| `netOperatingIncome` | Income after operating expenses | Core underwriting and valuation logic |
| `grossRentalMultiplier` | Market value divided by annual income | Quick valuation comparison |
| `estimatedPropertyValueByGRM` | Value estimate based on GRM | Market comparison and exit logic |
| `capitalizationRate` | NOI divided by asset value | Investment screening and exit valuation |
| `estimatedPropertyValueByCapRate` | Value estimate based on NOI and cap rate | Future value / exit scenario engine |
| `cashFlowBeforeTaxes` | Cash flow before tax impact | Investor cash-flow view |
| `cashFlowAfterTaxes` | Cash flow after tax | Net investor output |
| `breakEvenRatio` | Debt + operating costs divided by gross operating income | Risk and debt coverage screening |
| `returnOnEquity` | Cash flow after taxes divided by invested equity | Investor return metric |

## Required EXCELDOR Extensions

### 1. Payment Value Engine

Needed for projects with staged payments.

Inputs:

- base price
- payment path
- payment dates
- delivery date
- annual discount / finance rate
- manager approval threshold

Outputs:

- present value of payments
- economic gap between payment paths
- recommended adjusted price
- approval status

### 2. Hotel Revenue Engine

Needed for Wyndham / hospitality models.

Inputs:

- room count
- ADR
- occupancy
- operating days
- expense ratio
- management fee
- brand / operator assumptions

Outputs:

- room revenue
- RevPAR
- NOI
- investor share
- ROI
- sensitivity by ADR and occupancy

### 3. Residential Investor Engine

Needed for King Tamar and apartment models.

Inputs:

- unit price
- unit type
- finish package
- expected rent
- payment plan
- appreciation
- exit date

Outputs:

- equity invested
- expected income
- expected appreciation
- total return
- ROI / IRR-ready cash-flow series

### 4. Client Fit Engine

Needed for PRIME sales workflow.

Inputs:

- available equity
- target monthly income
- risk comfort
- investment horizon
- liquidity preference
- preferred payment load

Outputs:

- recommended project
- recommended payment path
- PRIME money engine
- sales notes
- proposal summary

## Formula Governance Rules

1. Every formula must have a named business meaning.
2. Every output must show its source assumptions.
3. No investor-facing output should depend on hidden manual overrides.
4. Every scenario must keep a versioned assumption set.
5. Every exported proposal must pass QA checks before release.

## Known Refactor Requirement

The current `index.js` functions use object-style signatures but internally read `Object.values(arguments)`. This should be refactored because `arguments` contains the single passed object, not the intended values. The future engine should use explicit destructuring and typed validation.

Example target pattern:

```js
function annualGrossPotentialIncome({ expectedMonthlyRentIncome }) {
  assertNumber(expectedMonthlyRentIncome, 'expectedMonthlyRentIncome');
  return expectedMonthlyRentIncome * 12;
}
```

## Future Formula Groups

```text
finance/
  income.js
  valuation.js
  cashflow.js
  debt.js
  tax.js
  payment-value.js
  hotel.js
  residential.js
  client-fit.js
```
