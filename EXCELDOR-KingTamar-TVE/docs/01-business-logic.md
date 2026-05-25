# 01 - Business Logic

## One-line Definition

The TVE engine converts every change in a shell-only payment schedule into a financially justified shell price.

## Why This Exists

In real-estate presale transactions, the timing of money matters.

A payment made today is not economically equal to a payment made in two years. If a client delays payments, the developer is effectively financing the client. If the client pays earlier, the developer receives value earlier.

Therefore, any customized payment plan must be checked by time value logic.

## Absolute Boundary: Shell Only

The engine must calculate only the shell component.

The following are excluded:

- finishing package
- furniture
- parking
- legal fees
- escort fees
- management fees
- any commercial package that is not shell price

## Commercial Use Case

A salesperson has a client who wants a slightly different payment model.

Instead of manually guessing whether the model is acceptable, the salesperson enters:

- proposal date
- delivery date
- base shell price
- annual rate
- custom payment dates
- custom payment percentages

The engine returns:

- adjusted shell price
- economic gap
- approval status
- text for internal approval
- text for client communication

## Key Business Outputs

1. **Base shell price** - the official simulator shell price.
2. **Custom plan PV factor** - the economic value of the proposed payment schedule.
3. **Official plan PV factor** - the economic value of the approved baseline schedule.
4. **Adjusted shell price** - the shell price required to preserve company economics.
5. **Economic gap** - difference between official shell price and adjusted shell price.
6. **Approval status** - OK / Review / CFO Approval.

## Governance Principle

Sales may propose. Finance approves.

The engine should make the decision transparent, not replace management judgment.
