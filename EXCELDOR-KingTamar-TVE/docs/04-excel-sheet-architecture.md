# 04 - Excel Sheet Architecture

## Goal

Define the worksheet structure for the TVE module.

## Sheets

### TVE_00_Guide
Short user instructions.

### TVE_01_Settings
Global settings such as rate, delivery date and approval threshold.

### TVE_02_Official_Plan
Approved baseline payment plan.

### TVE_03_Custom_Plan
Client requested payment plan.

### TVE_04_Result
Main result screen for sales and finance.

### TVE_05_QA
Validation and control checks.

## Design Rules

- Inputs are visually separated from calculations.
- Important outputs are shown at the top.
- Finance fields are protected.
- User fields are simple and clear.
- The module stays separate from the existing simulator.
