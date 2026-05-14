function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function requiredString(value, max = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function getGoogleAccessToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth env vars are not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token refresh failed: ${response.status} ${text.slice(0, 160)}`);
  }

  const data = await response.json();
  if (!data.access_token) throw new Error('Google token response missing access_token');
  return data.access_token;
}

async function appendToSheet(accessToken, sheetId, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Contact%20Intakes!A:G:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: [values] })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Sheets append failed: ${response.status} ${text.slice(0, 160)}`);
  }

  return response.json();
}

async function sendOwnerEmail(accessToken, lead, sheetUrl) {
  const to = process.env.INTAKE_NOTIFY_EMAIL || process.env.DEMO_NOTIFY_EMAIL || 'fkifle@aetherisinnovations.com';
  const from = process.env.INTAKE_EMAIL_FROM || process.env.DEMO_EMAIL_FROM || 'fkifle@aetherisinnovations.com';
  const subject = `New contact form: ${lead.name} — ${lead.service || 'General inquiry'}`;
  const body = [
    `New contact form submission from aetherisinnovations.com`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company || 'Not provided'}`,
    `Service interest: ${lead.service || 'Not specified'}`,
    ``,
    `Message:`,
    lead.message,
    ``,
    sheetUrl ? `Contact sheet: ${sheetUrl}` : '',
    ``,
    `This is an automated notification from Aetheris Innovations website.`
  ].filter(Boolean).join('\n');

  const raw = [
    `From: Aetheris Website <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    '',
    body
  ].join('\r\n');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: base64Url(raw) })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gmail send failed: ${response.status} ${text.slice(0, 160)}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const intakeId = `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();

    const intake = {
      intake_id: intakeId,
      created_at: createdAt,
      source: requiredString(body.source || 'homepage_contact_form', 120),
      name: requiredString(body.name, 120),
      email: requiredString(body.email, 180),
      company: requiredString(body.company, 180),
      service: requiredString(body.service, 120),
      message: requiredString(body.message, 2000)
    };

    if (!intake.name || !intake.email || !intake.message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, and message are required.'
      });
    }

    const sheetId = process.env.INTAKE_SHEET_ID || process.env.DEMO_LEADS_SHEET_ID;
    const sheetUrl = sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit` : '';
    if (!sheetId) throw new Error('INTAKE_SHEET_ID (or DEMO_LEADS_SHEET_ID) is not configured');

    const accessToken = await getGoogleAccessToken();
    const row = [
      intake.intake_id,
      intake.created_at,
      intake.source,
      intake.name,
      intake.email,
      intake.company,
      intake.service,
      intake.message
    ];

    const sheetResult = await appendToSheet(accessToken, sheetId, row);
    let emailSent = false;
    let emailId = null;

    try {
      const emailResult = await sendOwnerEmail(accessToken, intake, sheetUrl);
      emailSent = true;
      emailId = emailResult.id || null;
    } catch (emailError) {
      console.error('Owner notification failed after contact was logged:', emailError.message);
    }

    return res.status(200).json({
      ok: true,
      intake_id: intake.intake_id,
      sheet_updated: true,
      updated_range: sheetResult.updates?.updatedRange || null,
      email_sent: emailSent,
      email_id: emailId
    });
  } catch (error) {
    console.error('Contact intake error:', error.message);
    return res.status(500).json({ error: 'Failed to capture contact form' });
  }
}
