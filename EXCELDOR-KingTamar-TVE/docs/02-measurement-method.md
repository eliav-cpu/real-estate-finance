# 02 - Measurement Method

## The Measurement Question

What shell price preserves the company's economic value when the client changes the payment schedule?

## Core Formula

```text
Adjusted Shell Price = Base Shell Price × Official PV Factor ÷ Custom PV Factor
```

## Meaning

- If the custom plan is identical to the official plan, the factors are equal and the adjusted price equals the base shell price.
- If the client delays payments, the custom PV factor decreases, so the adjusted shell price increases.
- If the client pays earlier, the custom PV factor increases, so the economic value improves.

## Payment Factor Per Installment

For each payment line:

```text
Months From Proposal = MAX(0, DATEDIF(Proposal Date, Payment Date, "m"))
Monthly Rate = (1 + Annual Rate)^(1/12) - 1
PV Factor Line = Payment Percent ÷ (1 + Monthly Rate) ^ Months From Proposal
```

## Total PV Factor

```text
Total PV Factor = SUM(PV Factor Line)
```

## Validation Rules

1. Payment percentages must equal 100%.
2. Payment dates must be on or after proposal date.
3. Delivery payment date should not be after delivery date unless explicitly approved.
4. Shell price must not include finishing or non-shell components.
5. If adjusted price differs beyond threshold, CFO approval is required.

## Why We Use Factors Instead Of Direct NPV

The factor method is easier for sales and finance teams to audit.

Instead of calculating every cash flow in currency first, the engine calculates the economic weight of each payment percentage and then applies the ratio to the shell price.

This keeps the engine generic for any project, currency, or shell price.
