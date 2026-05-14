# Google Sheets + Gmail Setup for Online Presence Intake

## What You Need

Your site already has a working pattern (medspa-demo-lead.js) that uses Google OAuth to:
1. Write to Google Sheets
2. Send email via Gmail API

You need the same env vars for the Online Presence intake.

## Required Env Vars

| Variable | What it is | Where to get it |
|----------|-----------|-----------------|
| GOOGLE_CLIENT_ID | OAuth client ID | Google Cloud Console |
| GOOGLE_CLIENT_SECRET | OAuth client secret | Google Cloud Console |
| GOOGLE_REFRESH_TOKEN | Long-lived refresh token | Run OAuth flow once |
| INTAKE_SHEET_ID | Google Sheet ID for intakes | Create a new sheet |
| INTAKE_NOTIFY_EMAIL | Your email for notifications | fkifle@aetherisinnovations.com |
| INTAKE_EMAIL_FROM | Sender email address | fkifle@aetherisinnovations.com |

## Step 1: Create the Google Sheet

1. Go to https://sheets.new
2. Name it "Online Presence Intakes"
3. Create a tab named "Online Presence Intakes" (exactly — the API uses this)
4. Add headers in row 1:

   ```
   A1: Intake ID
   B1: Created At
   C1: Source
   D1: Tier
   E1: Name
   F1: Email
   G1: Phone
   H1: Business
   I1: Industry
   J1: Location
   K1: Website
   L1: Challenges
   M1: Goals
   ```

5. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

## Step 2: Set Up Google Cloud OAuth (if not already done)

If you already have GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN from the medspa demo, skip to Step 4.

1. Go to https://console.cloud.google.com
2. Create/select project
3. Enable APIs:
   - Google Sheets API
   - Gmail API
4. Go to APIs & Services > Credentials
5. Create OAuth 2.0 Client ID (Web application)
6. Add redirect URI: `https://developers.google.com/oauthplayground`
7. Save Client ID and Client Secret

## Step 3: Get Refresh Token

1. Go to https://developers.google.com/oauthplayground
2. Click gear (settings) in top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. Close settings
6. In the left panel, select scopes:
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/gmail.send`
7. Click "Authorize APIs"
8. Sign in with the Google account that owns the sheet
9. Click "Exchange authorization code for tokens"
10. Copy the **Refresh Token**

## Step 4: Add Env Vars to Vercel

```bash
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add GOOGLE_REFRESH_TOKEN production
vercel env add INTAKE_SHEET_ID production
vercel env add INTAKE_NOTIFY_EMAIL production
vercel env add INTAKE_EMAIL_FROM production
```

Or paste each value when prompted.

## Step 5: Deploy

```bash
vercel --prod
```

## What Happens Now

When someone submits the intake form:
1. Data writes to your Google Sheet instantly
2. You get an email notification with all details
3. Customer gets redirected to Google Calendar to book

## Troubleshooting

- **Sheet not found**: Make sure the tab name is exactly "Online Presence Intakes"
- **Auth error**: Refresh token may have expired — regenerate it
- **Email not sending**: Make sure Gmail API is enabled and the sending address matches your OAuth account
