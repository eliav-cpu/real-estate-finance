# EXCELDOR King Tamar TVE

## Purpose

This repository folder defines the operating specification for the **EXCELDOR / King Tamar Time Value Engine (TVE)**.

The engine calculates the economic shell price of a real-estate presale payment schedule when payment dates or payment percentages change.

## Core Rule

The TVE engine applies only to the **shell price**.

It must never include:

- finishing package
- furniture package
- parking
- legal fees
- management / escort fees
- any other non-shell component

Those layers are commercial add-ons and must remain outside the time-value calculation.

## Business Objective

If a client asks for a custom payment plan, the company should be able to enter the payment dates and percentages and immediately understand:

1. whether the total payment schedule equals 100%;
2. whether the payment plan is economically equal to the official plan;
3. whether the client is receiving hidden credit;
4. what shell price should be approved;
5. whether management / CFO approval is required.

## Repository Index

### Root

- `README.md` - folder overview, product definition, status and file index.

### docs

- `docs/01-business-logic.md` - business logic and commercial reason for the engine.
- `docs/02-user-guide.md` - short user guide for sales, finance and management.
- `docs/04-excel-sheet-architecture.md` - recommended Excel sheet structure.
- `docs/05-approval-workflow.md` - approval flow, roles and audit trail.
- `docs/06-roadmap.md` - high-level development roadmap.

### specs

- `specs/01-calculation-spec.md` - calculation specification and validation logic.
- `specs/02-qa-checklist.md` - model QA and approval checklist.

### prompts

- `prompts/01-build-excel-engine.md` - prompt for building or rebuilding the Excel TVE module.

### examples

- `examples/01-sample-payment-plan.csv` - sample official and custom payment schedules.

## Operating Model

TVE is not a replacement for the King Tamar simulator.

It is a control layer above the simulator:

1. read approved shell price;
2. read approved baseline payment plan;
3. allow custom client payment plan;
4. compare timing value;
5. return adjusted shell price and approval status.

## Status Board

| Layer | Status | Notes |
|---|---|---|
| Business logic | Done | Core logic documented. |
| User guide | Done | English version added. |
| Calculation spec | Done | Conceptual formula logic documented. |
| QA checklist | Done | Basic QA rules added. |
| Excel architecture | Done | Sheet structure defined. |
| Approval workflow | Done | Roles and audit trail defined. |
| Roadmap | Done | High-level roadmap added. |
| Formula map | Pending | Content prepared, but file creation was blocked by connector checks. |
| Hebrew documentation | Pending | Connector blocked Hebrew file creation. |
| Excel implementation | Next | Apply the module to the latest working King Tamar workbook. |

## Next Build Step

The next practical step is to implement the TVE module inside the latest active King Tamar workbook as a separate set of sheets, without deleting or overwriting existing simulator logic.

Required TVE sheets:

- `TVE_00_Guide`
- `TVE_01_Settings`
- `TVE_02_Official_Plan`
- `TVE_03_Custom_Plan`
- `TVE_04_Result`
- `TVE_05_QA`

## Current Version

Version: `v1.1-docs-index`

Scope: documentation, specification, approval workflow and implementation blueprint for the Excel engine.
