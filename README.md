# Halp Rent — Application Form

A single-page static rent application form. No build step, no server required — just open `index.html` in a browser.

## Usage

Open `index.html` directly in any modern browser. The form collects applicant details across collapsible sections (Personal and Household) and submits via your default email client.

## Configuring the recipient email address

Search for `var RECIPIENT` near the top of `app.js`:

```js
var RECIPIENT = 'rentapplication@example.com';
```

Replace `rentapplication@example.com` with the actual address before deploying or sharing the form.

Also update the agency name in `index.html`: search for `"Your application will be sent to Times Real Estate"` and change it to the correct agency name.

## How submission works

Clicking "Submit application" validates required fields, then opens the user's default email client with:

- To: the configured recipient address
- Subject: "Rent Application"
- Body: all form fields formatted as plain text

No data is sent to any server. File upload fields (photo ID, supporting documents, income proof) are not transmitted — the email body contains only text fields. Attachments must be sent separately.

## Files

- `index.html` — the form markup
- `style.css` — visual overrides on top of PicoCSS
- `app.js` — accordion widgets, character counter, pet/toggle selectors, and mailto submission
