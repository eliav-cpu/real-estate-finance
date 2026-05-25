# EXCELDOR King Tamar TVE

## Purpose

This repository folder defines the operating specification for the **EXCELDOR / King Tamar Time Value Engine (TVE)**.

The engine is designed to calculate the economic price of a real-estate shell-only payment schedule when payment dates or payment percentages change.

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

## Folder Map

- `docs/` - business and product documentation
- `specs/` - technical specs and acceptance tests
- `prompts/` - build prompts for future Excel / SaaS automation
- `examples/` - example payment schedules and calculation cases

## Current Status

Version: `v1.0-docs`

Scope: documentation and implementation blueprint for the Excel engine.
