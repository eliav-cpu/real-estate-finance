# 03 - Data Schema

## Entity: Deal

| Field | Type | Required | Notes |
|---|---:|---:|---|
| deal_id | text | yes | Unique internal identifier |
| project_name | text | yes | Example: King Tamar |
| unit_id | text | yes | Unit selected in simulator |
| client_name | text | no | Optional in model, required in CRM |
| base_shell_price | number | yes | Shell price only |
| currency | text | yes | USD, EUR, ILS or GEL |
| proposal_date | date | yes | Date used for PV calculation |
| delivery_date | date | yes | Expected delivery date |
| official_plan_id | text | yes | A, B, C or approved baseline |
| custom_plan_id | text | yes | CUSTOM or named plan |
| annual_rate | percent | yes | Company approved rate |

## Entity: Payment Line

| Field | Type | Required | Notes |
|---|---:|---:|---|
| plan_id | text | yes | Official or custom plan |
| stage_name | text | yes | Signature, year 1, delivery, etc. |
| payment_percent | percent | yes | Must sum to 100 percent per plan |
| payment_date | date | yes | Date of expected payment |
| months_from_proposal | number | yes | Calculated field |
| pv_factor | number | yes | Calculated field |

## Entity: Result

| Field | Type | Required | Notes |
|---|---:|---:|---|
| official_plan_factor | number | yes | Sum of official discounted payments |
| custom_plan_factor | number | yes | Sum of custom discounted payments |
| adjusted_shell_price | number | yes | Price preserving economics |
| economic_gap | number | yes | Adjusted minus base |
| approval_status | text | yes | Approved, Review, Finance Approval, Rejected |
| internal_approval_text | text | yes | For management use |
| client_safe_text | text | yes | For client communication |

## Boundary Fields

The following fields may exist in the workbook but must not be used in the TVE price calculation:

- finish_package_price
- furniture_price
- parking_price
- legal_fee
- escort_fee
- management_fee
