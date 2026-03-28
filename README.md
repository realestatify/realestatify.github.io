# Realestatify — Application Form

A single-page static rent application form. No build step, no server required — just open `index.html` in a browser.

## Usage

Open `index.html` directly in any modern browser. The form collects applicant details across a 7-step wizard and submits to Formspree.

## How submission works

Clicking "Submit application" validates required fields. When all fields are valid the form posts to Formspree (https://formspree.io/f/xgopozbe), which emails the submission to the configured recipient and redirects the user to a Formspree thank-you page.

File uploads (photo ID, supporting documents, income proof) are included in the submission via multipart/form-data encoding.

## Files

- `index.html` — the form markup
- `style.css` — visual overrides on top of PicoCSS
- `app.js` — multi-step wizard navigation, character counter, pet/toggle selectors, and form validation
