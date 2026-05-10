# Money Magnet AI Delivery Kit

This kit turns the public Aetheris promise into a repeatable, sellable, and deliverable implementation sprint.

Use it for the first 3-10 founder-led beta customers before building more custom software. The goal is to sell one narrow outcome, deliver it fast, learn from real customer usage, and convert repeated work into reusable software.

## What This Kit Delivers

Money Magnet AI is a 14-day implementation sprint that creates a practical AI revenue system:

1. website visitor asks a question,
2. AI answers from approved business knowledge,
3. AI qualifies the visitor,
4. visitor submits contact details,
5. lead is saved to a sheet/CRM,
6. owner is notified,
7. visitor is routed to book or receive follow-up,
8. weekly report shows what happened.

## Who It Is For

Best fit:
- local service businesses
- medspas
- dental/health-adjacent clinics, with compliance boundaries
- contractors/home services
- law firms, with legal-advice boundaries
- B2B service firms
- logistics/trucking companies
- professional services

Bad fit for first sprint:
- customers needing complex regulated workflows
- customers expecting guaranteed sales volume
- customers with no website traffic and no acquisition plan
- customers needing a custom SaaS product instead of lead capture
- customers unwilling to provide access or approve copy quickly

## File Map

### Operations

- `ops/14-day-delivery-sop.md`
  The day-by-day delivery process and scope guardrails.

- `ops/qa-checklist.md`
  Pre-launch QA checklist with 20 conversation tests and lead-flow verification.

- `ops/proposal-one-pager.md`
  Simple sales proposal language for calls, emails, and PDF proposals.

### Templates

- `templates/customer-intake-form.md`
  Required intake form. Do not start the launch countdown until this is complete.

- `templates/knowledge-base-template.md`
  Converts customer business info into approved assistant context.

- `templates/assistant-prompt-template.md`
  Base system prompt for a customer assistant.

- `templates/sow-template.md`
  Statement of Work with scope, acceptance criteria, exclusions, and monthly management language.

- `templates/weekly-report-template.md`
  Customer-facing weekly performance report.

- `templates/handoff-doc-template.md`
  Launch handoff doc for the customer.

### Workflows

- `workflows/google-sheets-lead-schema.csv`
  Default lead log schema.

- `workflows/n8n-money-magnet-workflow-spec.md`
  n8n workflow build spec for lead capture, notification, follow-up, and weekly reporting.

- `workflows/sample-webhook-payload.json`
  Test payload for automation and API/webhook development.

### Demos

- `demos/medspa-demo-outline.md`
  First industry demo outline. Use this to build a sales demo quickly.

## Standard Offer Ladder

### Founder Beta

Use for first 3 customers.

- Setup: $750-$1,500
- Monthly: $297-$750/mo
- Require testimonial/case study permission if successful
- Keep scope strict

### Standard Money Magnet AI

- Setup: $1,500-$2,500
- Monthly: $497-$1,500/mo
- One assistant, one lead destination, one booking path, one follow-up sequence

### Custom / Multi-System

Move to Aetheris Build discovery if customer needs:
- custom app
- complex CRM integration
- multi-location routing
- regulated data handling
- custom dashboard
- payment flows

Discovery: $500-$2,500 before quoting build.

## Delivery Workflow

1. Sales call / Revenue Audit
2. Send `proposal-one-pager.md`
3. Send SOW from `sow-template.md`
4. Collect payment/deposit
5. Send `customer-intake-form.md`
6. Build knowledge base from `knowledge-base-template.md`
7. Configure assistant using `assistant-prompt-template.md`
8. Build lead workflow using `n8n-money-magnet-workflow-spec.md`
9. QA with `qa-checklist.md`
10. Launch
11. Train customer with `handoff-doc-template.md`
12. Report weekly with `weekly-report-template.md`

## Internal Execution Rule

Every customer implementation should create a copied customer folder:

`delivery-kits/money-magnet-ai/customers/YYYY-MM-client-slug/`

Recommended customer folder files:
- `intake.md`
- `knowledge-base.md`
- `assistant-config.md`
- `sow.md`
- `qa.md`
- `handoff.md`
- `weekly-reports/`

Do not commit secrets, API keys, credentials, private customer PII, or real lead data into git.

## First Demo to Build

Start with the medspa demo:

`demos/medspa-demo-outline.md`

Why:
- high-value leads
- clear booking CTA
- repetitive FAQs
- easy safety boundaries
- strong ROI story

Demo goal:
Show the full flow from visitor question to lead sheet row and owner notification using fake/demo data.

## Quality Bar

Before calling a system launched:
- test 20 realistic questions
- verify lead capture
- verify owner notification
- verify booking link
- verify mobile layout
- verify no unsupported claims
- verify handoff doc is delivered

## CEO Rule

Protect the business by controlling scope. If the customer asks for more, classify it as:

1. included now,
2. monthly optimization backlog,
3. paid change request,
4. custom build discovery,
5. not recommended.

Money Magnet AI is not unlimited custom software. It is a focused revenue system sprint.
