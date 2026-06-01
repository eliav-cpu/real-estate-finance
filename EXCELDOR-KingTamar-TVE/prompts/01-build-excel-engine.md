# 01 - Build Excel Engine Prompt

Act as a senior Excel financial model architect and real-estate CFO.

Build a Time Value Engine for a real-estate presale simulator.

Rules:

1. Do not delete existing sheets.
2. Do not overwrite existing simulator formulas.
3. Add the engine as separate sheets.
4. Calculate shell price only.
5. Exclude finish, furniture, parking and fees.
6. Allow the user to enter custom payment dates and percentages.
7. Compare the custom plan to the official baseline plan.
8. Return adjusted shell price, economic gap and approval status.
9. Add a simple user guide sheet.
10. Add QA checks.

Required sheets:

- TVE_00_Quick_Guide
- TVE_01_Settings
- TVE_02_Official_Plan
- TVE_03_Custom_Plan
- TVE_04_Comparison
- TVE_05_Approval_Text
- TVE_06_QA

The output must be usable by sales, management and finance.
