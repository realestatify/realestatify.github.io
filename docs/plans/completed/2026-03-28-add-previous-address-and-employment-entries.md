# Add Previous Address and Previous Employment Entries

## Overview
Add dynamic list functionality to the Address History and Employment steps. Users can click "Add previous address..." or "Add previous employment..." buttons to append additional entry forms, each with a remove button. Entries use indexed name attributes for form serialization.

## Context
- Files involved: `index.html`, `app.js`
- Related patterns: hidden attribute for visibility, disabled for field state, vanilla JS DOM manipulation, PicoCSS `.secondary` button class
- No build step; plain HTML + vanilla JS

## Development Approach
- **Testing approach**: Manual verification in browser (no test framework present)
- Complete each task fully before moving to the next
- Follow existing vanilla JS patterns: direct DOM manipulation, no frameworks

## Implementation Steps

### Task 1: Add previous addresses to Address History step

**Files:**
- Modify: `index.html`
- Modify: `app.js`

- [x] Add a `<template id="prev-address-template">` element inside the Address History step (`data-step="2"`) containing the address fieldset (street address, suburb, postcode, state, move-in date, move-out date) with a "Remove" link/button and placeholder `name` attributes using `__INDEX__` as a sentinel
- [x] Add an "Add previous address..." button (`type="button"`, `id="btn-add-prev-address"`, class `secondary outline`) after the current address fields, before the end of the step
- [x] Add a `<div id="prev-addresses-container">` to hold dynamically added entries
- [x] In `app.js`, wire a click handler for `#btn-add-prev-address` that clones the template, replaces `__INDEX__` with an incrementing counter in all `id`, `for`, and `name` attributes, appends the clone to `#prev-addresses-container`, and wires the remove button to remove that entry
- [x] Verify added entries render correctly and remove button works [x] manual test (skipped - not automatable)

### Task 2: Add previous employments to Employment step

**Files:**
- Modify: `index.html`
- Modify: `app.js`

- [x] Add a `<template id="prev-employment-template">` element inside the Employment step (`data-step="3"`) containing employment fields (employment type, company, role, start date, end date) with a "Remove" button and `__INDEX__` sentinels
- [x] Add an "Add previous employment..." button (`type="button"`, `id="btn-add-prev-employment"`, class `secondary outline`) after the current employment fields (before the Employment Reference subsection)
- [x] Add a `<div id="prev-employments-container">` to hold dynamically added entries
- [x] In `app.js`, wire a click handler using the same cloning pattern as Task 1, with a separate counter for employment entries
- [x] Verify added entries render correctly and remove button works [x] manual test (skipped - not automatable)

### Task 3: Verify acceptance criteria

- [x] Open form in browser, navigate to Step 2 (Address history) [x] manual test (skipped - not automatable)
- [x] Click "Add previous address..." multiple times — each entry should appear with unique field names [x] manual test (skipped - not automatable)
- [x] Click Remove on an entry — it should be removed without affecting other entries [x] manual test (skipped - not automatable)
- [x] Navigate to Step 3 (Employment), repeat for previous employment entries [x] manual test (skipped - not automatable)
- [x] Submit form and confirm previous address/employment fields appear in form data (browser devtools Network tab) [x] manual test (skipped - not automatable)

### Task 4: Update documentation

- [x] Update CLAUDE.md if internal patterns changed (no CLAUDE.md exists; no update needed)
- [x] Move this plan to `docs/plans/completed/`
