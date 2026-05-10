# n8n Workflow Spec - Money Magnet AI Lead Capture

This is a build spec, not a secret-bearing export. Create the actual workflow per customer using their credentials.

## Workflow Name

Money Magnet AI - Lead Capture and Follow-Up - [Client]

## Goal

When a qualified lead is captured by chat/form, log it, notify the owner, optionally send an approved follow-up email, and prepare weekly reporting.

## Nodes

### 1. Webhook Trigger
- Method: POST
- Path: `/money-magnet/[client-slug]/lead`
- Auth: header secret or n8n basic auth
- Expected payload:

```json
{
  "lead_id": "uuid",
  "created_at": "iso datetime",
  "source": "website_chat",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1...",
  "service_interest": "quote request",
  "timeline": "this month",
  "budget": "$2k-$5k",
  "location": "Harrisburg PA",
  "conversation_summary": "Visitor needs...",
  "booking_clicked": false
}
```

### 2. Validate Required Fields
Rules:
- name exists
- at least email or phone exists
- service_interest exists
- conversation_summary exists

If invalid:
- log to error sheet/table
- notify Aetheris only, not customer owner

### 3. Normalize Lead
Add fields:
- qualification_score
- fit_status
- next_action
- owner_status = `new`

Simple scoring:
- +25 has clear service interest
- +20 has timeline under 30 days
- +20 has phone and email
- +20 service area match
- +15 budget present or quote-ready

Fit status:
- 80-100 hot
- 50-79 warm
- 20-49 cold
- below 20 review

### 4. Save to Google Sheet / Airtable / CRM
Default first implementation: Google Sheet using `google-sheets-lead-schema.csv`.

### 5. Owner Notification
Send email:
Subject: `New [Client] lead: [service_interest] - [fit_status]`

Body:
- name/contact
- service interest
- timeline
- summary
- recommended next action
- booking status
- direct sheet/CRM link

### 6. Visitor Follow-Up Email - Optional
Only enable if:
- customer approved copy
- sender/domain is ready
- visitor provided email
- privacy/compliance requirements allow it

Follow-up 1: immediate confirmation
Follow-up 2: 24 hours if no booked/contacted status
Follow-up 3: 72 hours if no response

### 7. Error Handler
On any failure:
- send Aetheris internal alert
- include workflow name, node, lead_id, sanitized error
- never include API keys/secrets

## Weekly Report Workflow

Separate scheduled workflow:
- every Monday 8 AM customer timezone
- read sheet rows from previous week
- count leads by fit_status/source
- list top questions if available
- email customer report using `weekly-report-template.md`

## Verification

Before launch:
- send valid test payload
- send invalid payload
- confirm lead row appears
- confirm owner email received
- confirm error path works
- confirm no duplicate row on retry if lead_id already exists
