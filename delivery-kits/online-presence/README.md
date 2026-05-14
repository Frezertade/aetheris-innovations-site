# Online Presence — Delivery Kit

Complete delivery system for the Aetheris Online Presence product (website + AI chat + local SEO + lead automation).

## File Map

| File | Purpose |
|------|---------|
| `ops/intake-flow.md` | Full intake from click to kickoff |
| `ops/provisioning-playbook.md` | Technical setup per tier |
| `ops/7-day-delivery-sop.md` | Day-by-day build process |
| `ops/monthly-management-sop.md` | Monthly recurring work |
| `ops/qa-checklist.md` | Pre-launch verification |
| `templates/intake-form.html` | Ready-to-deploy intake form (POSTs to `/api/online-presence-intake`) |
| `templates/handoff-doc.md` | Customer training document |
| `templates/monthly-report.md` | Monthly performance report |
| `templates/sow.md` | Statement of Work |

## Quick Links

- Sales page: `/online-presence.html`
- Intake form: `/intake.html` (POSTs to `/api/online-presence-intake` → Google Sheet + Gmail notification)
- Contact form: `/index.html` (POSTs to `/api/contact-intake` → Google Sheet + Gmail notification)
- Booking link: https://calendar.app.google/JajCvPZdws3fpAL18
- Stripe payment links: Run `create-stripe-links.sh` after `stripe login`

## Tiers

| Tier | Setup | Monthly | Timeline |
|------|-------|---------|----------|
| Starter | $499 | $99/mo | 7 days |
| Growth | $1,500 | $199/mo | 10-14 days |
| Authority | $3,500 | $499/mo | 14 days |
