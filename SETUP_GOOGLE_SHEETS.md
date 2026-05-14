# Google Sheets Setup for Aetheris Intake Forms

## What You Need

Your APIs (`/api/online-presence-intake.js` and `/api/contact-intake.js`) need Google OAuth to write to Sheets and send email via Gmail.

## Step 1: Get Google OAuth Credentials

If you already have these from the medspa demo setup, skip to Step 3.

### 1a. Create OAuth Client ID

1. Go to https://console.cloud.google.com
2. Select or create project: `aetheris-innovations-site`
3. Go to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Application type: **Web application**
6. Name: `Aetheris Website`
7. Authorized redirect URIs: Add `https://developers.google.com/oauthplayground`
8. Click **Create**
9. Copy **Client ID** and **Client Secret**

### 1b. Get Refresh Token

1. Go to https://developers.google.com/oauthplayground
2. Click the **gear icon** (top right)
3. Check **"Use your own OAuth credentials"**
4. Paste your Client ID and Client Secret
5. Close settings
6. In the left panel, select these scopes:
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/gmail.send`
7. Click **Authorize APIs**
8. Sign in with the Google account that will own the sheet
9. Click **Exchange authorization code for tokens**
10. Copy the **Refresh Token**

## Step 2: Create the Google Sheet

1. Go to https://sheets.new
2. Name it: `Aetheris Intakes`
3. **Tab 1**: Rename to `Online Presence Intakes`
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
5. **Tab 2**: Click `+` to add tab, name it `Contact Intakes`
6. Add headers in row 1:
   ```
   A1: Intake ID
   B1: Created At
   C1: Source
   D1: Name
   E1: Email
   F1: Company
   G1: Service
   H1: Message
   ```
7. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

## Step 3: Add Env Vars to Vercel

Run these commands from your project directory:

```bash
cd /root/projects/aetheris-innovations-site

TOKEN=$(cat /root/.vercel/auth.json | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

npx vercel env add GOOGLE_CLIENT_ID production --token=$TOKEN
# Paste your Client ID when prompted

npx vercel env add GOOGLE_CLIENT_SECRET production --token=$TOKEN
# Paste your Client Secret when prompted

npx vercel env add GOOGLE_REFRESH_TOKEN production --token=$TOKEN
# Paste your Refresh Token when prompted

npx vercel env add INTAKE_SHEET_ID production --token=$TOKEN
# Paste your Sheet ID when prompted

npx vercel env add INTAKE_NOTIFY_EMAIL production --token=$TOKEN
# Enter: fkifle@aetherisinnovations.com

npx vercel env add INTAKE_EMAIL_FROM production --token=$TOKEN
# Enter: fkifle@aetherisinnovations.com
```

## Step 4: Deploy

```bash
npx vercel --prod --token=$TOKEN
```

## Verification

After deploying, test both forms:
1. Submit the Online Presence intake at `/intake.html`
2. Submit the Contact form on the homepage
3. Check your Google Sheet for new rows
4. Check your email for notifications

## Troubleshooting

- **Sheet not found**: Make sure tab names are exactly `Online Presence Intakes` and `Contact Intakes`
- **Auth error**: Regenerate the refresh token (they expire)
- **Email not sending**: Ensure Gmail API is enabled in Google Cloud Console
