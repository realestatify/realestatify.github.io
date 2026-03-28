# Employment Section: Currently Unemployed Checkbox + Add Button

## Overview
Restructure the current employment section to match the incomes/occupants pattern: replace the single hardcoded employment entry with a template-based add/remove list, add a "currently unemployed" checkbox that disables the section, and mark all template fields as required.

## Context
- Files involved: `index.html`, `app.js`
- Related patterns: incomes section (no-income checkbox + add-income btn + income-template), occupants section (no-ex-occupant checkbox + add-occupant btn + occupant-template)
- The hardcoded employment-type/company/role/emp-start-date fields (lines 302-331) are replaced by a template
- The toggleEmployerFields function in app.js (lines 143-164) is removed; the "currently unemployed" checkbox handles that state instead

## Development Approach
- No test suite in this project
- Complete each task fully before moving to the next
- Follow existing incomes/occupants patterns exactly

## Implementation Steps

### Task 1: Update index.html — restructure employment section

**Files:**
- Modify: `index.html`

- [x] Remove the four hardcoded employment labels/inputs (employment-type, company, role, emp-start-date) at lines 302-331
- [x] Add `<div id="employments-container"></div>` in their place
- [x] Add a `<fieldset class="grid">` with `<button type="button" id="btn-add-employment" class="secondary outline">Add employment</button>` and a `<label>` containing `<input type="checkbox" id="currently-unemployed" name="currently_unemployed" role="switch" /> Currently unemployed`
- [x] Add `<template id="employment-template">` with a fieldset containing: employment type select (required, aria-required, no "unemployed" option since checkbox covers that), company/employer text input (required, aria-required), role/title text input (required, aria-required), start date input (required, aria-required), and a Remove button with class `btn-remove-employment`
- [x] Use `__INDEX__` placeholders in all id/for/name attributes within the template

### Task 2: Update app.js — replace employment JS logic

**Files:**
- Modify: `app.js`

- [x] Remove the employment-type toggle block (variables: employmentType, companyLabel, roleLabel, startDateLabel, companyInput, roleInput, startDateInput, noEmployerTypes, toggleEmployerFields — lines 143-164)
- [x] Add currently-unemployed checkbox handler: get `currently-unemployed` checkbox, `btn-add-employment` button, and `employments-container`; on change, disable/enable the button and all fieldset inputs/selects in the container (same pattern as noIncome handler)
- [x] Add employment add-entry handler: counter + template clone pattern, replace `__INDEX__` in id/for/name, attach Remove listener, append to container (same pattern as incomes/occupants handlers)

### Task 3: Verify

- [x] Manually verify: add employment entries appear with all fields required (manual test - skipped, not automatable)
- [x] Manually verify: checking "currently unemployed" disables the add button and any existing entries (manual test - skipped, not automatable)
- [x] Manually verify: step validation blocks progress when required employment fields are empty (manual test - skipped, not automatable)
- [x] Move this plan to `docs/plans/completed/`
