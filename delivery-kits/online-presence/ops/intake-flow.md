# Online Presence — Intake Flow

## Overview

This is the complete customer journey from first click to project kickoff.

## Step-by-Step Flow

### 1. Customer clicks CTA
- Source: `/online-presence.html` hero CTA or plan buttons
- Action: Redirects to `/intake.html`

### 2. Customer fills intake form
- Selects tier (Starter / Growth / Authority)
- Provides business info (name, industry, location, website)
- Describes current challenges
- Submits form

### 3. Form submission
- Data sent via Formspree (free tier) or your backend
- Customer sees thank-you page with Google Calendar booking link

### 4. Strategy call (30 min)
- Understand business, customers, competitors
- Confirm tier and any customizations
- Set expectations for timeline

### 5. Send SOW + Stripe invoice
- Use `templates/sow.md`
- Include setup fee + first month
- Customer signs + pays

### 6. Kickoff clock starts
- Payment + access received
- Begin 7-14 day build per tier

### 7. Build + QA
- Follow `7-day-delivery-sop.md`
- Run `qa-checklist.md` pre-launch

### 8. Launch + handoff
- Site goes live
- Handoff doc delivered
- Monthly management begins

## Time to First Value

| Phase | Duration |
|-------|----------|
| Click to call booked | < 5 minutes |
| Call to SOW sent | Same day |
| SOW to payment | 1-3 days |
| Payment to launch | 7-14 days |
