# PRIME Documents OS — RTL Legal UX System

Purpose: create a repeatable document system for PRIME Global Assets forms and agreements: reservation forms, marketing/accompaniment agreements, proposal sheets and investor service documents.

This folder defines the standards that must be applied before generating any client-facing Hebrew DOCX/PDF.

## Core rule

The document is not a brochure. It is a legal business document with light PRIME branding.

Use:
- clean legal hierarchy;
- real RTL, not only right alignment;
- fixed reusable sections;
- controlled tables;
- predictable placeholders;
- one source of truth for service tracks.

Avoid:
- automatic Word numbering that moves numbers to the left;
- mixed visual systems in one document;
- excessive color blocks;
- adding apartment/unit fields into the marketing agreement;
- changing legal structure without explicit approval.

## Sources reviewed

Design and implementation principles were taken from these public/open-source patterns:

1. Hebrew document generation pattern — Hebrew DOCX/PDF/PPTX with full RTL support and proper Hebrew typography.
2. Docxtemplater pattern — editable Word templates with placeholders, loops, conditions and table generation.
3. Shadcn multi-form pattern — clean form UX, multi-step flows, preview, validation, two-column layouts and reusable components.
4. Dynamic form builder pattern — consistent fields, validation and reusable UI components.

## PRIME document build sequence

1. Identify document type:
   - Reservation / apartment hold form.
   - Marketing, strategy and accompaniment agreement.
   - Proposal / investor offer.

2. Select base template:
   - Legal agreement = classic legal layout.
   - Offer/reservation = visual proposal layout.

3. Apply RTL engine:
   - no automatic numbering;
   - manual section markers as RTL text;
   - tables set as RTL;
   - each cell has RTL paragraph properties;
   - checkboxes appear on the right side of the label;
   - prices, percentages and English service names are isolated inside cells.

4. Apply PRIME design tokens:
   - navy for hierarchy;
   - graphite for body text;
   - soft gray for table headers;
   - very limited champagne/gold accents;
   - no heavy blocks unless explicitly requested.

5. Validate before delivery:
   - open/render to image;
   - confirm all section numbers are right aligned;
   - confirm all checkboxes are right aligned;
   - confirm SMART / COMPASS / INFINITY cells do not break RTL;
   - confirm agreement structure remains unchanged unless approved.

## Current flagship template

`templates/marketing-strategy-agreement-v19.md`

This is the canonical structure for the general PRIME marketing, strategy and accompaniment agreement. It intentionally excludes apartment number, apartment price, parking, floor, area and unit details. Those belong to the reservation form only.
