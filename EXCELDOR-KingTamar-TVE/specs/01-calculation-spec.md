# 01 - Calculation Specification

## Core Idea

The engine compares two shell-only payment schedules:

1. the official company baseline plan
2. the custom client plan

Each payment receives an economic weight based on how far its payment date is from the proposal date.

## Inputs

- base shell price
- proposal date
- delivery date
- annual rate
- official payment percentages
- official payment dates
- custom payment percentages
- custom payment dates

## Calculation Logic

1. Convert annual rate into a monthly rate.
2. Count the months between proposal date and every payment date.
3. Discount every payment percentage by its timing.
4. Sum all discounted percentages into a plan factor.
5. Compare official plan factor to custom plan factor.
6. Calculate adjusted shell price.

## Adjusted Shell Price Rule

Adjusted shell price equals:

base shell price multiplied by official plan factor, divided by custom plan factor.

## Interpretation

- If the adjusted price equals the base shell price, the custom plan is economically neutral.
- If the adjusted price is higher, the custom plan delays money and requires approval or price increase.
- If the adjusted price is lower, the custom plan brings money earlier and improves company economics.

## Validation

The model must block calculation when:

- total percentages do not equal 100 percent
- a payment date is missing
- a payment date is before the proposal date
- base shell price is zero or negative
- custom plan factor is zero
- finish, furniture, parking or fees are referenced in the TVE calculation
