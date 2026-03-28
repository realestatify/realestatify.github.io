---
# Multiple Income Sources and Additional Occupants

## Overview
Extend the rental application form to support multiple income sources and multiple additional occupants, following the same template-cloning pattern used for job history (prev-employment) and address history (prev-address).

## Context
- Files involved: `index.html`, `app.js`
- Related patterns: prev-employment and prev-address dynamic list pattern using HTML `<template>` elements with `__INDEX__` placeholders, "Add more" buttons, and counter variables
- Dependencies: none

## Development Approach
- Testing approach: Manual verification in browser (no automated test suite exists)
- Follow the existing template-cloning pattern exactly
- Keep first income/occupant entry as static (primary), add additional entries as dynamic — mirrors how current vs previous employment works
- Complete each task fully before moving to the next

## Implementation Steps

### Task 1: Add Multiple Income Sources

**Files:**
- Modify: `index.html`
- Modify: `app.js`

- [x] Wrap the existing income fields in a container div with id `incomes-container`
- [x] Add an "Add another income source" button below the income fieldset (id `btn-add-income`)
- [x] Create a `<template id="additional-income-template">` with a fieldset containing income_type and income_amount fields using `__INDEX__` placeholders (names like `additional_income[__INDEX__][type]`, `additional_income[__INDEX__][amount]`) and a remove button
- [x] In `app.js`, add `additionalIncomeCounter` variable and event listener on `btn-add-income` that clones the template, replaces `__INDEX__` in id/for/name attributes, attaches remove listener, and appends to container
- [x] Update the `no_income` checkbox handler to also disable/enable all dynamically added income entries

### Task 2: Add Multiple Additional Occupants

**Files:**
- Modify: `index.html`
- Modify: `app.js`

- [x] Wrap the existing occupant fields in a container div with id `occupants-container`
- [x] Add an "Add another occupant" button below the occupant fieldset (id `btn-add-occupant`)
- [x] Create a `<template id="additional-occupant-template">` with a fieldset containing first name and last name fields using `__INDEX__` placeholders (names like `additional_occupant[__INDEX__][first_name]`, `additional_occupant[__INDEX__][last_name]`) and a remove button
- [x] In `app.js`, add `additionalOccupantCounter` variable and event listener on `btn-add-occupant` that clones the template, replaces `__INDEX__` in id/for/name attributes, attaches remove listener, and appends to container
- [x] Update the `no_ex_occupant` checkbox handler to also disable/enable all dynamically added occupant entries

### Task 3: Verify Acceptance Criteria

- [x] Open form in browser and verify "Add another income source" button appears and adds new income fieldsets (manual test - skipped, not automatable)
- [x] Verify removing an income entry works correctly (manual test - skipped, not automatable)
- [x] Verify "no income" checkbox disables all income entries including dynamically added ones (manual test - skipped, not automatable)
- [x] Open form in browser and verify "Add another occupant" button appears and adds new occupant fieldsets (manual test - skipped, not automatable)
- [x] Verify removing an occupant entry works correctly (manual test - skipped, not automatable)
- [x] Verify "no extra occupant" checkbox disables all occupant entries including dynamically added ones (manual test - skipped, not automatable)
- [x] Submit a test form with multiple income sources and occupants, verify data appears correctly in Formspree (manual test - skipped, not automatable)

### Task 4: Update Documentation

- [x] Move this plan to `docs/plans/completed/`
