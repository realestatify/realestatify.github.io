---
# Replace Accordion with Multi-Step Form Wizard

## Overview
Convert the 7 `<details>` accordion sections into a sequential multi-step wizard. Users navigate forward and backward between steps using Prev/Next buttons. Each step validates required fields before allowing advancement. The final step has the Submit button.

## Context
- Files involved: `index.html`, `app.js`
- Related patterns: PicoCSS for styling, vanilla JS for behaviour, `aria-invalid` for field validation
- Dependencies: none (PicoCSS already loaded)

## Development Approach
- **Testing approach**: manual browser testing (no test framework present)
- Complete each task fully before moving to the next
- Keep vanilla JS, no framework

## Implementation Steps

### Task 1: Restructure index.html for wizard layout

**Files:**
- Modify: `index.html`

- [x] Replace each `<details>` element with a `<div class="form-step" data-step="N" hidden>` (N = 1..7), keeping all inner content intact
- [x] Remove `<summary>` tags, replace with plain `<h3>` headings (content stays)
- [x] Remove `<hr>` separators between steps (no longer needed)
- [x] Keep `<section>` group labels (Personal/Household) visible per step as a `<small>` or `<p class="step-section-label">` above the `<h3>` heading
- [x] Remove the `<section>` wrappers as structural containers (fold content into flat step divs)
- [x] Add a step indicator above the form: `<p id="step-indicator">Step 1 of 7</p>`
- [x] Add a navigation row below the form steps: Back button + Next button + Submit button (submit hidden until last step)
- [x] Set first step to not have `hidden` attribute (visible by default)

Steps and their section labels:
1. Personal details (Personal)
2. Address history (Personal)
3. Employment (Personal)
4. Finances (Personal)
5. Emergency contact (Personal)
6. People (Household)
7. Pets (Household)

### Task 2: Rewrite app.js for step navigation

**Files:**
- Modify: `app.js`

- [x] Implement `showStep(n)` that hides all `.form-step` divs and shows only step n, updates step indicator text, and toggles Back/Next/Submit button visibility (Back hidden on step 1, Submit shown only on last step, Next hidden on last step)
- [x] Wire Back button: decrement current step, call `showStep`
- [x] Wire Next button: run `validateStep()` on current step's required fields — set `aria-invalid="true"` on blanks, focus first invalid field, return early; if valid, increment and call `showStep`
- [x] `validateStep()`: queries `[required]` within the current visible step div only
- [x] On form submit: run full validation across all steps (existing logic adapted), prevent submit if any required field is empty
- [x] Retain existing dynamic behaviours: character counter for about-me, no-income checkbox disabling, no-ex-occupant checkbox disabling, employment-type field visibility
- [x] Clear `aria-invalid` on input (existing logic retained, scoped to whole form)

### Task 3: Style step indicator and navigation

**Files:**
- Modify: `index.html` (inline `<style>` block)

- [x] Style `#step-indicator` as muted small text (use `--pico-muted-color`)
- [x] Style `.form-step-nav` flex row with space-between for Back and Next/Submit buttons
- [x] Ensure Back button uses secondary/outline style (PicoCSS `role="button"` or secondary class)

### Task 4: Verify acceptance criteria

- [x] Navigate forward through all 7 steps — each step shows correct content (manual test - not automatable)
- [x] Back navigation works from step 2 onward; Back button hidden on step 1 (manual test - not automatable)
- [x] Required field validation blocks Next on steps with empty required fields (manual test - not automatable)
- [x] Submit button appears only on last step (manual test - not automatable)
- [x] Existing dynamic behaviours work (no-income disables fields, employment type hides fields, occupant checkbox disables names, character counter works) (manual test - not automatable)
- [x] Form submits successfully when all required fields are filled (manual test - not automatable)

### Task 5: Update documentation

- [x] Move this plan to `docs/plans/completed/`
