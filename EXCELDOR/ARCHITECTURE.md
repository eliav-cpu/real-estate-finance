# EXCELDOR Architecture

## 1. Product Definition

EXCELDOR is a modular real-estate finance operating layer built on top of reusable finance formulas.

It should support Excel files, Google Sheets, SaaS dashboards, and PDF proposal generation without changing the underlying calculation logic.

## 2. System Layers

### A. Source Layer

Stores raw inputs and external references.

Examples:

- inventory tables
- project price lists
- unit types
- payment paths
- finish packages
- ADR / occupancy / RevPAR market data
- financing terms
- VAT / tax assumptions
- management fees
- maintenance reserves

### B. Assumption Layer

Normalizes all assumptions into controlled fields.

Examples:

- base price
- discount
- delivery date
- payment schedule
- occupancy
- ADR
- expense ratio
- financing rate
- management fee
- annual appreciation
- exit cap rate

### C. Calculation Layer

Runs financial logic.

Core functions should include:

- annual gross potential income
- gross operating income
- net operating income
- cap rate
- estimated property value
- cash flow before tax
- cash flow after tax
- break-even ratio
- return on equity
- ROI
- payment value adjustment
- scenario sensitivity

### D. Scenario Layer

Creates controlled comparison views.

Required scenarios:

- Conservative
- Base
- Optimistic
- Custom

Each scenario must show which assumptions changed and how the final investor output changed.

### E. Sales / Client Layer

Connects the finance model to the client journey.

Fields:

- client name
- budget
- available equity
- preferred payment structure
- target monthly income
- risk comfort
- investment horizon
- PRIME money engine
- recommended path

### F. Output Layer

Generates clean management and investor outputs.

Outputs:

- dashboard
- client offer
- payment plan
- investor snapshot
- PDF proposal
- Excel export
- CRM summary

### G. Governance Layer

Controls model quality.

Required controls:

- missing input checks
- formula error checks
- source verification
- scenario consistency
- version log
- approval status
- investor release gate

## 3. Standard Flow

```text
Source Data
  -> Assumption Registry
  -> Calculation Engine
  -> Scenario Engine
  -> QA Gate
  -> Dashboard / Proposal / Export
```

## 4. Naming Convention

Use clear English technical names for files and modules. Hebrew/RTL can be handled in output templates.

Examples:

- `payment_value_engine`
- `scenario_lab`
- `investor_output`
- `qa_gate`
- `client_profile`
- `project_assumptions`

## 5. Future SaaS Migration

Every Excel model should be designed so it can later become a SaaS module.

Excel tab today -> SaaS module tomorrow:

- `INPUTS` -> project setup screen
- `ASSUMPTIONS` -> assumption editor
- `SCENARIOS` -> scenario lab
- `DASHBOARD` -> investor dashboard
- `CLIENT_OUTPUT` -> proposal generator
- `QA` -> governance engine
