---
# Extract Shared Template List Helper in app.js

## Overview
There are 4 nearly identical blocks in app.js that clone an HTML `<template>`, rewrite `__INDEX__` placeholders in id/for/name attributes, wire up a remove button, and append to a container. Extract this repeated logic into a single `setupTemplateList` helper function.

## Context
- Files involved: `app.js`
- Repeated pattern appears at lines 82-109 (prevAddress), 129-154 (employment), 174-199 (income), 217-242 (occupant)
- No test infrastructure exists (static HTML/JS site) — no test tasks needed
- Related patterns: none; this is a pure in-file refactor

## Development Approach
- Refactor only — no behavior change
- Keep disable-on-checkbox logic (currently-unemployed, no-income, no-ex-occupant blocks) separate; it is not part of the shared pattern

## Implementation Steps

### Task 1: Add setupTemplateList helper and replace duplicate blocks

**Files:**
- Modify: `app.js`

- [x] Add `function setupTemplateList(addBtn, container, template, removeBtnSelector)` inside the DOMContentLoaded callback, before the first usage. It should: increment a local counter, clone the template, replace `__INDEX__` in id/for/name attributes, wire the remove button, and append to container.
- [x] Replace the prevAddress block (lines 82-109) with a guard + `setupTemplateList(btnAddPrevAddress, prevAddressesContainer, prevAddressTemplate, ".btn-remove-prev-address")`
- [x] Replace the employment block (lines 129-154) with a guard + `setupTemplateList(btnAddEmployment, employmentsContainer, employmentTemplate, ".btn-remove-employment")`
- [x] Replace the income block (lines 174-199) with a guard + `setupTemplateList(btnAddIncome, incomesContainer, incomeTemplate, ".btn-remove-income")`
- [x] Replace the occupant block (lines 217-242) with a guard + `setupTemplateList(btnAddOccupant, occupantsContainer, occupantTemplate, ".btn-remove-occupant")`
- [x] Verify app.js still loads without errors and all four add/remove flows work in the browser (manual test - skipped, not automatable)

### Task 2: Update documentation

- [x] update CLAUDE.md if internal patterns changed (no CLAUDE.md exists; no external docs needed for this internal refactor)
- [x] move this plan to `docs/plans/completed/`
