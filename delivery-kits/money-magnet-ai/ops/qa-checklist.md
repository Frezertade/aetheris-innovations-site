# Money Magnet AI - QA Checklist

Client:
Tester:
Date:
Environment:

## Pre-Launch Setup

- [ ] Approved knowledge base loaded
- [ ] Assistant prompt includes safety boundaries
- [ ] Booking link correct
- [ ] Lead destination created
- [ ] Notification recipient confirmed
- [ ] Privacy/contact language present
- [ ] Mobile layout checked

## Conversation Tests

Run at least 20 real questions.

| # | Scenario | Expected Result | Pass/Fail | Notes |
|---:|---|---|---|---|
| 1 | Basic service question | Accurate answer + next step | | |
| 2 | Pricing question | Uses approved pricing language only | | |
| 3 | Location/service area | Correct boundaries | | |
| 4 | Booking request | Gives booking CTA | | |
| 5 | Quote request | Captures lead details | | |
| 6 | Bad-fit service | Politely refuses/routes | | |
| 7 | Unsupported guarantee | Does not guarantee results | | |
| 8 | Urgent human request | Escalates/captures info | | |
| 9 | Competitor comparison | Professional, no false claims | | |
| 10 | Vague visitor | Asks one qualifying question | | |
| 11 | Long visitor message | Summarizes and helps | | |
| 12 | Angry visitor | Calm escalation | | |
| 13 | Sensitive data request | Does not collect unnecessary sensitive data | | |
| 14 | After-hours question | Explains next step | | |
| 15 | Mobile visitor | Usable on phone | | |
| 16 | Email typo | Still captures or asks clarification | | |
| 17 | Phone-only lead | Handles allowed contact path | | |
| 18 | No budget/timeline | Qualifies politely | | |
| 19 | Existing customer | Routes appropriately | | |
| 20 | Unknown question | Says unsure and offers team follow-up | | |

## Lead Flow Tests

- [ ] Test lead submits successfully
- [ ] Required fields are enforced or requested
- [ ] Lead appears in Sheet/CRM/Airtable
- [ ] Lead timestamp is correct
- [ ] Lead source is captured
- [ ] Conversation summary is useful
- [ ] Owner notification arrives
- [ ] Booking link opens correctly
- [ ] Follow-up sequence is staged or sends only when approved

## Production Tests

- [ ] Live page loads over HTTPS
- [ ] Widget/assistant opens
- [ ] No console-breaking errors
- [ ] Works on mobile viewport
- [ ] Does not cover critical page CTAs
- [ ] Contact form still works
- [ ] Analytics/events configured if in scope

## Approval

Launch approved by:
Date:
Open issues:
