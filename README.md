# Chestnut Insurance Agency website preview

Static website generated with Node.js (zero external dependencies).

## Build and test

```bash
node build.mjs
node check.mjs
```

## GitHub Pages preview

The included `.github/workflows/main.yml` builds the website, runs QA, applies project-site paths and deploys to GitHub Pages.

## Before final launch

- Add the agency's Calendly URL in `src/config.mjs` (`calendlyUrl`). Consultation buttons currently fall back to Contact until this is configured.
- Connect enquiry forms to an email/CRM endpoint via `formEndpoint` in `src/config.mjs`.
- Confirm insurer relationships/product availability and regulatory/legal wording before publishing.
- Review the remaining migration items in `MIGRATION.md`.
