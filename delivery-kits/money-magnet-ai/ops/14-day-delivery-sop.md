# Money Magnet AI - 14-Day Delivery SOP

Purpose: deliver a narrow, working AI revenue system in 14 calendar days without overpromising custom software.

## Definition of Done

A Money Magnet AI sprint is done when:
- The customer's site or landing page has an AI assistant or lead capture entry point.
- The assistant answers approved business questions within defined boundaries.
- A qualified lead can submit contact information.
- A booking path is available.
- The lead is logged in the agreed source of truth.
- The owner/team receives a notification.
- A simple follow-up sequence is active or ready for customer approval.
- The customer receives a handoff doc and 30-minute training.
- A QA checklist is signed off.

## Day-by-Day Plan

### Day 0: Paid kickoff prerequisite
Do not start the 14-day clock until:
- Payment/deposit is received.
- Decision maker is identified.
- Access checklist is complete or a staging-only exception is approved.
- Customer agrees to scope limits.

### Day 1: Intake and Revenue Leak Diagnosis
Actions:
- Review intake form.
- Identify primary revenue leak: missed leads, slow follow-up, poor qualification, no booking, or manual routing.
- Pick one primary conversion goal.
- Define ideal lead and disqualifiers.
- Confirm offer/pricing boundaries the AI may discuss.

Outputs:
- `customer-profile.md`
- approved conversion goal
- initial QA scenario list

### Day 2: Knowledge Base and Conversation Design
Actions:
- Convert business info into FAQ/knowledge base.
- Draft greeting, qualification flow, handoff rules, and refusal boundaries.
- Draft lead fields and booking CTA.

Outputs:
- `knowledge-base.md`
- `assistant-config.md`
- draft prompt

### Day 3: Landing/Website Entry Point
Actions:
- Decide installation mode: existing site widget, hosted landing page, or embedded form/chat.
- Write hero/CTA copy if needed.
- Prepare privacy/contact copy.

Outputs:
- widget placement plan or landing page draft

### Day 4-5: Assistant Build
Actions:
- Configure AI assistant prompt.
- Add FAQ and business context.
- Add qualification questions.
- Add collection fields: name, email, phone, service interest, urgency, notes.
- Add fallback: "I can connect you with the team."

Outputs:
- working assistant in staging

### Day 6: Lead Storage
Actions:
- Create Google Sheet/Airtable/CRM table.
- Map fields.
- Add source, timestamp, qualification score, next action, owner status.

Outputs:
- live lead table
- test lead row

### Day 7: Booking + Notifications
Actions:
- Connect booking link or calendar scheduler.
- Configure owner email notification.
- Add lead summary format.
- Test notification deliverability.

Outputs:
- successful booking test
- successful owner notification test

### Day 8-9: Follow-Up Automation
Actions:
- Create 3-message sequence.
- Keep copy short and human.
- Include reply path and booking CTA.
- Do not send until customer approves.

Outputs:
- approved follow-up copy
- sequence configured or staged

### Day 10: Analytics + Reporting
Actions:
- Track assistant opens, leads captured, bookings clicked, and source if feasible.
- Create weekly report template.

Outputs:
- event checklist
- weekly report template

### Day 11: QA
Actions:
- Run at least 20 customer-specific questions.
- Test happy path, edge cases, bad-fit leads, pricing questions, unsupported claims, and mobile.
- Fix failures.

Outputs:
- completed QA checklist

### Day 12: Install on Live Site
Actions:
- Install widget/script/form on production site.
- Verify SSL, mobile, load, and contact flows.
- Confirm no broken page layout.

Outputs:
- production URL
- screenshots or browser verification notes

### Day 13: Customer Training
Actions:
- 30-minute handoff call.
- Explain lead sheet/CRM, notifications, follow-up, and monthly review.
- Document how to request changes.

Outputs:
- handoff doc
- training complete

### Day 14: Launch Review
Actions:
- Review first test/live leads.
- Confirm acceptance criteria.
- Create monthly optimization backlog.

Outputs:
- signed launch checklist
- recurring management plan

## Scope Guardrails

Included in standard sprint:
- One website or landing page
- One assistant
- One lead destination
- One booking path
- One notification path
- One follow-up sequence
- Up to 20 approved FAQs
- Up to 3 revisions before launch

Not included unless separately scoped:
- custom CRM development
- multi-location routing
- HIPAA/PCI workflows
- payment processing
- multi-language parity testing beyond basic model response
- complex custom APIs
- guaranteed revenue or appointment volume

## Change Request Rule

If requested work is outside scope, classify it as:
1. monthly optimization backlog,
2. paid change request,
3. Aetheris Build discovery,
4. not recommended.
