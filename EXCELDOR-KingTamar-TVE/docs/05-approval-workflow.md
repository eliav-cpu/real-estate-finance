# 05 - Approval Workflow

## Purpose

The TVE module supports commercial control. It does not replace management judgment.

## Roles

### Sales

- Enters client request.
- Explains that the request is subject to approval.
- Sends the internal approval text when required.

### Finance

- Owns the annual rate.
- Owns the approval threshold.
- Reviews material economic gaps.

### Management

- Approves exceptions.
- Decides whether to accept, reject or reprice a custom payment plan.

## Status Logic

### OK

The plan is economically neutral or within approved threshold.

### Review

The plan changes economics but may still be commercially acceptable.

### Finance Approval

The plan creates a material economic gap and must be approved before client commitment.

## Required Audit Trail

Every custom plan should keep:

- client name or deal id
- unit id
- proposal date
- base shell price
- selected official plan
- requested custom plan
- calculated gap
- approval status
- approver name
- approval date
